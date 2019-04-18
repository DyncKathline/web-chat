// jwtAuth.js,token中间件
const expressJwt = require("express-jwt");
const jwt = require('jsonwebtoken');
const secretKey = 'qmai';

/**
 * express-jwt中间件帮我们自动做了token的验证以及错误处理，
 * 所以一般情况下我们按照格式书写就没问题，其中unless放的就
 * 是你想要不检验token的api。
 * @param path  array，例如：["/api/user/login", "/api/user/register"]
 */
const jwtAuth = path => expressJwt({secret: secretKey}).unless({path: path});
/**
 *
 * @param payload  object,但是不能嵌套object，例如：{name: '小宝',sex: '女'}
 */
const token = payload => jwt.sign(payload, secretKey, {
  expiresIn : 60 * 60 * 24 // 授权时效24小时
});

module.exports = {
  token,
  jwtAuth,
};