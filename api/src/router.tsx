import _ from "lodash";
import bcrypt from "bcryptjs";


interface sessionInterface {
    user?: string,
    serverReplied?: boolean,
    error?: any
};

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

        app.get("/forum/session", (req, res) => {
            const userSession: sessionInterface = {
                serverReplied: true,
                user: req.session.user ? req.session.user : ""
            };

            if(req.session.user) {
                res.send(userSession);
                res.end();
            }
            else {
                res.send(userSession);
                res.end();
            }
        });

        app.get("/forum/fakelogin", (req, res) => {
            req.session.user = "Anthony";
            console.log(req.session.user)
            res.send({
                serverReplied: true,
                user: req.session.user
            });
            res.end();
        });

        app.post("/forum/login", (req, res) => {
            //Return variable from our POST data for our user data.
            const userSubmittedPOSTData = req.body;
            const userSubmittedEmail = req.body.email;
            const userSubmittedPassword = req.body.password;

            //Query the DB using the "User" model to find one entry in the table where user submitted email matches it in the database.
            db.models.user.findOne({
                where: {
                    email: userSubmittedEmail
                }
            })
            .then((findUserQueryResult) => {

                //Store DB PAssword
                const dbPassword = findUserQueryResult.dataValues.password
                //If we did not find a result from our query send back an error.
                if(findUserQueryResult === null) {
                    //Send back error to client that user was not found
                    res.send({
                        serverReplied: true,
                        user: "",
                        errors: ["Please check your email and password."]

                    } as sessionInterface);
                    res.end();
                }
                else {
                    //Compare the user password to the hash in the DB
                    bcrypt.compare(userSubmittedPassword, dbPassword, (err, bcryptHashIsMatching) => {
                        //Error if bcrypt compare didnt work for whatever reason.
                        if(err) {
                            console.error("There was an error with bcrypt compare function.", err);
                            res.status({
                                errors: ["There wasn an internal server error."]
                            } as sessionInterface);
                            res.end();
                        }
                        //Execute if we find a valid hash (Passwords Match);
                        if(bcryptHashIsMatching) {
                            //SETS THE SESSION, SESSION IS SET HERE
                            req.session.user = findUserQueryResult.dataValues.email;
                            
                            //Login Response
                            //Returns back an object featuring the user
                            res.send({
                                user: req.session.user
                            });
                            res.end();
                        } else {
                            //User does not match DB password
                            res.send({
                                errors: ["Invalid Password."]
                            } as sessionInterface);
                            res.end();
                        }
                    })
                }
            });
        });

        app.post("/forum/signup", (req, res) => {
            const userPostedData =  req.body;
            db.models.user.create({
                email: userPostedData.email,
                password: userPostedData.password
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
                        errorMsg.push("Email already in use. Please use another email adress.");
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

        app.get("/forum/logout", (req ,res) => {
            const destroyedSession: sessionInterface = {
                serverReplied: true,
                user: ""
            }
            
            if(req.session.user) {
                //destroy session
                store.destroy(req.sessionID, (err) => {
                    if(err) {
                        console.error("Unable to destroy redis session\n", err);
                        res.send(destroyedSession);
                        res.end();
                    };
                    req.session.destroy((err) => {
                        if(err) {
                            console.error("Unable to destroy express session.\n", err);
                            res.send(destroyedSession);
                            res.end();   
                        }
                        res.send(destroyedSession);
                        res.end();
                    });
                })
            }
            else {
                res.send(destroyedSession);
                res.end();
            }
        });

        app.post("/forum/account/changepassword", (req, res) => {
            const userSubmittedPassword = req.body.password;
            const userSubbmitedNewPassword = req.body.newPassword;
            //Search for the user inside the database, so that we can check on the user stored password
            db.models.user.findOne({
                where: {
                    email: req.session.user
                }
            })
            .then((queryResult) => {
                //If no user by req.session.user then logout, wont happen since we are logged in from the req.session.user
                if(queryResult === null) {
                    console.log("NO USER IN DB AFTER CHANGE PASSWORD REQUEST")
                    res.status(500).send({
                        errors: ["User is not logged in or does not exist."]
                    } as sessionInterface);
                }
                else {
                    //Copy the password from the database
                    const userPassword = queryResult.dataValues.password;
                    
                    //Compare the user submitted passord to the hash inside the DB(our user password)
                    bcrypt.compare(userSubmittedPassword, userPassword, (err, passwordsMatch) => {
                        //There was an error with the compare function
                        if(err){
                            console.error("There was an error with the compare function");
                            res.send({
                                errors: ["There was an error with the compare function."]
                            });
                            res.end();
                        }
                        else {
                            //Checks the boolean result of bcrypt.compare
                            //If the passwords match, we hash the new password submitted by the user.
                            if(passwordsMatch){
                                //Salt Password
                                bcrypt.genSalt(10, (err, salt) => {
                                    if(err) {
                                        console.error(err);
                                        return;
                                    };
                                    //Hash user submitted new  password with salt
                                    bcrypt.hash(userSubbmitedNewPassword, salt, (err, hash) => {
                                        if(err) {
                                            console.error(err);
                                            return;
                                        };
                                        //Update model password where email matches req.session.user(that we get from login) to contain the newl hashed password
                                        db.models.user.update({
                                            password: hash
                                        },
                                        {
                                            where: {
                                                email: req.session.user
                                            }
                                        })
                                        .then((queryResult) => {
                                            //Checks the query result
                                            //Query result returns an array with a number
                                            const didUserUpdate = queryResult[0];
                                            if(didUserUpdate) {
                                                res.send({
                                                    serverReplied: true
                                                } as sessionInterface);
                                                res.end();
                                            }
                                            else {
                                                res.send({
                                                    errors: ["There was an internal server error"]
                                                } as sessionInterface);
                                                res.end();
                                            }
                                        })
                                        .catch((err) => {
                                            res.send({
                                                errors: ["There was an internal server error"]
                                            });
                                            res.end();
                                        })
                                    });
                                });
                            }
                            else {
                                console.log("Passwords dont match");
                                res.send({
                                    errors: ["Current Password is invalid."],
                                    status:  false
                                });
                                res.end();
                            }
                        }
                    })
                }
            })
            .catch((err) => {
                console.error(err);
                res.send({
                    errors: ["There was an error with the findone query"],
                    status: false
                });
                res.end();
            });
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
        /*
            
            if(user) {

            }
            else {
                res.send({
                    errors: [""],
                    status: false
                });
                res.end();
            }
        */
        });
    }
}


export default AppRouter;