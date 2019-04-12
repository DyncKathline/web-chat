const jwt = require('jsonwebtoken');  //用来生成token

const secretOrPrivateKey = "jwt";// 这是加密的key（密钥）
/**
 *
 * @param payload 可以是string或者object
 * @param secret  秘钥
 * @param expires 过期时间默认一小时
 * @returns {Object} token 要放到 authorization 这个header里
 */
function createToken(payload, secret = secretOrPrivateKey, expires = 3600) {

  // let token = jwt.sign(payload, secret, {
  //   expiresIn: expires  // 1小时过期
  // });
  let token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + expires,
    data: 'foobar'
  }, secret);

  return token;
}

function checkToken(token) {
  jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
    if (err) {  //  时间失效的时候 || 伪造的token
      return {'status':0};
    } else {
      return {'status':1};
    }
  });
}

module.exports = {
  secretOrPrivateKey,
  createToken,
  checkToken,
};
