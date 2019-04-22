var port = process.env.PORT || 9090;
var env = process.env.NODE_ENV || 'development'
var express = require('express');

var bodyParser = require('body-parser');
// 日志
var log4js = require('./server_modules/log.js').log4js;
var logger = require('./server_modules/log.js').logger;

// 数据库
var mongoose = require('./server_modules/mongodb.js');

// 服务启动
var app = express();

var router = express.Router();
// 用于静态展示入口
router.get('/', function (req, res, next) {
  req.url = './index.html';
  next();
});
//声明静态资源地址
app.use(express.static('./dist'));
app.use(router);
// 服务器提交的数据json化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


require('./router/routes.js')(app);

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.locals.pretty = true;
  mongoose.set('debug', true);
}
// app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(log4js.connectLogger(logger, {level:'auto', format:':method :url  :status  :response-time ms'}));

var server = app.listen(port)
// websocket
require('./server_modules/websocket.js')(server);
