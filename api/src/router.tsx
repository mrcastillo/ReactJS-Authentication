import _ from "lodash";
import bcrypt from "bcryptjs";
import { Model } from "sequelize/lib/sequelize";
import { isEmail, alphanumericUsername, validPassword } from "./validations/JoiValidator";


interface sessionInterface {
    user: string,
    error?: any
};

interface standardResponse {
    message?: Array<string>,
    error?: Array<string>,
    payload?: any
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

        app.get("/", async (req, res) => {
            try {
                const createSubject = await db.models.forumSubjects.create({
                    subject: "Introduction",
                    description: "Welcome to the forum! Introduce yourself to everyone here."
                });
                res.send(createSubject); res.end();
            } catch (e) {
                console.error(e);
                res.status(500).send(null);
            }
        });

        //Checks the user session and returns the session
        app.get("/forum/session", (req, res) => {
            const userSession: sessionInterface = {
                user: req.session.user ? req.session.user : "",
                error: null
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
            if(req.session.user) //Check if we have a user in session already
            {
                res.status(500).send("Unavailable");
                res.end();
                return;
            }
            
            //Get post variables from user
            const userSubmittedEmail = req.body.email;
            const userSubmittedPassword = req.body.password;
            //Validation Booleans
            const emailValidation = isEmail(userSubmittedEmail).validated;
            const usernameValidation = alphanumericUsername(userSubmittedEmail).validated;
            const passwordValidation = validPassword(userSubmittedPassword).validated;
            
            //Check if email or username is validated and true, and if password validation is true
            if((emailValidation || usernameValidation) && passwordValidation) { 
                try { //Try to find a user from the database
                    //Returns user or NULL if not found
                    const userFromDB = await db.models.user.findOne({
                        where: {
                            [db.Op.or]: [{email: userSubmittedEmail}, {username: userSubmittedEmail}]
                        }
                    });

                    //Can also change this to username not found
                    if(!userFromDB){ 
                        res.send({error: ["Invalid Email/Username or Pasword."]});
                        res.end();
                        return;
                    }
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
                        res.send({ error: ["Invalid Password."]}); res.end();
                    }
                } catch(e) {
                    console.error(e);
                    res.send({error: ["Invalid Email/Username or Pasword."]});
                    res.end();
                }
            } else {
                res.send({error: ["Invalid Email/Username or Pasword."]});
                res.end();
            }
        });

        app.get("/account/logout", async (req, res) => {

            if(!req.session.user) {
                res.status(500).send(null); res.end();
                return;
            }

            try {
                await store.destroy(req.sessionID);
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
                res.status(500).send(null); res.end();
                return;
            }
            //Declare our variables
            const userEmail = req.body.email;
            const userUsername = req.body.username.toLowerCase();
            const userPassword = req.body.password;

            //Check if our user inputs are validated
            const validEmail = isEmail(userEmail).validated;
            const validUsername = alphanumericUsername(userUsername).validated;
            const isValidPassword =  validPassword(userPassword).validated;

            if(!validUsername || !validEmail || !isValidPassword) {
                res.status(500).send(null); res.end();
                return;
            }

            const bcryptSalt = await bcrypt.genSalt(10);
            const userHashedPassword = await bcrypt.hash(userPassword, bcryptSalt);

            try {
                const createUser = await db.models.user.create({
                    email: userEmail,
                    username: userUsername,
                    password: userHashedPassword,
                    role: 1
                });
                console.log(createUser);
                res.send({
                    error: false,
                    message: true
                }); res.end(); return;
                
            } catch (e) {
                console.error(e);
                if(e.parent.errno === 1062) {
                    const errorPath = e.errors[0].path.charAt(0).toUpperCase() + e.errors[0].path.slice(1);
                    res.send({error: true, message: [`${errorPath} already exist.`]});
                    res.end(); return;
                }
                
                res.status(500).send(null); res.end(); return;
            }
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

        app.post("/account/delete", async (req, res) => { 
            if(!req.session.user) {
                res.status(500).send(null);
                res.end(); return;
            }

            const isPasswordValid = validPassword(req.body.password).validated;

            if(!isPasswordValid) {
                res.status(500).send(null);
                res.end(); return;
            };

            try {
                const findUser = await db.models.user.findOne({
                    where: {
                        username: req.session.user
                    }
                });

                const userDBPassword = findUser.password;
                const checkPassword = await bcrypt.compare(req.body.password, userDBPassword);
                
                if(checkPassword) {
                    const didUserGetRemoved = await db.models.user.destroy({
                        where: {
                            username: req.session.user
                        },
                        limit: 1
                    });
                    
                    if(didUserGetRemoved === 0) {
                        res.send({
                            error: true,
                            message: ["Unable to remove user. Please try again later or Contact an Administrator."]
                        });
                        res.end(); return;
                    };

                    await req.session.destroy();
                    await store.destroy(req.sessionID);
                    
                    res.send({
                        error: false,
                        message: ["We have removed the user!"]
                    });
                    res.end(); return;
                } else {
                    res.send({
                        error: true,
                        message: ["You have entered an invalid password."]
                    })
                    res.end(); return;
                }
            } catch (e) {
                console.error(e);
                res.status(500).send(null);
                res.end(); return;
            }
        });
    }
}


export default AppRouter;