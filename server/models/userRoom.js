const mongoose = require('mongoose');
const UserRoomSchema = require('../schemas/userRoom');
const userRoom = mongoose.model('UserRoom', UserRoomSchema);

module.exports = userRoom;