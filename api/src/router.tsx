import _ from "lodash";
import bcrypt from "bcryptjs";


interface sessionInterface {
    apiRequestCompleted: boolean,
    user: string,
    error?: any
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

        app.get("/forum/session", (req, res) => {
            const userSession: sessionInterface = {
                apiRequestCompleted: true,
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
                apiRequestCompleted: true,
                user: req.session.user
            });
            res.end();
        });

        app.post("/forum/login", (req, res) => {
            //Return variable from our POST data for our user data.
            const userSubmittedPOSTData = req.body;
            console.log("Test1")
            //Query the DB using the "User" model to find one entry in the table where user submitted email matches it in the database.
            db.models.user.findOne({
                where: {
                    email: userSubmittedPOSTData.email
                }
            })
            .then((findUserQueryResult) => {
                //If we did not find a result from our query send back an error.
                if(findUserQueryResult === null) {
                    console.log("Test2")
                    res.status(500).send({
                        apiRequestCompleted: true, user: ""
                    });
                    res.end();
                }
                else {
                    //Compare the user password to the hash in the DB
                    bcrypt.compare(userSubmittedPOSTData.password, findUserQueryResult.dataValues.password, (err, bcryptHashIsMatching) => {
                        //Error if bcrypt compare didnt work for whatever reason.
                        if(err) {
                            console.error("There was an error with bcrypt compare function.", err);
                            res.status(500).send();
                            res.end();
                        }
                        //Execute if we find a valid hash (Passwords Match);
                        if(bcryptHashIsMatching) {
                            //SETS THE SESSION, SESSION IS SET HERE
                            req.session.user = findUserQueryResult.dataValues.email;
        
                            //Login Response
                            //Returns back an object featuring the user
                            res.send({
                                apiRequestCompleted: true,
                                user: req.session.user
                            });
                            res.end();
                        } else {
                            console.error("bcrypt not matching")
                            res.status(500).send({});
                            res.end();
                        }
                    })
                }
            })
            .catch((err) => {
                console.error("There was an error running the find user query.")
                res.status(500).send();
                res.end();
            })
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
                console.error("There was an error creating the user.\n", err);
                res.send(false);
                res.end();
            })
        });

        app.get("/forum/logout", (req ,res) => {
            const destroyedSession: sessionInterface = {
                apiRequestCompleted: true,
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
            const userSubmittedData = req.body;
            console.log(req.session.user)
            //Update the user's password
            //First check if the password is the same password in the database.

            db.models.user.findOne({
                where: {
                    email: req.session.user
                }
            })
            .then((queryResult) => {
                if(queryResult === null) {
                    console.log("Test2")
                    res.status(500).send({
                        apiRequestCompleted: true, user: ""
                    });
                }
                else {
                    const userPassword = queryResult.dataValues.password;
                    bcrypt.compare(userSubmittedData.password, userPassword, (err, passwordsMatch) => {
                        if(err){
                            console.error("There was an error with the compare function");
                            res.send({
                                errors: ["There was an error with the compare function."]
                            });
                            res.end();
                        }
                        else {
                            if(passwordsMatch){
                                bcrypt.genSalt(10, (err, salt) => {
                                    if(err) {
                                        console.error(err);
                                    };
                                    bcrypt.hash(userSubmittedData.newPassword, salt, (err, hash) => {
                                        db.models.user.update({
                                            password: hash
                                        },
                                        {
                                            where: {
                                                email: req.session.user
                                            }
                                        })
                                        .then((queryResult) => {
                                            console.log(queryResult[0]);
                                            if(queryResult) {
                                                console.log("yes")
                                                res.send({
                                                    message: "Completed...",
                                                    status: true
                                                });
                                                res.end();
                                            }
                                            else {
                                                console.log("no")
                                                res.send({
                                                    message: "Completed...",
                                                    status: false
                                                });
                                                res.end();
                                            }
                                            
                                        })
                                    });
                                });
                            }
                            else {
                                console.log("Passwords dont match");
                                res.send({
                                    errors: ["Current Password is invalid."]
                                });
                                res.end();
                            }
                        }
                    })
                }
            })
            .catch((err) => {
                console.error(err);
            })
            /*
            db.models.user.update({
                password: userSubmittedData.newPassword
            }, 
            {
                where: {
                    email: req.session.email
                }
            })
            .then((updateQueryResult) => {
                console.log(updateQueryResult);
            })
            .catch((err) => {
                console.error(err);

            })
            */
        });
    }
}


export default AppRouter;