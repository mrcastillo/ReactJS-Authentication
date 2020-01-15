import _ from "lodash";
import bcrypt from "bcryptjs";
import { Model } from "sequelize/lib/sequelize";
import { isEmail, alphanumericUsername, validPassword } from "./validations/JoiValidator";


interface sessionInterface {
    user?: string,
    serverReplied?: boolean,
    error?: any
};
interface regularResponse {
    data: object,
    error: object
}

class AppRouter {
    constructor(app){
        this.app = app;
        this.setupRouters();
    }

    setupRouters(){
        const app = this.app;
        const db = app.get("db");
        //const redis = app.get("redisClient");
        const store = app.get("redisStore");
        //const uploader = app.get("uploader");

        //Checks the user session and returns the session
        app.get("/forum/session", (req, res) => {
            const userSession: sessionInterface = {
                serverReplied: true,
                user: req.session.user ? req.session.user : ""
            };
            res.send(userSession); res.end();
        });

        //Show Forum Categories
        app.get("/forum", async (req, res) => {
            try {
                const categories = await db.models.forumSubjects.findAll();
                res.send(categories); res.end();
            } catch (e) {
                res.status(500).send(null); res.end();
            }
        });

        //Show Forum Threads
        app.get("/forum/:subjectId", async (req, res) => {
            const subjectId = req.params.subjectId;
            try {
                const threads = await db.models.forumThreads.findAll({
                    where: {
                        forumSubjectId: subjectId
                    },
                    include: [{
                        model: db.models.user,
                        attributes: {
                            exclude: ["id", "password", "role", "createdAt", "updatedAt"]
                        }
                    }]
                });

                res.send(threads); res.end();
            } catch(e) {
                console.error("Error with getting forum threads. ", e);
                res.status(500).send(null);
            }
        });


        app.get("/forum/:subjectId/:threadId", async (req, res) => {
            const subjectId = req.params.subjectId;
            const threadId = req.params.threadId;

            //Try to get all post from thread in the DB.
            try {
                const threadPosts = await db.models.forumThreads.findOne({
                    where: {
                        id: threadId,
                        forumSubjectId: subjectId
                    },
                    include: [{
                        model: db.models.forumPosts,
                        include: [{
                            model: db.models.user,
                            attributes: {
                                exclude: ["id", "password", "role", "createdAt", "updatedAt"]
                            }
                        }]
                    }]
                });
                //Send all post in the thread
                res.send(threadPosts); res.end();
            } catch (e) {
                console.error("Error with getting thread posts", e);
                res.status(500).send(null); res.end();
            }
        });

        app.post("/forum/newthread", async (req, res) => {
            if(!req.session.user) {
                res.status(500).send("Unavailable.");
                return;
            };
            //SESSION
            const user = req.session.user;
            const userId = req.session.userId;
            //REQ BODY
            const forumSubjectId = req.body.forumSubjectId;
            const threadTitle = req.body.title;
            const threadBody = req.body.comment;

            try {
                const createPost = await db.models.forumThreads.create({
                    threadTitle,
                        originalComment: threadBody,
                        originalPoster: user,
                        userId,
                        forumSubjectId
                });
                res.send(createPost); res.end();
            } catch (e) {
                console.error(e);
                res.status(500).send(null);
            }
        });

        app.post("/forum/login", async (req, res) => {
            if(req.session.user)
            {
                res.status(500).send("Unavailable");
                res.end();
                return;
            }
            
            //Get post variables from user
            const userSubmittedEmail = req.body.email;
            const userSubmittedPassword = req.body.password;
            
            const emailValidation = isEmail(userSubmittedEmail).validated;
            const usernameValidation = alphanumericUsername(userSubmittedEmail).validated;
            const passwordValidation = validPassword(userSubmittedPassword).validated;
            
            if((emailValidation || usernameValidation) && passwordValidation) {

                try {
                    const userFromDB = await db.models.user.findOne({
                        where: {
                            [db.Op.or]: [{email: userSubmittedEmail}, {username: userSubmittedEmail}]
                        }
                    });

                    //Checks to see if submittedpassword matches with db password.
                    const passwordMatch = await bcrypt.compare(userSubmittedPassword, userFromDB.dataValues.password); 
                    
                    if(passwordMatch === true) { //Password Matches
                        //SETS THE SESSION, SESSION IS SET HERE
                        req.session.user = userFromDB.dataValues.username;
                        req.session.email = userFromDB.dataValues.email;
                        req.session.userId = userFromDB.dataValues.id;
                        //Login Response
                        //Returns back an object featuring the user
                        res.send({user: req.session.user}); res.end();
                    } //Password Dont match
                    else {
                        res.send({ errors: ["Invalid Password."]}); res.end();
                    }
                } catch(e) {
                    console.error(e);
                    res.send({errors: ["Invalid Email/Username or Pasword."]});
                    res.end();
                }
            } else {
                res.send({errors: ["Invalid Email/Username or Pasword."]});
                res.end();
            }
        });

        app.get("/account/logout", async (req, res) => {

            if(!req.session.user) {
                res.status(500).send(null); res.end();
                return;
            }

            try {
                await store.destroy();
                await req.session.destroy();
                res.send({ serverReplied: true, user: "" });
                res.end();
            } catch(e) {
                console.error(e);
                res.send({ serverReplied: true, user: "" });
                res.end();
            }
        });

        app.post("/account/signup", async (req, res) => {
            if(req.session.user){
                res.status(500).send(null);
                return;
            }
            const validUsername = alphanumericUsername(req.body.username).validated;
            const validEmail = isEmail(req.body.email).validated;
            const isValidPassword =  validPassword(req.body.password);

            if(!validUsername || !validEmail || !isValidPassword) {
                res.status(500).send(null);
                return;
            }

            try {
                const createUser = db.models.user.create({
                    username: req.body.username.toLowerCase(),
                    email: req.body.email,
                    password: req.body.password,
                    role: 1
                });

            } catch (e) {
                console.error(e);
                res.status(500).send(null);
            }
        };

        app.post("/forum/signup", (req, res) => {
            const userPostedData =  req.body;

            db.models.user.create({
                username: userPostedData.username.toLowerCase(),
                email: userPostedData.email,
                password: userPostedData.password,
                role: 1
            })
            .then(() => {
                console.log("User Created!");
                res.send(true);
                res.end()
            })
            .catch((err) => {
                const errorCode = err.parent.errno;
                var errorMsg = [];
                switch(errorCode) {
                    case 1062:
                        let validationPathError = err.errors[0].path;
                        validationPathError = validationPathError[0].toUpperCase() + validationPathError.slice(1);
                        errorMsg.push(`${validationPathError} is already in use.`)
                        break;
                        default:
                            errorMsg.push("There was an internal server error.");
                }

                res.send({
                    errors: errorMsg
                }as sessionInterface);
                res.end();
            })
        });

        //Need to perform validation on the backend.
        app.post("/forum/account/changepassword", async (req, res) => {
            //Check if we are logged in first and return out of the request is so.
            if(!req.session.user) {
                res.status(500).send("Unavailable.");
                return;
            }

            const submittedPassword = req.body.password;
            const submittedNewPassword = req.body.newPassword;

            //Return the user object from the DB, NULL if not found
            const userFromDB = await db.models.user.findOne({
                where: {
                    username: "peach"
                }
            });
            
            //Checks if we returned a user.
            if(userFromDB) {
                //Check if user has inputted the samee password in the DB 
                const areDBandNewPasswordSame = await bcrypt.compare(submittedNewPassword, userFromDB.password);
                //Get out of the request is the passwords are the same
                if(areDBandNewPasswordSame) {
                    res.send({errors: ["New Password cannot be the same as old password."]});
                    res.end();
                    return;
                }

                console.log(userFromDB.password, submittedPassword)
                //Check if the actual passwords matches that in the DB
                const doPasswordsMatch = await bcrypt.compare(submittedPassword, userFromDB.password);
                console.log(doPasswordsMatch)
                if(doPasswordsMatch) {
                    const bcryptSalt = await bcrypt.genSalt(10);
                    const bcryptHash = await bcrypt.hash(submittedNewPassword, bcryptSalt);

                    const updateUserPassword = await db.models.user.update({password: bcryptHash},{where: {username: "peach"}});

                    res.send(updateUserPassword)
                    res.end();
                } else {
                    res.send({
                        errors: ["Current Password is invalid"]
                    });
                    res.end();
                }
            }
        });

        app.post("/forum/account/delete", (req, res) => {
        //const user = req.session.user;
        const user  = req.session.user;
        const userSubmittedPasssword = req.body.password;
        
        db.models.user.findOne({
            where: {
                email: user
            }
        })
        .then((queryResult) => {
            if(queryResult){
                const userPassword = queryResult.dataValues.password;
                bcrypt.compare(userSubmittedPasssword, userPassword, (err, passwordsMatch) => {
                    if(err) {
                        throw err;
                    }
                    if(passwordsMatch) {
                        store.destroy(req.sessionID, (err) => {
                            if(err) {
                                console.error("Unable to destroy redis session\n", err);
                                res.send({
                                    errors: true,
                                    messages: ["Unable to destroy redis session"]
                                });
                                res.end();
                            };
                            req.session.destroy((err) => {
                                if(err) {
                                    console.error("Unable to destroy express session.\n", err);
                                    res.send({
                                        errors: true,
                                        messages: ["Unable to destroy express session"]
                                    });
                                    res.end();  
                                }
                                
                                db.models.user.destroy({
                                    where: {
                                        email: user
                                    },
                                    limit: 1
                                })
                                .then((userDestroyed) => {
                                    if(userDestroyed > 0) {
                                        res.send({
                                            errors: false,
                                            messages: ["We have removed the user!"]
                                        }).
                                        res.end();
                                    }
                                    else {
                                        res.send({
                                            errors: true,
                                            messages: ["We have not removed any user.."]
                                        })
                                        res.end();
                                    }
                                })
                                .catch((err) => {
                                    throw err;
                                    res.send("there was an error");
                                    res.end();
                                })
                            });
                        });
                        
                    }
                    else {
                        res.send({
                            errors: true,
                            messages: ["Passwords didnt match"]
                        });
                        res.end();
                    }
                });
            }
            else {
                //USER NOT FOUND
                console.error("THERE IS NO USER RETURNED")
            }
        })
        .catch((err) => {
                //ERROR ON FINDONE QUERY
                console.error(err);
            })
        });
    }
}


export default AppRouter;