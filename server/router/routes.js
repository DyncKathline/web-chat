const User = require('../models/user');
const Message = require('../models/message');
const Room = require('../models/room');
const UserRoom = require('../models/userRoom');
const superagent = require('superagent');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {cmder, rmDirFiles} = require('../utils/cmd');
const fileTool = require('fs-extra');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const {jwtSign, jwtAuth, jwtDecode} = require('../utils/jwtAuth');
const {sendTemplateMail} = require('../server_modules/mail');

const mkdirsSync = function (dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
};

// 创建文件夹
const createFolder = function (folder) {
  try {
    // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
    // 如果文件路径不存在将会抛出错误"no such file or directory"
    fs.accessSync(folder);
  } catch (e) {
    // 文件夹不存在，以同步的方式创建文件目录。
    mkdirsSync(folder);
  }
};

const uploadFolder = './cache_temp';
const urlPath = './static/files';

console.log(uploadFolder);

createFolder(uploadFolder);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, ~~(Math.random() * 999999) + "avatar-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.toLowerCase();
  if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/webp') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
// 创建 multer 对象
const upload = multer({
  storage: storage,
  limits: {
    fields: 10,
    files: 10,
    fileSize: 5 * 1024 * 1024
  },
  fileFilter,
});

const uploadAvatar = multer({
  storage: storageAvatar,
  limits: {
    fields: 10,
    files: 10,
    fileSize: 4 * 1024 * 1024
  },
  fileFilter,
});

const noSessionRequests = [
  '/user/signup',
  '/user/signin',
];

