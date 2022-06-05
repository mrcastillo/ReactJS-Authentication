"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = void 0;

var _sequelize = require("sequelize");

var sequelize = new _sequelize.Sequelize("forum", //database
"forumAdmin", //username
"846043Ant;" //password
, {
  operatorsAliases: _sequelize.Sequelize.Op,
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
var ForumSubjects = sequelize.define("forumSubjects", {
  subject: {
    type: new _sequelize.DataTypes.STRING(128),
    allowNull: false,
    unique: true
  },
  description: {
    type: new _sequelize.DataTypes.STRING(128),
    allowNull: true,
    unique: false
  },
  createdAt: {
    type: new _sequelize.DataTypes.DATE()
  },
  updatedAt: {
    type: new _sequelize.DataTypes.DATE()
  }
}, {
  sequelize: sequelize,
  tableName: "forumSubjects"
});
var ForumThreads = sequelize.define("forumThreads", {
  threadTitle: {
    type: new _sequelize.DataTypes.STRING()
  },
  originalComment: {
    type: new _sequelize.DataTypes.STRING(),
    allowNull: false
  },
  originalPoster: {
    type: new _sequelize.DataTypes.STRING(),
    allowNull: false
  },
  createdAt: {
    type: new _sequelize.DataTypes.DATE()
  },
  updatedAt: {
    type: new _sequelize.DataTypes.DATE()
  }
}, {
  sequelize: sequelize,
  tableName: "forumThreads"
});
var ForumPosts = sequelize.define("forumPosts", {
  postComment: {
    type: new _sequelize.DataTypes.STRING(),
    allowNull: false
  },
  status: {
    type: new _sequelize.DataTypes.ENUM(),
    values: ["approved", "pending", "declined"]
  },
  createdAt: {
    type: new _sequelize.DataTypes.DATE()
  },
  updatedAt: {
    type: new _sequelize.DataTypes.DATE()
  }
}, {
  sequelize: sequelize,
  tableName: "forumPosts"
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
  username: {
    type: new _sequelize.DataTypes.STRING(32),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 32]
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
  role: {
    type: new _sequelize.DataTypes.ENUM(),
    values: ["user", "admin", "banned"],
    allowNull: false
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
});
User.hasMany(ForumThreads);
ForumThreads.belongsTo(User);
ForumSubjects.hasOne(ForumThreads);
ForumThreads.hasMany(ForumPosts);
ForumPosts.belongsTo(User); //Syncs all models

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