var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var store = require('express-mysql-session');//session存储到mysql
var config = require('./config/config');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpBaseHandle = require('./routes/base');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//日志中间件
app.use(logger('dev'));
// //Content-Type=application/json请求内容解析中间件
app.use(express.json());
// //Content-Type:application/x-www-form-urlencode类型解析中间件
app.use(express.urlencoded({ extended: false }));
//处理cookie的中间件
app.use(cookieParser());
//static中间件指定公共资源的路径
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  }
  //store:new store(config.mysql), 
}))
app.use(httpBaseHandle);
app.all('*', function(req, res, next) {
  //设置请求体,支持 post、get、jsonp
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
        //这段仅仅为了方便返回json而已
    //res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200); 
    } else { 
        next(); 
    }
});
app.use('/', indexRouter);

app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 自定义错误处理的中间件,可以拿到next(new Error('error')的错误
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
