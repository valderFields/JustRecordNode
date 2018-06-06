### token加密解密的基本原理

```javascript
const crypto = require('crypto');
const zlib = require('zlib');
/*
* JWT----JSON WEB TOKEN规范,
* 一个JWT实际上就是一个字符串，它由三部分组成，头部、载荷与签名。
* 1-- Payload(载荷)
* var Payload = {
*    "iss": "John Wu JWT",           //该JWT的签发者
*    "iat": 1441593502,              //在什么时候签发的
*    "exp": 1441594722,              //什么时候过期，这里是一个Unix时间戳
*    "aud": "www.justRecord.com",    //接收该JWT的一方
*    "sub": "www.justRecord.com"",   //该JWT所面向的用户
*    "from_user": "B",               //自定义字段,签证由B用户发出      
*    "target_user": "A"              //自定义字段,签证要发送给A用户
* }
* var base64url = require('base64url')
* Payload = base64url(JSON.stringify(Payload)))  //这个经过编码的字符串就是JWT的载荷
*
* 2--Header(头部)
* var Header = {
*  "typ": "JWT",
*  "alg": "aes-256-gcm"  //所使用的加密算法
* }
* var base64url = require('base64url')
* Header = base64url(JSON.stringify(Header))) //这个经过编码的字符串就是JWT的头部
*
* 3--Sign(签名)
* var Sign = Payload.Header;
*
* 
* 参考文献:
* http://wiki.jikexueyuan.com/project/nodejs/crypto.html
* https://juejin.im/post/5afa2f225188254284522c2c
 */
class Tokens {
    constructor(config) {
        this._config = config;
        /*生成sha256的密钥,密码+salt+32次哈希*/
        this._key = crypto.pbkdf2Sync(config.password, config.salt, 1001, 32, 'sha256');
    }
    /**
     * 生成token
     * @Author   LHK
     * @DateTime 2018-05-27
     * @version  [version]
     * @param    {[type]}   config [description]
     * @return   {[type]}          [description]
     */
    encode(config) {
    	/*使用中间件的path*/
    	config.path = config.path instanceof RegExp ? config.path.source : config.path;
    	/*有效期,exp为Date对象或者是Date可以理解的字符串*/
    	config.exp && (config.exp = Tokens._toDate(config.exp));
    	let payload = new Buffer(JSON.stringify(config), 'utf8');
    	/*生成12字节的伪随机数*/
    	let iv = crypto.randomBytes(12);
        /*利用aes-256-gcm加密算法生成cipher实例*/
    	let cipher = crypto.createCipheriv('aes-256-gcm', this._key, iv);
        /*upload加密实例,final返回加密后的字符串*/
        let encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
        /*加密认证模式（目前支持：GCM）*/
        let authTag = cipher.getAuthTag();
        /*不知道到底是什么意思,但是文档上就是这么写的*/
        let combined = Buffer.concat([iv, authTag, encrypted]);
        return encodeURIComponent(zlib.deflateRawSync(combined, {
            strategy: zlib.Z_FILTERED,
            level: zlib.Z_BEST_COMPRESSION
        }).toString('base64'));
    }
    /**
     * 
     * @Author   LHK
     * @DateTime 2018-05-28
     * @version  [version]
     * @param    {[type]}   val [description]
     * @return   {[type]}       [description]
     */
    static _toDate(val) {
        if (typeof val == 'string') {
            val = Date.parse(val);
        }
        if (!isNaN(val)) {
            val = new Date(val)
        }
        if (val instanceof Date) {
            if (val.getTime() <= Date.now()) {
                throw new Error('exp参数已经过期');
            }
            return val.getTime();
        }
        throw new Error('无法解析exp参数');
    }
    decode(token) {
        try {
            let inflated = zlib.inflateRawSync(new Buffer(decodeURIComponent(token), 'base64'));
            /*获取伪随机数*/
            let iv = inflated.slice(0, 12);
            /*authTag获取*/
            let tag = inflated.slice(12, 28);
            /*用户自定义内容*/
            let encrypted = inflated.slice(28);
            let decipher = crypto.createDecipheriv(algo, this._key, iv);
            decipher.setAuthTag(tag);
            /*解密*/
            let decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            let user = JSON.parse(decrypted.toString('utf8'));
            //将token的path转换为正则
            user.path = user.path && (user.path instanceof RegExp ? user.path : new RegExp(user.path));
            return user;
        } catch (e) {
            return e;
        }
    }
}
module.exports = Tokens;
```

### 使用中间件拦截
```javascript
function Middleware(config = {},algorithm = 'aes-256-gcm',password,salt) {
	if (!config.password) {
        throw new Error('缺少必要的参数password');
	}
	if (!config.salt) {
        throw new Error('缺少必要的参数salt');
    }else{
    	config.salt = config.salt instanceof Buffer ? config.salt : new Buffer(config.salt, 'utf8');
    	if (config.salt.length < 16) {
            throw new Error('salt最少为16字节');
        }
    }
    config.param = config.param || 'token';
    config.error = config.error || error;
    let context = {
        config,
        tokens: new Tokens(config),
    };
    let middleware = handler.bind(context);
    middleware.getToken = context.tokens.encode.bind(context.tokens);
    return middleware;
}
function handler(req, res, next) {
    let token = req.header('Authorization') || req.query[this.config.param] || req.cookies && req.cookies[this.config.params];
    if (!token || !token.trim().length) {
        let message = 'No token found on request';
        this.config.logger(message);
        return this.config.error(req, res, next, 401, message);
    }
    let user = this.tokens.decode(token);
    if (!user) {
        let message = 'Unable to decode token on request';
        this.config.logger(message);
        return this.config.error(req, res, next, 403, message);
    }
    req.user = user;
    if (user.path && !user.path.test(req.originalUrl)) {
        let message = 'The user has not been granted access to this endpoint: ' + req.originalUrl;
        this.config.logger(message);
        return this.config.error(req, res, next, 403, message);
    }
    if (user.exp && user.exp < Date.now()) {
        let message = 'The user token has expired: ' + new Date(user.exp).toISOString();
        this.config.logger(message);
        return this.config.error(req, res, next, 403, message);
    }
    try {
        this.limiter.check(user, next);
    } catch (e) {
        let message = 'The user has exceeded the timeout threshold by making too many requests';
        this.config.logger(message);
        return this.config.error(req, res, next, 429, message);
    }
}
function error(req, res, next, status, message) {
    res.status(status).end();
}

module.exports = Middleware;
```

###参数传递
```javascript
{
	password:'justRecord',
	salt:'just_record',
	path:'/login',
	...
}
```
### 本项目token分为access_token和refresh_token
+ 使用jsonwebtoken生成token
+ 使用express_jwt验证token的签名
+ 使用redis做token的有效期
+ 并发要使用黑名单控制token,暂时不处理并发