### 在连接数据库mysql8的时候报错
```javascript
Unhandled rejection SequelizeConnectionError: Client does not support authentication protocol requested by server; consider upgrading MySQL client
```
+ 解决方案
```javascript
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '{your password}';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '{your password}';
SELECT plugin FROM mysql.user WHERE User = 'root';
```

