var express = require('express');
var router = express.Router();
var User = require('../models').User;
var crypto = require('crypto');
var status_code = require('../utils/status_code');
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
                var md5 = crypto.createHash('md5');
                md5.update(password);

                var passwd_code = md5.digest('hex').substr(0, 16);

                User.create({
                    username: username,
                    password: passwd_code
                }).then(function(user) {
                    res.make_response(
                        status_code.SUCCESS,
                        status_code.SUCCESS_MSG,
                        {
                            'user_info': user.get('to_dict')
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
router.post('/signup', SignUpController);
module.exports = router;
