var mongoose = require('mongoose')
//房间模型
var RoomSchema = new mongoose.Schema({
  name: String,
  src: String
})
//静态方法
RoomSchema.statics = {
  getList: function (cb) {
    var options = {
      allowDiskUse: true
    };
    var pipeline = [
      // {
      //   "$project": {
      //     "_id": 0,
      //     "userrooms": "$$ROOT"
      //   }
      // },
      {
        "$lookup" : {
          "localField" : "rooms._id",
          "from" : "userrooms",
          "foreignField" : "roomId",
          "as" : "userrooms"
        }
      },
      {
        "$unwind" : {
          "path" : "$userrooms",
          "preserveNullAndEmptyArrays" : true
        }
      },
      {
        "$lookup" : {
          "localField" : "userrooms.userId",
          "from" : "users",
          "foreignField" : "_id",
          "as" : "users"
        }
      },
      {
        "$unwind" : {
          "path" : "$users",
          "preserveNullAndEmptyArrays" : true
        }
      }
    ];
    try {
      let roomList = Room.aggregate(pipeline, options);
      return cb(null, roomList);
    }catch (err) {
      return cb(err, null);
    }
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
module.exports = RoomSchema