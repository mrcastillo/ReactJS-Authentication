"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _JoiValidator = require("./validations/JoiValidator");

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
      //Checks the user session and returns the session

      app.get("/forum/session", function (req, res) {
        var userSession = {
          serverReplied: true,
          user: req.session.user ? req.session.user : ""
        };
        res.send(userSession);
        res.end();
      }); //Show Forum Categories

      app.get("/forum", function _callee(req, res) {
        var categories;
        return _regenerator["default"].async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator["default"].awrap(db.models.forumSubjects.findAll());

              case 3:
                categories = _context.sent;
                res.send(categories);
                res.end();
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                res.status(500).send(null);
                res.end();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[0, 8]]);
      }); //Show Forum Threads

      app.get("/forum/:subjectId", function _callee2(req, res) {
        var subjectId, threads;
        return _regenerator["default"].async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                subjectId = req.params.subjectId;
                _context2.prev = 1;
                _context2.next = 4;
                return _regenerator["default"].awrap(db.models.forumThreads.findAll({
                  where: {
                    forumSubjectId: subjectId
                  },
                  include: [{
                    model: db.models.user,
                    attributes: {
                      exclude: ["id", "password", "role", "createdAt", "updatedAt"]
                    }
                  }]
                }));

              case 4:
                threads = _context2.sent;
                res.send(threads);
                res.end();
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                console.error("Error with getting forum threads. ", _context2.t0);
                res.status(500).send(null);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, null, null, [[1, 9]]);
      });
      app.get("/forum/:subjectId/:threadId", function _callee3(req, res) {
        var subjectId, threadId, threadPosts;
        return _regenerator["default"].async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                subjectId = req.params.subjectId;
                threadId = req.params.threadId; //Try to get all post from thread in the DB.

                _context3.prev = 2;
                _context3.next = 5;
                return _regenerator["default"].awrap(db.models.forumThreads.findOne({
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
                }));

              case 5:
                threadPosts = _context3.sent;
                //Send all post in the thread
                res.send(threadPosts);
                res.end();
                _context3.next = 15;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](2);
                console.error("Error with getting thread posts", _context3.t0);
                res.status(500).send(null);
                res.end();

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, null, null, [[2, 10]]);
      });
      app.post("/forum/newthread", function _callee4(req, res) {
        var user, userId, forumSubjectId, threadTitle, threadBody, createPost;
        return _regenerator["default"].async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (req.session.user) {
                  _context4.next = 3;
                  break;
                }

                res.status(500).send("Unavailable.");
                return _context4.abrupt("return");

              case 3:
                ; //SESSION

                user = req.session.user;
                userId = req.session.userId; //REQ BODY

                forumSubjectId = req.body.forumSubjectId;
                threadTitle = req.body.title;
                threadBody = req.body.comment;
                _context4.prev = 9;
                _context4.next = 12;
                return _regenerator["default"].awrap(db.models.forumThreads.create({
                  threadTitle: threadTitle,
                  originalComment: threadBody,
                  originalPoster: user,
                  userId: userId,
                  forumSubjectId: forumSubjectId
                }));

              case 12:
                createPost = _context4.sent;
                res.send(createPost);
                res.end();
                _context4.next = 21;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](9);
                console.error(_context4.t0);
                res.status(500).send(null);

              case 21:
              case "end":
                return _context4.stop();
            }
          }
        }, null, null, [[9, 17]]);
      });
      app.post("/forum/login", function _callee5(req, res) {
        var userSubmittedEmail, userSubmittedPassword, emailValidation, usernameValidation, passwordValidation, userFromDB, passwordMatch;
        return _regenerator["default"].async(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!req.session.user) {
                  _context5.next = 4;
                  break;
                }

                res.status(500).send("Unavailable");
                res.end();
                return _context5.abrupt("return");

              case 4:
                //Get post variables from user
                userSubmittedEmail = req.body.email;
                userSubmittedPassword = req.body.password;
                emailValidation = (0, _JoiValidator.isEmail)(userSubmittedEmail).validated;
                usernameValidation = (0, _JoiValidator.alphanumericUsername)(userSubmittedEmail).validated;
                passwordValidation = (0, _JoiValidator.validPassword)(userSubmittedPassword).validated;

                if (!((emailValidation || usernameValidation) && passwordValidation)) {
                  _context5.next = 27;
                  break;
                }

                _context5.prev = 10;
                _context5.next = 13;
                return _regenerator["default"].awrap(db.models.user.findOne({
                  where: (0, _defineProperty2["default"])({}, db.Op.or, [{
                    email: userSubmittedEmail
                  }, {
                    username: userSubmittedEmail
                  }])
                }));

              case 13:
                userFromDB = _context5.sent;
                _context5.next = 16;
                return _regenerator["default"].awrap(_bcryptjs["default"].compare(userSubmittedPassword, userFromDB.dataValues.password));

              case 16:
                passwordMatch = _context5.sent;

                if (passwordMatch === true) {
                  //Password Matches
                  //SETS THE SESSION, SESSION IS SET HERE
                  req.session.user = userFromDB.dataValues.username;
                  req.session.email = userFromDB.dataValues.email;
                  req.session.userId = userFromDB.dataValues.id; //Login Response
                  //Returns back an object featuring the user

                  res.send({
                    user: req.session.user
                  });
                  res.end();
                } //Password Dont match
                else {
                    res.send({
                      errors: ["Invalid Password."]
                    });
                    res.end();
                  }

                _context5.next = 25;
                break;

              case 20:
                _context5.prev = 20;
                _context5.t0 = _context5["catch"](10);
                console.error(_context5.t0);
                res.send({
                  errors: ["Invalid Email/Username or Pasword."]
                });
                res.end();

              case 25:
                _context5.next = 29;
                break;

              case 27:
                res.send({
                  errors: ["Invalid Email/Username or Pasword."]
                });
                res.end();

              case 29:
              case "end":
                return _context5.stop();
            }
          }
        }, null, null, [[10, 20]]);
      });
      app.get("/account/logout", function _callee6(req, res) {
        return _regenerator["default"].async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (req.session.user) {
                  _context6.next = 4;
                  break;
                }

                res.status(500).send(null);
                res.end();
                return _context6.abrupt("return");

              case 4:
                _context6.prev = 4;
                _context6.next = 7;
                return _regenerator["default"].awrap(store.destroy());

              case 7:
                _context6.next = 9;
                return _regenerator["default"].awrap(req.session.destroy());

              case 9:
                res.send({
                  serverReplied: true,
                  user: ""
                });
                res.end();
                _context6.next = 18;
                break;

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](4);
                console.error(_context6.t0);
                res.send({
                  serverReplied: true,
                  user: ""
                });
                res.end();

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, null, null, [[4, 13]]);
      });
      app.post("/forum/signup", function (req, res) {
        var userPostedData = req.body;
        db.models.user.create({
          username: userPostedData.username.toLowerCase(),
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
              var validationPathError = err.errors[0].path;
              validationPathError = validationPathError[0].toUpperCase() + validationPathError.slice(1);
              errorMsg.push("".concat(validationPathError, " is already in use."));
              break;

            default:
              errorMsg.push("There was an internal server error.");
          }

          res.send({
            errors: errorMsg
          });
          res.end();
        });
      }); //Need to perform validation on the backend.

      app.post("/forum/account/changepassword", function _callee7(req, res) {
        var submittedPassword, submittedNewPassword, userFromDB, areDBandNewPasswordSame, doPasswordsMatch, bcryptSalt, bcryptHash, updateUserPassword;
        return _regenerator["default"].async(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (req.session.user) {
                  _context7.next = 3;
                  break;
                }

                res.status(500).send("Unavailable.");
                return _context7.abrupt("return");

              case 3:
                submittedPassword = req.body.password;
                submittedNewPassword = req.body.newPassword; //Return the user object from the DB, NULL if not found

                _context7.next = 7;
                return _regenerator["default"].awrap(db.models.user.findOne({
                  where: {
                    username: "peach"
                  }
                }));

              case 7:
                userFromDB = _context7.sent;

                if (!userFromDB) {
                  _context7.next = 37;
                  break;
                }

                _context7.next = 11;
                return _regenerator["default"].awrap(_bcryptjs["default"].compare(submittedNewPassword, userFromDB.password));

              case 11:
                areDBandNewPasswordSame = _context7.sent;

                if (!areDBandNewPasswordSame) {
                  _context7.next = 16;
                  break;
                }

                res.send({
                  errors: ["New Password cannot be the same as old password."]
                });
                res.end();
                return _context7.abrupt("return");

              case 16:
                console.log(userFromDB.password, submittedPassword); //Check if the actual passwords matches that in the DB

                _context7.next = 19;
                return _regenerator["default"].awrap(_bcryptjs["default"].compare(submittedPassword, userFromDB.password));

              case 19:
                doPasswordsMatch = _context7.sent;
                console.log(doPasswordsMatch);

                if (!doPasswordsMatch) {
                  _context7.next = 35;
                  break;
                }

                _context7.next = 24;
                return _regenerator["default"].awrap(_bcryptjs["default"].genSalt(10));

              case 24:
                bcryptSalt = _context7.sent;
                _context7.next = 27;
                return _regenerator["default"].awrap(_bcryptjs["default"].hash(submittedNewPassword, bcryptSalt));

              case 27:
                bcryptHash = _context7.sent;
                _context7.next = 30;
                return _regenerator["default"].awrap(db.models.user.update({
                  password: bcryptHash
                }, {
                  where: {
                    username: "peach"
                  }
                }));

              case 30:
                updateUserPassword = _context7.sent;
                res.send(updateUserPassword);
                res.end();
                _context7.next = 37;
                break;

              case 35:
                res.send({
                  errors: ["Current Password is invalid"]
                });
                res.end();

              case 37:
              case "end":
                return _context7.stop();
            }
          }
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
    }
  }]);
  return AppRouter;
}();

var _default = AppRouter;
exports["default"] = _default;