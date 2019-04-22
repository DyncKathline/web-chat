var log4js = require('./log.js').log4js;
var nodemailer = require('nodemailer');
const config = {
  service: 'QQ',
  user: 'xiongxuesong@dync.cc',
  pass: 'PgvDA4tqB2zkCVAA',
};

var transporter = nodemailer.createTransport({
  aliases: ["QQ Enterprise"],
  domains: ["exmail.qq.com"],
  host: "smtp.exmail.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: config.user, // 账号
    pass: config.pass // 授权码
  },
  pool:true,
  logger: log4js.getLogger('nodemailer'),//打印日志
  debug: true
},{
  from: config.user,//发送者邮箱
  headers: {
    'X-Laziness-level': 1000
  }
});

// console.log('SMTP Configured');

var message = {
  // Comma separated lsit of recipients 收件人用逗号间隔
  to: '12xxxx101@qq.com',

  // Subject of the message 信息主题
  subject:  'Nodemailer is unicode friendly',

  // plaintext body
  text: 'Hello to myself~',

  // Html body
  html: '<p><b>Hello</b> to myself <img src= "cid:00001"/></p>' +
  '<p>Here\'s a nyan car for you as embedded attachment:<br/><img src="cid:00002"/></p>',

  // Apple Watch specific HTML body 苹果手表指定HTML格式
  watchHtml: '<b>Hello</b> to myself',

  // An array of attachments 附件
  // attachments: [
  //   // String attachment
  //   {
  //     filename: 'notes.txt',
  //     content: 'Some notes about this e-mail',
  //     contentType: 'text/plain' // optional,would be detected from the filename 可选的，会检测文件名
  //   },
  //   // Binary Buffer attchment
  //   {
  //     filename: 'image.png',
  //     content: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
  //       '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
  //       'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
  //     cid: '00001'  // should be as unique as possible 尽可能唯一
  //   },
  //   // File Stream attachment
  //   {
  //     filename: 'nyan cat.gif',
  //     path: __dirname + '/appData/nyan.gif',
  //     cid: '00002'  // should be as unique as possible 尽可能唯一
  //   }
  // ]

};

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html) {
  // console.log('Send Mail');
  transporter.sendMail({
    from: config.user,
    to: recipient,
    subject: subject,
    html: html
  }, (error, info) => {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });
};

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} msg 发送的内容
 */
var sendTemplateMail = function (recipient, subject, msg) {
  // console.log('Send Mail');
  transporter.sendMail({
    from: config.user,
    to: recipient,
    subject: subject,
    html: `<p>欢迎 ${msg} 登录</p>`
  }, (error, info) => {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });
};

var sendCustomMail = function (message) {
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });
};

module.exports = {
  sendMail,
  sendTemplateMail,
  sendCustomMail,
};