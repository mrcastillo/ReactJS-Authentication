"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = void 0;

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "207.246.84.96",
  user: "fortnite-dev",
  password: "846043ant",
  database: "fortnite"
});

var connect = function connect(callback) {
  connection.connect(function (err) {
    if (err) {
      console.error("Error 001: There was an error connecting to the database. \n".concat(err.stack));
      return;
    } else {
      return callback(connection);
    }
  });
};

exports.connect = connect;