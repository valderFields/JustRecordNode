const express = require('express');
const router = express.Router();
const User = require('../models').User;
const crypto = require('crypto');
const status_code = require('../config/status_code');
const config = require('../config/config');
const ursa = require('../userModules/encryption/ursa');
const token = require('../userModules/token/index');

const expire = 60*60 //1h

const unlessPath = {
    path: [
        { url: '/user/signin', methods: ['POST'] },
        { url: '/user/signup', methods: ['POST'] }
    ]
}
/*
* 请求拦截器：
* 1--验证token的合法性
* 2--如果是签名不合法,返回不合法的json
* 3--如果json合法,和redis中的json进行比对
 */
router.use(
    token.validToken.unless(unlessPath),
    token.checkRedis.unless(unlessPath)
)
/**用户注册接口
 * @Author   LHK
 * @DateTime 2018-05-05
 * @version  [version]
 * @param    {[type]}   req [description]
 * @param    {[type]}   res [description]
 */
var SignUpController = function(req, res){
    var username = req.body.username || '';
    var password = req.body.password || undefined;

    console.log(username,password)
    if (username && password) {
    	User.findOne({
            where: {
                username: username
            }
        }).then(function(user) {
            if(user){
                res.make_response(
                    status_code.ERROR_USER_SIGNUP_ACCOUNT_CODE,
                    status_code.ERROR_USER_SIGNUP_ACCOUNT_MSG
                );
            }else{
                var decodePasswd = ursa.decryptStringWithRsaPrivateKey(password,config.privateKey);
                var encodePasswd = ursa.sha1IrreEncrypt(decodePasswd);
                User.create({
                    username: username,
                    password: encodePasswd
                }).then(function(user) {
                    res.make_response(
                        status_code.SUCCESS_CODE,
                        status_code.SUCCESS_MSG,
                        {
                            modefined:user.get('to_dict')
                        }
                    );
                });
            }
        })
    }else{
    	res.make_response(
            status_code.ERROR_PARAM_CODE,
            status_code.ERROR_PARAM_MSG,
            
        );
    }
}
/**
 * 用户登陆接口
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   req  [description]
 * @param    {[type]}   res  [description]
 * @param    {Function} next [description]
 */
var SignInController = function(req, res, next){
    var username = req.body.username || undefined;
    var password = req.body.password || undefined;
    if (username && password) {
        var decodePasswd = ursa.decryptStringWithRsaPrivateKey(password,config.privateKey);
        var encodePasswd = ursa.sha1IrreEncrypt(decodePasswd); 
        User.findOne({
            where: {
                username: username,
                password: encodePasswd
            }
        }).then(function(user) {
            if(user){
                const tok = token.sign(user.id);
                token.add(user.id,tok,expire);
                res.make_response(
                    status_code.SUCCESS_CODE,
                    status_code.SUCCESS_MSG,
                    {
                        token:tok
                    }
                )
               
            }else{
                res.make_response(
                    status_code.ERROR_USER_SIGNIN_ACCOUNT_CODE,
                    status_code.ERROR_USER_SIGNIN_ACCOUNT_MSG,
                );
            }
        })
    }else{
        res.make_response(
            status_code.ERROR_PARAM_CODE,
            status_code.ERROR_PARAM_MSG
        );
    }
}
var getPublicKeyController = function(req,res){
    var publicKey = ursa.getPublicKey(config.privateKey);
    res.make_response(
        status_code.SUCCESS_CODE,
        status_code.SUCCESS_MSG,
        {
            'publicKey': publicKey
        }
    );
}

router.post('/signup', SignUpController);
router.post('/signin',SignInController);
router.post('/getPublicKey', getPublicKeyController);
module.exports = router;
