import _ from "lodash";
import bcrypt from "bcryptjs";


interface sessionInterface {
    apiRequestCompleted: boolean,
    user: string
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
            const userSubmittedData = req.body;
            
            db.models.user.findOne({
                where: {
                    email: userSubmittedData.email
                }
            })
            .then((queryResult) => {
                if(queryResult === null) {
                    res.send({
                        user: ""
                    });
                    res.end();
                }
                else {
                    bcrypt.compare(userSubmittedData.password, queryResult.dataValues.password, (err, isValidHash) => {
                        if(err) {
                            console.error(err);
                            res.send({
                                user: ""
                            });
                            res.end();
                        }
                        if(isValidHash) {
                            console.log("isValidHash is true");
                            req.session.email = queryResult.dataValues.email;
                            res.send({
                                user: req.session.email
                            });
                            res.end()
                        }
                        else {
                            console.log("isValidHash is false.")
                            res.send({
                                user: ""
                            });
                            res.end();
                        }
                    });
                };
            })
            .catch((err) => {
                console.log(err);
                res.send({
                    user: ""
                });
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
    }
}


export default AppRouter;