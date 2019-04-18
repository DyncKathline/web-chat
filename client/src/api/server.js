import Axios from './axios';

// 登录接口
export const loginUser = data => Axios.post('/user/signin', data);
// 注册接口
export const RegisterUser = data => Axios.post('/user/signup', data);
// 新建房间
export const createRoom = data => Axios.post('/room/create', data);
// 加入房间
export const joinRoom = data => Axios.post('/room/add', data);
// 获取用户所有房间列表
export const getUserRoomList = data => Axios.post('/room/getUserAllRoom', data);
// 获取当前房间所有历史记录
export const RoomHistoryAll = data => Axios.get('/history/message', {
  params: data
});
// 机器人
export const getRobotMessage = data => Axios.get('/robotapi', {
  params: data
});
// 上传图片
export const postUploadFile = data => Axios.post('/file/uploadimg', data, {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export const postUploadAvatar = data => Axios.post('/file/avatar', data, {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

// 请求公告
export const getNotice = () => Axios.get('https://s3.qiufengh.com/config/notice-config.js');
