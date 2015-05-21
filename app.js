var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

//生成一个express实例 app
var app = express();

//设置端口
app.set('port',process.env.PORT || 3000);
//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
//设置视图模板引擎为 ejs
app.set('view engine', 'ejs');


//设置/public/favicon.ico为favicon图标
//app.use(favicon(__dirname + '/public/favicon.ico'));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

//路由选择
routes(app);

//路由控制器
app.listen(app.get('port'),function() {
    console.log('Express server listening on port ' + app.get('port'));
});
