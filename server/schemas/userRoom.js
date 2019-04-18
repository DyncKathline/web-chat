var mongoose = require('mongoose')
//房间模型
var UserRoomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    //Schema hasn't been registered for model "xxx".\nUse mongoose.model(name, schema),
    //这里的name必须和ref一致
  },
  roomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room'
  }
})
//静态方法
UserRoomSchema.statics = {
  fetch: function (conditions = {},cb) {
    return this
      .find(conditions)
      // .populate('roomId')
      // .populate('userId')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
module.exports = UserRoomSchema