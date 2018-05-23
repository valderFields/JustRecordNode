### 兼容fetch

+ 为了在body-parse中能够解析出json数据,前端发送fetch请求必须知名指明conent-type
```javascript
function requestPost({ method, args, callback ,errorCallback,options = {}}) {
  options.mode = "cors";
  options.method = 'POST';
  options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
  options.body = JSON.stringify(args);
  fetch(domain.host + method, options )
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      callback(data);
    }).catch((err) => {
      if(errorCallback){
        errorCallback(err);
        return;
      }
      message.error('调用node.js失败,' + JSON.stringify(err) + ',方法名：' + method);
    });
}
```
+ 因为content-type是application/json,他是一个非简单请求,所以在发送post请求之前会先发送options请求,
询问服务端是否允许这个请求,所以服务端必须返回content-type用来告诉客户端,所以解决跨域的方案是
```javascript
app.all('*', function(req, res, next) {
  //设置请求体,支持 post、get、jsonp
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
        //这段仅仅为了方便返回json而已
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200); 
    } else { 
        next(); 
    }
});
```