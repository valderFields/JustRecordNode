'use strict';

const sequelize=require('./_db').sequelize();
const User = sequelize.import('./user.js');

// 同步模型到数据库中
sequelize.sync();
exports.User = User;