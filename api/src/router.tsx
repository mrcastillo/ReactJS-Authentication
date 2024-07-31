import _ from "lodash";
//import bcrypt from "bcryptjs";
//import { Model } from "sequelize/lib/sequelize";
//import { isEmail, alphanumericUsername, validPassword } from "./validations/JoiValidator";


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
        //const store = app.get("redisStore");
        const uploader = app.get("uploader");

        app.get("/", async (req, res) => {
            res.send("Welcome to the forum!");
            res.end();
        });
    }
};


export default AppRouter;