module.exports = (app) => {
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-with, X_Request_With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method === 'OPTIONS') {
      // 返回结果
      res.send(200);/*让options请求快速返回*/
    } else {
      next();
    }
  });
  app.use(jwtAuth(noSessionRequests));
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      res.json({
        code: 600,
        message: err
      });
      return;
    }

    next();
  });

  /* POST upload listing. */
  app.post('/file/uploadimg', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (file) {

      const {mimetype, filename, size, path: localPath} = file;

      const {username, roomid, time, src} = req.body;

      const staticUrl = path.join('./static_temp', filename);
      const shrinkFiles = imagemin(['cache_temp/*.png', 'cache_temp/*.jpg', 'cache_temp/*.jpeg'], 'static_temp', {
        use: [
          imageminMozjpeg({quality: '65'}),
          imageminPngquant({quality: '65'})
        ]
      }).then(shrinkFiles => {
        let img = '';
        // 兼容windows
        fileTool.copySync('./static_temp', './static/files');
        rmDirFiles('./cache_temp');
        rmDirFiles('./static_temp');
        img = path.join(urlPath, filename);

        const mess = {
          username,
          src,
          img,
          roomid,
          time,
        }

        const message = new Message(mess);
        message.save((err, mess) => {
          if (err) {
            global.logger.error(err);
            res.json({
              code: 500,
              message: '保存异常!'
            });
            return;
          }
          global.logger.info(mess);
          res.json({
            code: 200,
            message: '保存成功!'
          });
        });
      });
    } else {
      res.json({
        code: 500,
        message: '保存异常!'
      });
    }

  });

  app.post('/file/avatar', uploadAvatar.single('file'), async (req, res, next) => {
    const file = req.file;
    console.log(req.body);
    console.log(file);
    if (file) {
      const {mimetype, filename, size, path: localPath} = file;
      const {username} = req.body;

      const staticUrl = path.join('./static_temp', filename);

      const shrinkFiles = imagemin(['cache_temp/*.png', 'cache_temp/*.jpg', 'cache_temp/*.jpeg'], 'static_temp', {
        use: [
          imageminMozjpeg({quality: '30'}),
          imageminPngquant({quality: '30'})
        ]
      }).then(shrinkFiles => {
        let img = '';
        // 兼容windows
        fileTool.copySync('./static_temp', './static/files');
        rmDirFiles('./cache_temp');
        rmDirFiles('./static_temp');
        img = path.join(urlPath, filename);
        console.log(img);

        User.update({name: username}, {src: img}, (err, data) => {
          if (err) {
            global.logger.error(err);
            res.json({
              code: 500,
              message: '保存异常!'
            });
            return;

          }
          res.json({
            code: 0,
            data: {
              url: img
            },
            message: '保存成功!'
          });
        })
      });
    } else {
      res.json({
        code: 500,
        message: '保存异常!'
      });
    }

  });

  // 注册
  app.post('/user/signup', (req, res) => {
    const _user = req.body;
    // console.log(_user)
    User.findOne({name: _user.name}, (err, user) => {
      if (err) {
        global.logger.error(err)
      }
      if (user) {
        res.json({
          code: 201,
          message: '用户名已存在'
        })
      } else {
        user = new User(_user)
        user.save((err, user) => {
          if (err) {
            global.logger.error(err)
          }
          res.json({
            code: 200,
            message: '注册成功'
          })
        })
      }
    })
  });
  // 登录
  app.post('/user/signin', (req, res) => {
    const _user = req.body;
    const name = _user.name;
    const password = _user.password;
    User.findOne({name: name}, (err, user) => {
      if (err) {
        global.logger.error(err);
      }
      if (!user) {
        res.json({
          code: 202,
          message: '用户不存在'
        })
      } else {
        if (!!password) {
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              global.logger.error(err);
            }
            if (isMatch) {
              // global.logger.info('success', user);
              // sendTemplateMail('1350624667@qq.com', '你登录啦', name);
              res.json({
                code: 200,
                message: '登录成功',
                data: {
                  token: jwtSign({id: user._id}),
                  user: user,
                  src: user.src
                }
              })
            } else {
              res.json({
                code: 203,
                message: '密码不正确'
              });
              global.logger.info('password is not meached');
            }
          })
        } else {
          res.json({
            code: 400,
            message: '缺少参数'
          })
        }
      }

    })
  });
  //退出
  app.post('/user/logout', (req, res) => {

  });
  //新建房间
  app.post('/room/create', (req, res) => {
    const _room = req.body;
    // console.log(_room)
    Room.findOne({name: _room.name}, (err, room) => {
      if (err) {
        global.logger.error(err)
      }
      if (room) {
        res.json({
          code: 205,
          message: '房间名已存在'
        })
      } else {
        let room = new Room({
          name: _room.name,
        });
        room.save((err, room) => {
          if (err) {
            global.logger.error(err)
          }
          // console.log('room create ------', res, err);
          let userRoom = new UserRoom({
            userId: _room.userId,
            roomId: room._id,
          });
          userRoom.save((err, res) => {
            // console.log('UserRoom create ------', res, err);
          });
          res.json({
            code: 200,
            data: room,
            message: '房间创建成功'
          })
        })
      }
    })
  });
  //加入房间
  app.post('/room/add', (req, res) => {
    const _room = req.body;
    // console.log(_room)
    Room.findOne({name: _room.name}, (err, room) => {
      if (err) {
        global.logger.error(err)
      }
      if (room) {
        UserRoom.findOne({userId: _room.userId,roomId: room._id}, (err, res) => {
          console.log('room create ------', res, err);
          if(!res) {
            let userRoom = new UserRoom({
              userId: _room.userId,
              roomId: room._id,
            });
            userRoom.save((err, res) => {
              // console.log('UserRoom create ------', res, err);
            });
          }
        });
        res.json({
          code: 200,
          data: room,
          message: '房间加入成功'
        })
      } else {
        res.json({
          code: 207,
          data: room,
          message: '房间加入失败'
        })
      }
    })
  });
  //删除房间
  app.post('/room/delete', (req, res) => {
    const _room = req.body;
    var wherestr = {'name': _room.name};
    // console.log(_room)
    Room.remove(wherestr, (err, room) => {
      if (err) {
        global.logger.error(err)
      }
      if (room) {
        res.json({
          code: 200,
          message: '房间删除成功'
        })
      } else {
        res.json({
          code: 206,
          data: room,
          message: '房间删除失败'
        })
      }
    })
  });
  //获取用户所有房间
  app.post('/room/getUserAllRoom', (req, res) => {
    const userId = req.body.userId;
    console.log('socket login!', userId);
    UserRoom.find({userId: userId})
      .populate('userId')
      .populate('roomId')
      .exec((err, data) => {
        if(err) {
          global.logger.error(err);
          return;
        }
        // console.log('socket userRoom-----', data);
        res.json({
          code: 200,
          message: '获取用户房间列表成功',
          data: data
        })
      });
  });
  // 获取历史记录
  app.get('/history/message', (req, res) => {
    const id = req.query.roomid;
    const current = req.query.current;
    const total = req.query.total || 0;
    if (!id || !current) {
      global.logger.error('roomid | page current can\'t find');
      res.json({
        code: 400,
        message: '缺少参数'
      });
    }
    const message = {
      data: {},
      total: 0,
      current: current
    };
    try {
      Message.find({roomid: id}).count().exec((err, messageTotal) => {
        message.total = messageTotal;
        let skip = parseInt((current - 1) * 20);
        if (+total) {
          skip += (messageTotal - total);
        }
        Message.find({roomid: id}).skip(skip).sort({"time": -1}).limit(20).exec((err, messageData) => {
          message.data = messageData.reverse();
          res.json({
            code: 200,
            message: '获取历史记录成功',
            data: message
          })
        });
      });
    } catch (e) {
      res.json({
        code: 204,
        data: message,
        message: '获取历史记录失败'
      })
    }
  });
  // 机器人消息
  app.get('/robotapi', (req, res) => {
    const response = res;
    const info = req.query.info;
    const userid = req.query.id;
    const key = 'fde7f8d0b3c9471cbf787ea0fb0ca043';
    superagent.post('http://www.tuling123.com/openapi/api')
      .send({info, userid, key})
      .end((err, res) => {
        if (err) {
          global.logger.error(err)
        }
        response.json({
          code: 200,
          data: res.text,
          message: ''
        })
      });
  });
};
