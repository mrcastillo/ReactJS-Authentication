"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var AppRouter =
/*#__PURE__*/
function () {
  function AppRouter(app) {
    (0, _classCallCheck2["default"])(this, AppRouter);
    this.app = app;
    this.setupRouters();
  }

  (0, _createClass2["default"])(AppRouter, [{
    key: "setupRouters",
    value: function setupRouters() {
      var app = this.app;
      var db = app.get("db"); //const redis = app.get("redisClient");

      var store = app.get("redisStore"); //const uploader = app.get("uploader");

      app.get("/forum/session", function (req, res) {
        var userSession = {
          apiRequestCompleted: true,
          user: req.session.user ? req.session.user : ""
        };

        if (req.session.user) {
          res.send(userSession);
          res.end();
        } else {
          res.send(userSession);
          res.end();
        }
      });
      app.get("/forum/fakelogin", function (req, res) {
        req.session.user = "Anthony";
        console.log(req.session.user);
        res.send({
          apiRequestCompleted: true,
          user: req.session.user
        });
        res.end();
      });
      app.post("/forum/login", function (req, res) {
        //Return variable from our POST data for our user data.
        var userSubmittedPOSTData = req.body;
        console.log("Test1"); //Query the DB using the "User" model to find one entry in the table where user submitted email matches it in the database.

        db.models.user.findOne({
          where: {
            email: userSubmittedPOSTData.email
          }
        }).then(function (findUserQueryResult) {
          //If we did not find a result from our query send back an error.
          if (findUserQueryResult === null) {
            console.log("Test2");
            res.status(500).send({
              apiRequestCompleted: true,
              user: ""
            });
            res.end();
          } else {
            //Compare the user password to the hash in the DB
            _bcryptjs["default"].compare(userSubmittedPOSTData.password, findUserQueryResult.dataValues.password, function (err, bcryptHashIsMatching) {
              //Error if bcrypt compare didnt work for whatever reason.
              if (err) {
                console.error("There was an error with bcrypt compare function.", err);
                res.status(500).send();
                res.end();
              } //Execute if we find a valid hash (Passwords Match);


              if (bcryptHashIsMatching) {
                //SETS THE SESSION, SESSION IS SET HERE
                req.session.user = findUserQueryResult.dataValues.email; //Login Response
                //Returns back an object featuring the user

                res.send({
                  apiRequestCompleted: true,
                  user: req.session.user
                });
                res.end();
              } else {
                console.error("bcrypt not matching");
                res.status(500).send({});
                res.end();
              }
            });
          }
        })["catch"](function (err) {
          console.error("There was an error running the find user query.");
          res.status(500).send();
          res.end();
        });
      });
      app.post("/forum/signup", function (req, res) {
        var userPostedData = req.body;
        db.models.user.create({
          email: userPostedData.email,
          password: userPostedData.password
        }).then(function () {
          console.log("User Created!");
          res.send(true);
          res.end();
        })["catch"](function (err) {
          console.error("There was an error creating the user.\n", err);
          res.send(false);
          res.end();
        });
      });
      app.get("/forum/logout", function (req, res) {
        var destroyedSession = {
          apiRequestCompleted: true,
          user: ""
        };

        if (req.session.user) {
          //destroy session
          store.destroy(req.sessionID, function (err) {
            if (err) {
              console.error("Unable to destroy redis session\n", err);
              res.send(destroyedSession);
              res.end();
            }

            ;
            req.session.destroy(function (err) {
              if (err) {
                console.error("Unable to destroy express session.\n", err);
                res.send(destroyedSession);
                res.end();
              }

              res.send(destroyedSession);
              res.end();
            });
          });
        } else {
          res.send(destroyedSession);
          res.end();
        }
      });
    }
  }]);
  return AppRouter;
}();

var _default = AppRouter;
exports["default"] = _default;