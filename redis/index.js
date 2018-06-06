const config = require('../config/config')
const redis = require('redis');
const redisClient  = redis.createClient(config.redis.port, config.redis.host);
/*
* 1、redis有五种数据类型：string，list，hash，set，zset，不同的数据类型查看值得方式不同。
* 2、string：get key
* list：pop key
* hash: hget hash-name key
* set:smembers key
* zset: zrange zset-name 0 -1
* 3、你可以通过keys * 查看Redis中现有的key
 */
redisClient.on('error', function (err) {
    console.log('redis Error:' + err);
})
redisClient.auth(config.redis.passwd,function(){
    console.log("redis auth success");
});
module.exports =  {
    add(key,value,expire) {
        console.log(value);
        console.log(key);
        redisClient.set(key, value);
        if(expire){
            redisClient.expire(key, expire);
        }
    },
    hmset(key,value,expire){
        redisClient.hmset(key,value);
        if(expire){
            redisClient.expire(key, expire);
        }
    },
    hgetall(key,callback){
        redisClient.hgetall(key,callback);
    },
    updateExpire(key) {
        redisClient.expire(key, expire)
    },
    get(key,callback) {
        redisClient.get(key,(err,data)=>{
            callback(data)
        })
    },
    remove(key){
        redisClient.del(key)
    }
}