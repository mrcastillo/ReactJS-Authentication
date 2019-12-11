"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = void 0;

var _sequelize = require("sequelize");

var sequelize = new _sequelize.Sequelize("playground", //database
"playground_user", //username
"cantuna" //password
, {
  operatorsAliases: _sequelize.Sequelize.Op,
  host: "207.246.84.96",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
var User = sequelize.define("user", {
  id: {
    type: new _sequelize.DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  email: {
    type: new _sequelize.DataTypes.STRING(128),
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
      len: [3, 64]
    },
    unique: true
  },
  password: {
    type: new _sequelize.DataTypes.STRING(255),
    allowNull: false,
    validate: {
      //isNull: false,
      //notEmpty: true,
      len: [8, 64]
    }
  },
  createdAt: {
    type: new _sequelize.DataTypes.DATE()
  },
  updatedAt: {
    type: new _sequelize.DataTypes.DATE()
  }
}, {
  sequelize: sequelize,
  tableName: "users",
  uniqueKeys: {
    actions_unique: {
      fields: ["email"]
    }
  }
}); //Syncs all models

sequelize.sync();

var connect = function connect(callback) {
  sequelize.authenticate().then(function () {
    callback(sequelize);
  })["catch"](function (err) {
    console.error("There was an error connecting using sequelize\n", err);
  });
};
/*
const Sequelize = require('sequelize');
const sequelize = new Sequelize('playground', 'acastillo', 'Appsteam3$', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const connect = (callback) => {
    sequelize
    .authenticate()
    .then(() => {
        callback(sequelize);
    })
    .catch( err => {
        console.error(`Error 001: There was an error connecting to the database. \n${err}`);
        return;
    })
}
*/


exports.connect = connect;