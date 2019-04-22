// 日志文件
var log4js = require('log4js');
let programName = "log4js";
log4js.configure({
    appenders: {
      out: {
        type: 'stdout'
      },
      log_file: {
        type: 'file',
        filename: __dirname + `/../logs/${programName}.log`,
        maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件log4js.log.1的序列自增长的文件
      },
      data_file:{//：记录器3：输出到日期文件
        type: "dateFile",
        filename: __dirname + `/../logs/${programName}`,//您要写入日志文件的路径
        alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
        daysToKeep:10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
        //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
        pattern: "-yyyy-MM-dd-hh.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
        // encoding : 'utf-8',//default "utf-8"，文件的编码
      },
      error_file:{//：记录器4：输出到error log
        type: "dateFile",
        filename: __dirname + `/../logs_error/${programName}_error`,//您要写入日志文件的路径
        alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
        // daysToKeep:10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
        //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
        pattern: "_yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
        // encoding : 'utf-8',//default "utf-8"，文件的编码
        // compress: true, //是否压缩
      },
    },
    categories: {
      default: { appenders: ['out', 'log_file', 'data_file'], level: 'debug' },
      production:{appenders:['log_file','data_file'], level:'warn'},  //生产环境 log类型 只输出到按日期命名的文件，且只输出警告以上的log
      error_log:{appenders:['error_file'], level:'error'},//error 等级log 单独输出到error文件中 任何环境的errorlog 将都以日期文件单独记录
    }
});
global.logger = log4js.getLogger();

exports.log4js = log4js;
exports.logger = global.logger;