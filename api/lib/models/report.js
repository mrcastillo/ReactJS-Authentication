"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var Report =
/*#__PURE__*/
function () {
  function Report(app) {
    (0, _classCallCheck2["default"])(this, Report);
    this.app = app;
    this.model = {
      rotation: null,
      status: null,
      timeframe: null,
      description: null,
      resource: null,
      rfc: null,
      ipsoft_ticket: null
    };
  }

  (0, _createClass2["default"])(Report, [{
    key: "initWithObject",
    value: function initWithObject(object) {
      this.model.rotation = _lodash["default"].get(object, "rotation");
      this.model.status = _lodash["default"].get(object, "status");
      this.model.timeframe = _lodash["default"].get(object, "timeframe");
      this.model.description = _lodash["default"].get(object, "description");
      this.model.resource = _lodash["default"].get(object, "resource");
      this.model.rfc = _lodash["default"].get(object, "rfc");
      this.model.ipsoft_ticket = _lodash["default"].get(object, "ipsoft_ticket");
      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.model;
    }
  }]);
  return Report;
}();

var _default = Report;
exports["default"] = _default;