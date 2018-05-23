'use strict';

var sequelize=require('./_db').sequelize();
var User = sequelize.import('./user.js');

// 同步模型到数据库中
sequelize.sync();
exports.User = User;