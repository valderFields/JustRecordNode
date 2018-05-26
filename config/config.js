/**
 * Created by aresn on 16/5/11.
 */

var env = require('./env');

var config = {
    redis: {
        port: 6379
    },
    // session
    session: {
        name: 'justrecord',
        secret: 'justrecord',
        cookie_time: 86400000,
        maxAge: 2592000000
    },
    publicKey:__dirname +'/rsa_public_key.pem',
    privateKey:__dirname +'/rsa_private_key.pem',
};

if (env == 'development') {
    // 端口
    config.web_port = 9000;

    // redis
    config.redis.host = '127.0.0.1';
    config.redis.passwd = '';

    // DB
    config.db = {
        name: 'just_record',
        host: 'localhost',
        user: 'root',
        passwd: '',
        port: 3306
    };
} else if (env == 'production') {
    config.web_port = 9000;

    config.redis.host = '127.0.0.1';
    config.redis.passwd = '';

    config.db = {
        name: 'just_record',
        host: 'localhost',
        user: 'root',
        passwd: 'root',
        port: 3306
    };
}

module.exports = config;
