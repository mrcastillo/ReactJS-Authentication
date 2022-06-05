"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _JoiValidator = require("./validations/JoiValidator");

;

var AppRouter = /*#__PURE__*/function () {
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

      app.get("/", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
          var createSubject;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return db.models.forumSubjects.create({
                    subject: "Introduction",
                    description: "Welcome to the forum! Introduce yourself to everyone here."
                  });

                case 3:
                  createSubject = _context.sent;
                  res.send(createSubject);
                  res.end();
                  _context.next = 12;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](0);
                  console.error(_context.t0);
                  res.status(500).send(null);

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 8]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }()); //Checks the user session and returns the session

      app.get("/forum/session", function (req, res) {
        var userSession = {
          user: req.session.user ? req.session.user : "",
          error: null
        };
        res.send(userSession);
        res.end();
      }); //Show Forum Categories

      app.get("/forum", /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
          var categories;
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return db.models.forumSubjects.findAll();

                case 3:
                  categories = _context2.sent;
                  res.send(categories);
                  res.end();
                  _context2.next = 12;
                  break;

                case 8:
                  _context2.prev = 8;
                  _context2.t0 = _context2["catch"](0);
                  res.status(500).send(null);
                  res.end();

                case 12:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 8]]);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }()); //Show Forum Threads

      app.get("/forum/:subjectId", /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
          var subjectId, threads;
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  subjectId = req.params.subjectId;
                  _context3.prev = 1;
                  _context3.next = 4;
                  return db.models.forumThreads.findAll({
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

                case 4:
                  threads = _context3.sent;
                  res.send(threads);
                  res.end();
                  _context3.next = 13;
                  break;

                case 9:
                  _context3.prev = 9;
                  _context3.t0 = _context3["catch"](1);
                  console.error("Error with getting forum threads. ", _context3.t0);
                  res.status(500).send(null);

                case 13:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[1, 9]]);
        }));

        return function (_x5, _x6) {
          return _ref3.apply(this, arguments);
        };
      }());
      app.get("/forum/:subjectId/:threadId", /*#__PURE__*/function () {
        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
          var subjectId, threadId, threadPosts;
          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  subjectId = req.params.subjectId;
                  threadId = req.params.threadId; //Try to get all post from thread in the DB.

                  _context4.prev = 2;
                  _context4.next = 5;
                  return db.models.forumThreads.findOne({
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

                case 5:
                  threadPosts = _context4.sent;
                  //Send all post in the thread
                  res.send(threadPosts);
                  res.end();
                  _context4.next = 15;
                  break;

                case 10:
                  _context4.prev = 10;
                  _context4.t0 = _context4["catch"](2);
                  console.error("Error with getting thread posts", _context4.t0);
                  res.status(500).send(null);
                  res.end();

                case 15:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, null, [[2, 10]]);
        }));

        return function (_x7, _x8) {
          return _ref4.apply(this, arguments);
        };
      }());
      app.post("/forum/newthread", /*#__PURE__*/function () {
        var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
          var user, userId, forumSubjectId, threadTitle, threadBody, createPost;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (req.session.user) {
                    _context5.next = 3;
                    break;
                  }

                  res.status(500).send("Unavailable.");
                  return _context5.abrupt("return");

                case 3:
                  ; //SESSION

                  user = req.session.user;
                  userId = req.session.userId; //REQ BODY

                  forumSubjectId = req.body.forumSubjectId;
                  threadTitle = req.body.title;
                  threadBody = req.body.comment;
                  _context5.prev = 9;
                  _context5.next = 12;
                  return db.models.forumThreads.create({
                    threadTitle: threadTitle,
                    originalComment: threadBody,
                    originalPoster: user,
                    userId: userId,
                    forumSubjectId: forumSubjectId
                  });

                case 12:
                  createPost = _context5.sent;
                  res.send(createPost);
                  res.end();
                  _context5.next = 21;
                  break;

                case 17:
                  _context5.prev = 17;
                  _context5.t0 = _context5["catch"](9);
                  console.error(_context5.t0);
                  res.status(500).send(null);

                case 21:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[9, 17]]);
        }));

        return function (_x9, _x10) {
          return _ref5.apply(this, arguments);
        };
      }());
      app.post("/forum/login", /*#__PURE__*/function () {
        var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
          var userSubmittedEmail, userSubmittedPassword, emailValidation, usernameValidation, passwordValidation, userFromDB, passwordMatch;
          return _regenerator["default"].wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (!req.session.user) {
                    _context6.next = 4;
                    break;
                  }

                  res.status(500).send("Unavailable");
                  res.end();
                  return _context6.abrupt("return");

                case 4:
                  //Get post variables from user
                  userSubmittedEmail = req.body.email;
                  userSubmittedPassword = req.body.password; //Validation Booleans

                  emailValidation = (0, _JoiValidator.isEmail)(userSubmittedEmail).validated;
                  usernameValidation = (0, _JoiValidator.alphanumericUsername)(userSubmittedEmail).validated;
                  passwordValidation = (0, _JoiValidator.validPassword)(userSubmittedPassword).validated; //Check if email or username is validated and true, and if password validation is true

                  if (!((emailValidation || usernameValidation) && passwordValidation)) {
                    _context6.next = 31;
                    break;
                  }

                  _context6.prev = 10;
                  _context6.next = 13;
                  return db.models.user.findOne({
                    where: (0, _defineProperty2["default"])({}, db.Op.or, [{
                      email: userSubmittedEmail
                    }, {
                      username: userSubmittedEmail
                    }])
                  });

                case 13:
                  userFromDB = _context6.sent;

                  if (userFromDB) {
                    _context6.next = 18;
                    break;
                  }

                  res.send({
                    error: ["Invalid Email/Username or Pasword."]
                  });
                  res.end();
                  return _context6.abrupt("return");

                case 18:
                  _context6.next = 20;
                  return _bcryptjs["default"].compare(userSubmittedPassword, userFromDB.dataValues.password);

                case 20:
                  passwordMatch = _context6.sent;

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
                      error: ["Invalid Password."]
                    });
                    res.end();
                  }

                  _context6.next = 29;
                  break;

                case 24:
                  _context6.prev = 24;
                  _context6.t0 = _context6["catch"](10);
                  console.error(_context6.t0);
                  res.send({
                    error: ["Invalid Email/Username or Pasword."]
                  });
                  res.end();

                case 29:
                  _context6.next = 33;
                  break;

                case 31:
                  res.send({
                    error: ["Invalid Email/Username or Pasword."]
                  });
                  res.end();

                case 33:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, null, [[10, 24]]);
        }));

        return function (_x11, _x12) {
          return _ref6.apply(this, arguments);
        };
      }());
      app.get("/account/logout", /*#__PURE__*/function () {
        var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
          return _regenerator["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  if (req.session.user) {
                    _context7.next = 4;
                    break;
                  }

                  res.status(500).send(null);
                  res.end();
                  return _context7.abrupt("return");

                case 4:
                  _context7.prev = 4;
                  _context7.next = 7;
                  return store.destroy(req.sessionID);

                case 7:
                  _context7.next = 9;
                  return req.session.destroy();

                case 9:
                  res.send({
                    serverReplied: true,
                    user: ""
                  });
                  res.end();
                  _context7.next = 18;
                  break;

                case 13:
                  _context7.prev = 13;
                  _context7.t0 = _context7["catch"](4);
                  console.error(_context7.t0);
                  res.send({
                    serverReplied: true,
                    user: ""
                  });
                  res.end();

                case 18:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, null, [[4, 13]]);
        }));

        return function (_x13, _x14) {
          return _ref7.apply(this, arguments);
        };
      }());
      app.post("/account/signup", /*#__PURE__*/function () {
        var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
          var userEmail, userUsername, userPassword, validEmail, validUsername, isValidPassword, bcryptSalt, userHashedPassword, createUser, errorPath;
          return _regenerator["default"].wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (!req.session.user) {
                    _context8.next = 4;
                    break;
                  }

                  res.status(500).send(null);
                  res.end();
                  return _context8.abrupt("return");

                case 4:
                  //Declare our variables
                  userEmail = req.body.email;
                  userUsername = req.body.username.toLowerCase();
                  userPassword = req.body.password; //Check if our user inputs are validated

                  validEmail = (0, _JoiValidator.isEmail)(userEmail).validated;
                  validUsername = (0, _JoiValidator.alphanumericUsername)(userUsername).validated;
                  isValidPassword = (0, _JoiValidator.validPassword)(userPassword).validated;

                  if (!(!validUsername || !validEmail || !isValidPassword)) {
                    _context8.next = 14;
                    break;
                  }

                  res.status(500).send(null);
                  res.end();
                  return _context8.abrupt("return");

                case 14:
                  _context8.next = 16;
                  return _bcryptjs["default"].genSalt(10);

                case 16:
                  bcryptSalt = _context8.sent;
                  _context8.next = 19;
                  return _bcryptjs["default"].hash(userPassword, bcryptSalt);

                case 19:
                  userHashedPassword = _context8.sent;
                  _context8.prev = 20;
                  _context8.next = 23;
                  return db.models.user.create({
                    email: userEmail,
                    username: userUsername,
                    password: userHashedPassword,
                    role: 1
                  });

                case 23:
                  createUser = _context8.sent;
                  console.log(createUser);
                  res.send({
                    error: false,
                    message: true
                  });
                  res.end();
                  return _context8.abrupt("return");

                case 30:
                  _context8.prev = 30;
                  _context8.t0 = _context8["catch"](20);
                  console.error(_context8.t0);

                  if (!(_context8.t0.parent.errno === 1062)) {
                    _context8.next = 38;
                    break;
                  }

                  errorPath = _context8.t0.errors[0].path.charAt(0).toUpperCase() + _context8.t0.errors[0].path.slice(1);
                  res.send({
                    error: true,
                    message: ["".concat(errorPath, " already exist.")]
                  });
                  res.end();
                  return _context8.abrupt("return");

                case 38:
                  res.status(500).send(null);
                  res.end();
                  return _context8.abrupt("return");

                case 41:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, null, [[20, 30]]);
        }));

        return function (_x15, _x16) {
          return _ref8.apply(this, arguments);
        };
      }()); //Need to perform validation on the backend.

      app.post("/forum/account/changepassword", /*#__PURE__*/function () {
        var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
          var submittedPassword, submittedNewPassword, userFromDB, areDBandNewPasswordSame, doPasswordsMatch, bcryptSalt, bcryptHash, updateUserPassword;
          return _regenerator["default"].wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (req.session.user) {
                    _context9.next = 3;
                    break;
                  }

                  res.status(500).send("Unavailable.");
                  return _context9.abrupt("return");

                case 3:
                  submittedPassword = req.body.password;
                  submittedNewPassword = req.body.newPassword; //Return the user object from the DB, NULL if not found

                  _context9.next = 7;
                  return db.models.user.findOne({
                    where: {
                      username: "peach"
                    }
                  });

                case 7:
                  userFromDB = _context9.sent;

                  if (!userFromDB) {
                    _context9.next = 37;
                    break;
                  }

                  _context9.next = 11;
                  return _bcryptjs["default"].compare(submittedNewPassword, userFromDB.password);

                case 11:
                  areDBandNewPasswordSame = _context9.sent;

                  if (!areDBandNewPasswordSame) {
                    _context9.next = 16;
                    break;
                  }

                  res.send({
                    errors: ["New Password cannot be the same as old password."]
                  });
                  res.end();
                  return _context9.abrupt("return");

                case 16:
                  console.log(userFromDB.password, submittedPassword); //Check if the actual passwords matches that in the DB

                  _context9.next = 19;
                  return _bcryptjs["default"].compare(submittedPassword, userFromDB.password);

                case 19:
                  doPasswordsMatch = _context9.sent;
                  console.log(doPasswordsMatch);

                  if (!doPasswordsMatch) {
                    _context9.next = 35;
                    break;
                  }

                  _context9.next = 24;
                  return _bcryptjs["default"].genSalt(10);

                case 24:
                  bcryptSalt = _context9.sent;
                  _context9.next = 27;
                  return _bcryptjs["default"].hash(submittedNewPassword, bcryptSalt);

                case 27:
                  bcryptHash = _context9.sent;
                  _context9.next = 30;
                  return db.models.user.update({
                    password: bcryptHash
                  }, {
                    where: {
                      username: "peach"
                    }
                  });

                case 30:
                  updateUserPassword = _context9.sent;
                  res.send(updateUserPassword);
                  res.end();
                  _context9.next = 37;
                  break;

                case 35:
                  res.send({
                    errors: ["Current Password is invalid"]
                  });
                  res.end();

                case 37:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9);
        }));

        return function (_x17, _x18) {
          return _ref9.apply(this, arguments);
        };
      }());
      app.post("/account/delete", /*#__PURE__*/function () {
        var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
          var isPasswordValid, findUser, userDBPassword, checkPassword, didUserGetRemoved;
          return _regenerator["default"].wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  if (req.session.user) {
                    _context10.next = 4;
                    break;
                  }

                  res.status(500).send(null);
                  res.end();
                  return _context10.abrupt("return");

                case 4:
                  isPasswordValid = (0, _JoiValidator.validPassword)(req.body.password).validated;

                  if (isPasswordValid) {
                    _context10.next = 9;
                    break;
                  }

                  res.status(500).send(null);
                  res.end();
                  return _context10.abrupt("return");

                case 9:
                  ;
                  _context10.prev = 10;
                  _context10.next = 13;
                  return db.models.user.findOne({
                    where: {
                      username: req.session.user
                    }
                  });

                case 13:
                  findUser = _context10.sent;
                  userDBPassword = findUser.password;
                  _context10.next = 17;
                  return _bcryptjs["default"].compare(req.body.password, userDBPassword);

                case 17:
                  checkPassword = _context10.sent;

                  if (!checkPassword) {
                    _context10.next = 36;
                    break;
                  }

                  _context10.next = 21;
                  return db.models.user.destroy({
                    where: {
                      username: req.session.user
                    },
                    limit: 1
                  });

                case 21:
                  didUserGetRemoved = _context10.sent;

                  if (!(didUserGetRemoved === 0)) {
                    _context10.next = 26;
                    break;
                  }

                  res.send({
                    error: true,
                    message: ["Unable to remove user. Please try again later or Contact an Administrator."]
                  });
                  res.end();
                  return _context10.abrupt("return");

                case 26:
                  ;
                  _context10.next = 29;
                  return req.session.destroy();

                case 29:
                  _context10.next = 31;
                  return store.destroy(req.sessionID);

                case 31:
                  res.send({
                    error: false,
                    message: ["We have removed the user!"]
                  });
                  res.end();
                  return _context10.abrupt("return");

                case 36:
                  res.send({
                    error: true,
                    message: ["You have entered an invalid password."]
                  });
                  res.end();
                  return _context10.abrupt("return");

                case 39:
                  _context10.next = 47;
                  break;

                case 41:
                  _context10.prev = 41;
                  _context10.t0 = _context10["catch"](10);
                  console.error(_context10.t0);
                  res.status(500).send(null);
                  res.end();
                  return _context10.abrupt("return");

                case 47:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, null, [[10, 41]]);
        }));

        return function (_x19, _x20) {
          return _ref10.apply(this, arguments);
        };
      }());
    }
  }]);
  return AppRouter;
}();

var _default = AppRouter;
exports["default"] = _default;