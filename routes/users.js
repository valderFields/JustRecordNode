var express = require('express');
var router = express.Router();
var User = require('../models').User;
var crypto = require('crypto');
var status_code = require('../utils/status_code');
var ursa = require('../userModules/encryption/ursa');
/*用户模块的接口*/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
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
    if (username && password) {
    	User.findOne({
            where: {
                username: username
            }
        }).then(function(user) {
            if(user){
                res.make_response(
                    status_code.ERROR_USER_SIGNUP_ACCOUNT,
                    status_code.ERROR_USER_SIGNUP_ACCOUNT_MSG
                );
            }else{
                var passwd_code = ursa.decryptStringWithRsaPrivateKey(password);
                User.create({
                    username: username,
                    password: passwd_code
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
            status_code.ERROR_PARAM,
            status_code.ERROR_PARAM_MSG,
            
        );
    }
}
var getPublicKeyController = function(req,res){
    var publicKey = ursa.getPublicKey();
    res.make_response(
        status_code.SUCCESS_CODE,
        status_code.SUCCESS_MSG,
        {
            'publicKey': publicKey
        }
    );
}
router.post('/signup', SignUpController);
router.post('/getPublicKey', getPublicKeyController);
module.exports = router;
