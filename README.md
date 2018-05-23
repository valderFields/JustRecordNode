### 运行
+ 开发环境
```javascript
npm i
npm i -g supervisor
supervisor ./bin/www
```
+ 生产环境
```javascript
npm i
npm start
```
##目录结构
<pre>
│  .gitignore          # 忽略文件,比如 node_modules
│  package.json        # 项目依赖
│  README.md           # 项目说明
│  app.js              # 入口文件,主要是一些中间件的引用
│  .eslinttrc.yml      # eslint校验
│
├─node_modules
│
│─docs                 # 文档
│
│
├─config               # 相关配置
│    │
│    │  env.js         # 指定当前环境
│    └─ config.js      # 配置文件,比如MySQL/redis等
│
├─utils                # 常用的一些静态常量
│
├─models               # 即Model层,用来定义数据库的表/字段/类型/索引
│    │
│    │  _db.js         # sequelize数据持久化
│    │
│	 │	user.js        # 用户层与数据库的映射
│    │  
│    │  index.js       # 同步模型到数据库中
│    │                 
│    │— init.sql       # 初始化数据库  
│
│                                    
│ 
│─routes                        # 即Controller层,路由
│      │
│      ├─  base.js              # 基类,权限验证,及接口JSON返回和html返回的封装
│      │
│      ├─  index.js             # 后台界面controller
│      │
│      └─  user.js              # 用户层controller
│  
│  
│  
│ ─public                       # 静态文件,这里主要是前端用的,可根据自己的技术栈选型
│      │
│      ├─stylesheets
│      │
│      ├─images
│      │
│      └─javascripts
│  
│─views                          # 即View层
│      │
│      └─  error.ejs             # 使用ejs模板,即我们的后端需要渲染的html                                    
│─
</pre>