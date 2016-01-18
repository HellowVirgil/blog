var config = require('../config'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
//设置数据库名、数据库地址和数据库端口,创建了一个数据库连接实例并导出
module.exports = new Db(config.mongo.db, new Server(config.mongo.host, config.mongo.port), {safe: true});
