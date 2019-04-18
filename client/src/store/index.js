/**
 * Created by Administrator on 2017/4/17.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import {postUploadAvatar, postUploadFile, RegisterUser,
  loginUser, RoomHistoryAll, getRobotMessage} from '../api/server.js';
import {setItem, getItem} from '../utils/localStorage';
import {ROBOT_NAME, ROBOT_URL} from '../const/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {
      src: getItem('src'),
      userid: getItem('userid'),
      name: getItem('name')
    },
    isDiscount: false,
    // 存放房间信息，为了方便以后做多房间
    roomdetail: {
      id: '',
      users: {},
      infos: [],
      current: 1,
      total: 0
    },
    // 存放机器人开场白
    robotmsg: [
      {
        username: ROBOT_NAME,
        src: ROBOT_URL,
        msg: '如果微信群过期了,添加作者微信(添加时记得备注:项目交流)'
      },
      {
        username: ROBOT_NAME,
        src: ROBOT_URL,
        img: "https://s3.qiufengh.com/webchat/webcaht-my.jpeg"
      },
      {
        username: ROBOT_NAME,
        src: ROBOT_URL,
        msg: '期待你的加入'
      },
      {
        username: ROBOT_NAME,
        src: ROBOT_URL,
        img: "https://s3.qiufengh.com/webchat/webchat-group.jpeg"
      },
      {
        username: ROBOT_NAME,
        src: ROBOT_URL,
        msg: '如果还有什么想知道的可以问我'
      }],
    unRead: {

    },
    // 是否启动tab
    istab: false,

    emojiShow: false
  },
  getters: {
    getTotal: state => state.roomdetail.total,
    getCurrent: state => state.roomdetail.current,
    getUsers: state => state.roomdetail.users,
    getInfos: state => state.roomdetail.infos,
    getRobotMsg: state => state.robotmsg,
    getEmoji: state => state.emojiShow
  },
  mutations: {
    setTotal(state, value) {
      state.roomdetail.total = value;
    },
    setDiscount(state, value) {
      state.isDiscount = value;
    },
    setCurrent(state, value) {
      state.roomdetail.current = value;
    },
    setUnread(state, value) {
      for (let i in value) {
        state.unRead[i] = +value[i];
      }
    },
    setUserInfo(state, data) {
      const {type, value} = data;
      setItem(type, value);
      state.userInfo[type] = value;
    },
    setEmoji(state, data) {
      state.emojiShow = data;
    },
    setTab(state, data) {
      state.istab = data;
    },
    addRoomDetailInfos(state, data) {
      state.roomdetail.infos.push(...data);
    },
    addRoomDefatilInfosHis(state, data) {
      const list = state.roomdetail.infos;
      state.roomdetail.infos = data.concat(list);
    },
    setRoomDetailInfos(state) {
      state.roomdetail.infos = [];
    },
    setUsers(state, data) {
      state.roomdetail.users = data;
    },
    setRobotMsg(state, data) {
      state.robotmsg.push(data);
    }
  },
  actions: {
    uploadAvatar({commit}, data) {
      return new Promise((resolve, reject) => {
        postUploadAvatar(data).then(res => {
          reject(res.data)
        }).catch(function (err) {
          reject(err);
        });
      });
    },
    uploadImg({commit}, data) {
      return new Promise((resolve, reject) => {
        postUploadFile(data).then(res => {
          if (res) {
            resolve(res);
            if (res.data.errno === 0) {
              console.log('上传成功');
            }
            resolve(res);
          }
        }).catch(function (err) {
          reject(err);
        });
      });
    },
    registerSubmit({commit}, data) {
      return new Promise((resolve, reject) => {
        RegisterUser(data).then(res => {
          if (res.data.code === 200) {
            resolve({
              status: 'success',
              data: res.data
            });
          }else {
            resolve({
              status: 'fail',
              data: res.data
            });
          }
        }).catch(function (err) {
          reject(err);
        });
      });
    },
    loginSubmit({commit}, data) {
      return new Promise((resolve, reject) => {
        loginUser(data).then(res => {
          resolve(res.data);
        }).catch(function (err) {
          reject(err);
        });
      });
    },
    getAllMessHistory({state, commit}, data) {
      return new Promise((resolve, reject) => {
        RoomHistoryAll(data).then(res => {
          if (res.data.code === 200) {
            commit('addRoomDefatilInfosHis', res.data.data.data);
            if (!state.roomdetail.total) {
              commit('setTotal', res.data.data.total);
            }
          }
          resolve(res);
        }).catch(function (err) {
          reject(err);
        });
      });
    },
    getRobatMess({commit}, data) {
      const username = ROBOT_NAME;
      const src = ROBOT_URL;
      return new Promise((resolve, reject) => {
        getRobotMessage(data).then(res => {
          if (res) {
            const robotdata = JSON.parse(res.data.data);
            let msg = '';
            // 分类信息
            if (robotdata.code === 100000) {
              msg = robotdata.text;
            } else if (robotdata.code === 200000) {
              msg = robotdata.text + robotdata.url;
            } else {
              msg = '暂不支持此类对话';
            }
            commit('setRobotMsg', {msg, username, src});
            resolve(res);
          }
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }
});
export default store;
