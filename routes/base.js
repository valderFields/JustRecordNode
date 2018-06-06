
module.exports = function(req, res, next) {
    // 回接口
    res.make_response = function(status_code, msg, data) {
        data = data || '';
        let param = {
            'server_time':Date.now(),
            'code': status_code.toString(),
            'msg': msg,
            'data': data
        };
        res.send(param);  
    };

    next();
};