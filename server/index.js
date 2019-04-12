var port = process.env.PORT || 9090;
var env = process.env.NODE_ENV || 'development'
var express = require('express');

// sesstion 存储
var session = require('express-session');
var cookieParser = require('cookie-parser');

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
// sesstion 存储
app.use(cookieParser());
app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'session_cookie_secret', //密钥
  name: 'qmai', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: 80000
  } //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));


require('./router/routes.js')(app);

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  // app.use(morgan(':method :url :status'))
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

var server = app.listen(port)
// websocket
require('./server_modules/websocket.js')(server);
