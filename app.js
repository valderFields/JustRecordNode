const createError = require('http-errors');
const express = require('express');
const config = require('./config/config');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const httpBaseHandle = require('./routes/base');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
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
