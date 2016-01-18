var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var routes = require('./routes/index');
var config = require('./config');

//生成一个express实例 app
var app = express();

//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
//设置视图模板引擎为 ejs
app.set('view engine', 'ejs');

//加载multer，文件上传组件
app.use(multer({
    dest: './public/images',
    rename: function (fieldname, filename) {
        return filename;
    }
}));
//加载connect-flash
app.use(flash());
//设置/public/favicon.ico为favicon图标
app.use(favicon(__dirname + '/public/favicon.ico'));
//加载日志中间件
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
//加载解析json的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));
//错误日志中间件
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});
//加载session
config.session.store = new MongoStore(config.mongo);
app.use(session(config.session));

//加载路由选择
routes(app);

app.listen(process.env.PORT || config.app, function() {
    console.log('Express server listening on port ' + (process.env.PORT || config.app));
});
