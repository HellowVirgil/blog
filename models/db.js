var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
//设置数据库名、数据库地址和数据库端口,创建了一个数据库连接实例并导出
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
