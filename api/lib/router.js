"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

//import bcrypt from "bcryptjs";
//import { Model } from "sequelize/lib/sequelize";
//import { isEmail, alphanumericUsername, validPassword } from "./validations/JoiValidator";
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
      //const store = app.get("redisStore");

      var uploader = app.get("uploader");
      app.get("/", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  res.send("Welcome to the forum!");
                  res.end();

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
  return AppRouter;
}();

;
var _default = AppRouter;
exports["default"] = _default;