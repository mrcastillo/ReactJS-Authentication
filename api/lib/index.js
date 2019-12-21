"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _redis = _interopRequireDefault(require("redis"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectRedis = _interopRequireDefault(require("connect-redis"));

var _helmet = _interopRequireDefault(require("helmet"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _router = _interopRequireDefault(require("./router"));

var _db = require("./db");

var RedisStore = (0, _connectRedis["default"])(_expressSession["default"]);

//file storage config
var storageDir = _path["default"].join(__dirname, "..", "storage");

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, storageDir);
  },
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var uploader = (0, _multer["default"])({
  storage: storage
});
var PORT = 8080;
var app = (0, _express["default"])();
app.server = _http["default"].createServer(app); //Used to protect our headers, prevent MITM, XSS, enable HTTPs only

app.use((0, _helmet["default"])());
app.use((0, _cors["default"])({
  credentials: true,
  //exposedHeaders: "*",
  origin: "http://localhost:3000" //credentials: false

})); //Create Redis Client

var redisClient = _redis["default"].createClient({
  host: '207.246.84.96',
  port: 6379,
  password: '5954f83a2ae3cea4be9f63c69c63945041b1b7fadacd1ad4faf46a51a3c0a923'
});

var redisStore = new RedisStore({
  client: redisClient
});
app.use((0, _expressSession["default"])({
  store: redisStore,
  name: "sessionID",
  //Avoid using default cookie names, and use generic cookienames instead so attackers can't guess the tech you are using and launch specified attacks.
  secret: (0, _v["default"])(),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 5 * 60 * 1000,
    secure: false,
    sameSite: false,
    httpOnly: true
  }
}));
app.use(_bodyParser["default"].urlencoded({
  limit: "1mb",
  extended: true
}));
app.use(_bodyParser["default"].json({
  limit: "1mb",
  extended: true
}));
app.use((0, _morgan["default"])(':method :url :status :res[content-length] - :response-time ms'));
process.env.PORT = 8080;
//decalre __dirname with typescript?
app.set("root", __dirname);
app.set("storageDir", storageDir);
(0, _db.connect)(function (connection) {
  //Sets the database in our application, we initialize our router with (app) so that we can acccess this.
  //app.db = connection;
  app.set("db", connection);
  app.set("redisClient", redisClient);
  app.set("redisStore", redisStore);
  app.set("uploader", uploader); //init router

  new _router["default"](app);
  redisClient.on('error', console.error);
  app.server.listen(process.env.PORT || PORT, function () {
    console.log("App is running on port " + app.server.address().port, +process.env.PORT);
    console.log("Database has started");
    console.log("Redis Connected: ".concat(redisClient.connected));
  });
});