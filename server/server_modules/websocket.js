const xssFilters = require('xss-filters');
const Count = require('../models/count');
const Message = require('../models/message');
const UserRoom = require('../models/userRoom');
let cache = {};

if (process.env.NODE_ENV === 'production') {
  cache = require('./RedisCache');
  console.log('RedisCache!!!!');
} else {
  cache = require('./cache');
  console.log('cache!!!!');
}

const {
  inrcCache,
  getCacheById,
  updateCache,
  deleteCacheById,
  resetCacheById,
  updatehCache,
  gethCacheById,
  gethAllCache
} = cache;

let roomList = []; // ['room1', 'room2'];

function websocket(server) {
  const io = require('socket.io')(server);
  const users = {};

  io.on('connection', (socket) => {
    //监听用户发布聊天内容
    console.log('socket connect!');
    if (socket.timing) {
      clearInterval(socket.timing);
    }
    // socket.timing = setInterval(() => {
    //   gethAllCache('socketId').then(usersList => {
    //     for (let i = 0; i < usersList.length; i++) {
    //       const name = usersList[i];
    //       for (let j = 0; j < roomList.length; j++) {
    //         const roomid = roomList[j];
    //         const username = `${name}-${roomid}`;
    //         getCacheById(username).then(roomInfo => {
    //           findOne({username}).then(res => {
    //             if (res) {
    //               Count.update({username}, {roomInfo}, (err) => {
    //                 if (err) {
    //                   console.log('更新失败');
    //                 }
    //               })
    //             } else {
    //               const count = new Count({
    //                 username,
    //                 roomInfo: +roomInfo
    //               });
    //               count.save(function (err, res) {
    //                 if (err) {
    //                   global.logger.error(err);
    //                   return;
    //                 }
    //                 global.logger.info(res);
    //               })
    //             }
    //           });
    //         });
    //       }
    //     }
    //   });
    // }, 15 * 60 * 1000);

    socket.on('message', (msgObj) => {
      console.log('socket message!');
      //向所有客户端广播发布的消息
      const {username, src, msg, img, roomid, time} = msgObj;
      if (!msg && !img) {
        return;
      }
      // 后端限制字符长度
      const msgLimit = msg.slice(0, 200);
      const mess = {
        username,
        src,
        msg: xssFilters.inHTMLData(msgLimit), // 防止xss
        img,
        roomid,
        time
      }

      // global.logger.info(`${mess.username} 对房 ${mess.roomid} 说: ${mess.msg}`);
      if (mess.img === '') {
        const message = new Message(mess);
        message.save(function (err, res) {
          if (err) {
            global.logger.error(err);
            return;
          }
          global.logger.info(res);
          io.to(mess.roomid).emit('message', res);
        })
      }
      gethAllCache('socketId').then(usersList => {
        usersList.map(item => {
          if (!users[roomid][item]) {
            const key = `${item}-${roomid}`
            inrcCache(key);
            const socketid = gethCacheById('socketId', item);
            const count = getCacheById(key);
            const roomInfo = {};
            roomInfo[roomid] = count;
            socket.to(socketid).emit('count', roomInfo);
          }
        })
      });
    });
    // 建立连接
    socket.on('login', (user) => {
      console.log('socket login!', user);
      const {userId,} = user;
      if (!userId) {
        return;
      }
      socket.userId = userId;
      UserRoom.find({userId: userId})
        .populate('userId')
        .populate('roomId')
        .exec((err, res) => {
          if (err) {
            global.logger.error(err);
            return;
          }
          // console.log('socket userRoom-----', res);
          roomList = res;
          socket.emit('roomList', roomList);
        });
      const roomInfo = {};
      updatehCache('socketId', userId, socket.id).then(res => {
        for (let i = 0; i < roomList.length; i++) {
          const roomid = roomList[i];
          const key = `${userId}-${roomid}`;
          // 循环所有房间
          findOne({username: key}).then(res => {
            getCacheById(key).then(count => {
              if (res) {
                // 数据库查数据， 若缓存中没有数据，更新缓存
                if (+count === 0) {
                  updateCache(key, res.roomInfo);
                }
                roomInfo[roomid] = res.roomInfo;
              } else {
                roomInfo[roomid] = +count;
              }
            });
          });
        }
        // 通知自己有多少条未读消息
        socket.emit('count', roomInfo);
      });
    });
    // 加入房间
    socket.on('room', (user) => {
      console.log('socket add room!');
      const {name, roomid} = user;
      if (!name || !roomid) {
        return;
      }
      socket.name = name;
      socket.roomid = roomid;

      if (!users[roomid]) {
        users[roomid] = {};
      }
      // 初始化user
      users[roomid][name] = Object.assign({}, {
        socketid: socket.id
      }, user);

      // 初始化user
      const key = `${name}-${roomid}`;
      updatehCache('socketId', name, socket.id).then(res => {
        // 进入房间默认置空，表示全部已读
        resetCacheById(key).then(res1 => {
          // 进行会话
          socket.join(roomid);

          const onlineUsers = {};
          for (let item in users[roomid]) {
            onlineUsers[item] = {};
            onlineUsers[item].src = users[roomid][item].src;
          }
          io.to(roomid).emit('room', onlineUsers);
          global.logger.info(`${name} 加入了 ${roomid}`);
        });
      });
    });

    socket.on('roomout', (user) => {
      console.log('socket leave room!');
      const {name, roomid} = user;
      handleLogoutRoom(roomid, name);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnect!');
      const {name, roomid} = socket;
      clearInterval(socket.timing);
      handleLogoutRoom(roomid, name);
    });

    const handleLogoutRoom = (roomid, name) => {
      try {
        if (users[roomid] && users[roomid].hasOwnProperty(name)) {
          const key = `${name}-${roomid}`;
          const roomInfo = {};
          getCacheById(key).then(count => {
            roomInfo[roomid] = count;
            socket.emit('count', roomInfo);
            delete users[roomid][name];
            global.logger.info(`${name} 退出了 ${roomid}`);
            io.to(roomid).emit('roomout', users[roomid]);
            socket.leave(roomid);
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function findOne(query) {
  return new Promise((resv, rej) => {
    Count.findOne(query, (err, res) => {
      if (err) {
        rej(err);
        return;
      }
      resv(res);
    })
  })
}

module.exports = websocket;