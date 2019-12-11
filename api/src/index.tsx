import http from "http";
import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
import helmet from "helmet";
import uuid from "uuid/v4";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import cors from "cors";

import AppRouter from "./router";
import { connect } from "./db";

//file storage config
const storageDir = path.join(__dirname, "..", "storage");

const storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, storageDir);
    },
    filename: function filename(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

const uploader = multer({ storage: storage });

const PORT = 8080;
const app = express();
app.server = http.createServer(app);

//Used to protect our headers, prevent MITM, XSS, enable HTTPs only
app.use(helmet());

app.use(cors({
    credentials: true,
    //exposedHeaders: "*",
    origin: "http://localhost:3000"
    //credentials: false
}));

//Create Redis Client
const redisClient = redis.createClient({
    host: '207.246.84.96',
    port: 6379,
    password: '5954f83a2ae3cea4be9f63c69c63945041b1b7fadacd1ad4faf46a51a3c0a923'
});

const redisStore = new RedisStore({ 
    client: redisClient,
    ttl: 5
});


app.use(
    session({
        store: redisStore,
        name: "sessionID", //Avoid using default cookie names, and use generic cookienames instead so attackers can't guess the tech you are using and launch specified attacks.
        secret: uuid(),
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 5 * 60 * 1000,
            secure: false,
            sameSite: false,
            httpOnly: true
        }
    })
);

app.use(bodyParser.urlencoded({
    limit: "1mb",
    extended: true
}));

app.use(bodyParser.json({
    limit: "1mb",
    extended: true
}))

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
);

declare var process; process.env.PORT = 8080;
declare var __dirname; //decalre __dirname with typescript?
app.set("root", __dirname);
app.set("storageDir", storageDir);


connect((connection) => {
    //Sets the database in our application, we initialize our router with (app) so that we can acccess this.
    //app.db = connection;
    app.set("db", connection);
    app.set("redisClient", redisClient);
    app.set("redisStore", redisStore);
    app.set("uploader", uploader);
    //init router
    new AppRouter(app);

    redisClient.on('error', console.error)
    
    app.server.listen(process.env.PORT || PORT, function () {
        console.log("App is running on port " + app.server.address().port, + process.env.PORT);
        console.log(`Database has started`);
        console.log(`Redis Connected: ${redisClient.connected}`)
    });
});