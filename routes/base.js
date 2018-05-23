var express = require("express");

module.exports = function(req, res, next) {
    // 回接口
    res.make_response = function(status_code, msg, data) {
        data = data || '';
        //设置其他的响应头 ??为什么在这里不能解决跨域--待解决
        let param = {
            'code': status_code.toString(),
            'msg': msg,
            'data': data
        };
        res.send(param);  
    };

    next();
};