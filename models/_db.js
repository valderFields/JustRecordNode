'use strict';

const Sequelize = require('sequelize');
const config = require('../config/config');
exports.sequelize = function () {
	return new Sequelize(config.db.name, config.db.user, config.db.passwd, {
		host: config.db.host, 
		port:config.db.user.port, 
		logging:console.log,
		dialect: 'mysql',
		operatorsAliases: false
	});
}