const redis = require('../../redis');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const moment = require('moment');
const status_code = require('../../config/status_code');
/*签名*/
const SECRET = 'JUSTRECORD';

const token = {

    SECRET,
    sign: (user) => {
        return jwt.sign({
            data:user
        },SECRET);
        
    },
    getToken:(req)=>{
        return (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    },
    validToken: (req,res)=>{
        const tok = token.getToken(req);
        jwt.verify(tok, SECRET, function (err, decode) {
            if (err) {  //伪造的token          
               res.make_response(
                    status_code.ERROR_TOKEN_CODE,
                    status_code.ERROR_TOKEN_MSG,
                    {
                        err:err
                    }
                );
            } else {
                rq.decode = decode; 
                next();
            }
        })
    },
    checkRedis: (req, res, next) => {
        const decodeTok = req.decode;
        redis.get(decodeTok.userId, (data) => {
            if (data) {
                // token 在redis中存在，延长过期时间
                redis.updateExpire(decodeTok.userId)
                next()
            } else {
                next(10005)
            }
        })
    },
    add:(key,value,expire)=>{
        redis.add(key,value,expire)
    },
    remove: (req) => {
        const tok = token.getToken(req)
        tok && redis.remove(tok)
    }
}
token.checkRedis.unless = unless;
token.validToken.unless = unless;
module.exports = token