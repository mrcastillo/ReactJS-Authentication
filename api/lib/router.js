"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

;

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
          serverReplied: true,
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
      app.post("/forum/login", function (req, res) {
        //Return variable from our POST data for our user data.
        var userSubmittedPOSTData = req.body;
        var userSubmittedEmail = req.body.email;
        var userSubmittedPassword = req.body.password; //Query the DB using the "User" model to find one entry in the table where user submitted email matches it in the database.

        db.models.user.findOne({
          where: {
            email: userSubmittedEmail
          }
        }).then(function (findUserQueryResult) {
          //If we did not find a result from our query send back an error.
          if (findUserQueryResult === null) {
            //Send back error to client that user was not found
            res.send({
              serverReplied: true,
              user: "",
              errors: ["Please check your email and password."]
            });
            res.end();
          } else {
            //Store DB PAssword
            var dbPassword = findUserQueryResult.dataValues.password; //Compare the user password to the hash in the DB

            _bcryptjs["default"].compare(userSubmittedPassword, dbPassword, function (err, bcryptHashIsMatching) {
              //Error if bcrypt compare didnt work for whatever reason.
              if (err) {
                console.error("There was an error with bcrypt compare function.", err);
                res.status({
                  errors: ["There wasn an internal server error."]
                });
                res.end();
              } //Execute if we find a valid hash (Passwords Match);


              if (bcryptHashIsMatching) {
                //SETS THE SESSION, SESSION IS SET HERE
                req.session.user = findUserQueryResult.dataValues.email;
                req.session.userId = findUserQueryResult.dataValues.id; //Login Response
                //Returns back an object featuring the user

                res.send({
                  user: req.session.user
                });
                res.end();
              } else {
                //User does not match DB password
                res.send({
                  errors: ["Invalid Password."]
                });
                res.end();
              }
            });
          }
        });
      });
      app.post("/forum/signup", function (req, res) {
        var userPostedData = req.body;
        db.models.user.create({
          email: userPostedData.email,
          password: userPostedData.password,
          role: 1
        }).then(function () {
          console.log("User Created!");
          res.send(true);
          res.end();
        })["catch"](function (err) {
          var errorCode = err.parent.errno;
          var errorMsg = [];

          switch (errorCode) {
            case 1062:
              errorMsg.push("Email already in use. Please use another email adress.");
              break;

            default:
              errorMsg.push("There was an internal server error.");
          }

          res.send({
            errors: errorMsg
          });
          res.end();
        });
      });
      app.get("/forum/logout", function (req, res) {
        var destroyedSession = {
          serverReplied: true,
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
      app.post("/forum/account/changepassword", function (req, res) {
        var userSubmittedPassword = req.body.password;
        var userSubbmitedNewPassword = req.body.newPassword; //Search for the user inside the database, so that we can check on the user stored password

        db.models.user.findOne({
          where: {
            email: req.session.user
          }
        }).then(function (queryResult) {
          //If no user by req.session.user then logout, wont happen since we are logged in from the req.session.user
          if (queryResult === null) {
            console.log("NO USER IN DB AFTER CHANGE PASSWORD REQUEST");
            res.status(500).send({
              errors: ["User is not logged in or does not exist."]
            });
          } else {
            //Copy the password from the database
            var userPassword = queryResult.dataValues.password; //Compare the user submitted passord to the hash inside the DB(our user password)

            _bcryptjs["default"].compare(userSubmittedPassword, userPassword, function (err, passwordsMatch) {
              //There was an error with the compare function
              if (err) {
                console.error("There was an error with the compare function");
                res.send({
                  errors: ["There was an error with the compare function."]
                });
                res.end();
              } else {
                //Checks the boolean result of bcrypt.compare
                //If the passwords match, we hash the new password submitted by the user.
                if (passwordsMatch) {
                  //Salt Password
                  _bcryptjs["default"].genSalt(10, function (err, salt) {
                    if (err) {
                      console.error(err);
                      return;
                    }

                    ; //Hash user submitted new  password with salt

                    _bcryptjs["default"].hash(userSubbmitedNewPassword, salt, function (err, hash) {
                      if (err) {
                        console.error(err);
                        return;
                      }

                      ; //Update model password where email matches req.session.user(that we get from login) to contain the newl hashed password

                      db.models.user.update({
                        password: hash
                      }, {
                        where: {
                          email: req.session.user
                        }
                      }).then(function (queryResult) {
                        //Checks the query result
                        //Query result returns an array with a number
                        var didUserUpdate = queryResult[0];

                        if (didUserUpdate) {
                          res.send({
                            serverReplied: true
                          });
                          res.end();
                        } else {
                          res.send({
                            errors: ["There was an internal server error"]
                          });
                          res.end();
                        }
                      })["catch"](function (err) {
                        res.send({
                          errors: ["There was an internal server error"]
                        });
                        res.end();
                      });
                    });
                  });
                } else {
                  console.log("Passwords dont match");
                  res.send({
                    errors: ["Current Password is invalid."],
                    status: false
                  });
                  res.end();
                }
              }
            });
          }
        })["catch"](function (err) {
          console.error(err);
          res.send({
            errors: ["There was an error with the findone query"],
            status: false
          });
          res.end();
        });
      });
      app.post("/forum/account/delete", function (req, res) {
        //const user = req.session.user;
        var user = req.session.user;
        var userSubmittedPasssword = req.body.password;
        db.models.user.findOne({
          where: {
            email: user
          }
        }).then(function (queryResult) {
          if (queryResult) {
            var userPassword = queryResult.dataValues.password;

            _bcryptjs["default"].compare(userSubmittedPasssword, userPassword, function (err, passwordsMatch) {
              if (err) {
                throw err;
              }

              if (passwordsMatch) {
                store.destroy(req.sessionID, function (err) {
                  if (err) {
                    console.error("Unable to destroy redis session\n", err);
                    res.send({
                      errors: true,
                      messages: ["Unable to destroy redis session"]
                    });
                    res.end();
                  }

                  ;
                  req.session.destroy(function (err) {
                    if (err) {
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
                    }).then(function (userDestroyed) {
                      if (userDestroyed > 0) {
                        res.send({
                          errors: false,
                          messages: ["We have removed the user!"]
                        }).res.end();
                      } else {
                        res.send({
                          errors: true,
                          messages: ["We have not removed any user.."]
                        });
                        res.end();
                      }
                    })["catch"](function (err) {
                      throw err;
                      res.send("there was an error");
                      res.end();
                    });
                  });
                });
              } else {
                res.send({
                  errors: true,
                  messages: ["Passwords didnt match"]
                });
                res.end();
              }
            });
          } else {
            //USER NOT FOUND
            console.error("THERE IS NO USER RETURNED");
          }
        })["catch"](function (err) {
          //ERROR ON FINDONE QUERY
          console.error(err);
        });
      });
      app.get("/forum", function (req, res) {
        db.models.forumSubjects.findAll().then(function (queryResult) {
          if (queryResult.length > 0) {
            res.send(queryResult);
            res.end();
          } else {
            res.send(queryResult);
            res.end();
          }
        })["catch"](function (err) {
          res.send(err);
          res.end();
        });
      });
      app.get("/forum/:subjectId", function (req, res) {
        var id = req.params.subjectId;
        db.models.forumThreads.findAll({
          where: {
            forumSubjectId: id
          },
          include: [{
            model: db.models.user,
            attributes: {
              exclude: ["id", "password", "role", "createdAt", "updatedAt"]
            }
          }]
        }).then(function (threads) {
          console.log(threads);
          res.send(threads);
          res.end();
        })["catch"](function (error) {
          console.error(error);
          res.end();
        });
      });
      app.get("/forum/:subjectId/:threadId", function (req, res) {
        var threadId = req.params.threadId;
        db.models.forumPosts.findAll({
          where: {
            forumThreadId: threadId
          },
          include: [{
            model: db.models.user,
            attributes: {
              exclude: ["id", "password", "role", "createdAt", "updatedAt"]
            }
          }]
        }).then(function (posts) {
          console.log(posts);
          res.send(posts);
          res.end();
        })["catch"](function (error) {
          console.error(error);
          res.end();
        });
      });
    }
  }]);
  return AppRouter;
}();

var _default = AppRouter; //67433264

exports["default"] = _default;