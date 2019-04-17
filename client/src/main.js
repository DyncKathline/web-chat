import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/default.css';
// 使用museui组件
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './assets/css/main.scss';
import socket from './socket';
import {queryString} from './utils/queryString';
import errorCode from "./utils/errorCode";

import vuePicturePreview from './components/photo-viewer';
Vue.use(vuePicturePreview);
import Alert from './components/Alert';
Vue.use(Alert);
Vue.prototype.$Alert = Alert;
import Confirm from './components/Confirm';
Vue.use(Confirm);
Vue.prototype.$Confirm = Confirm;
import Toast from './components/Toast';
Vue.use(Toast);

Vue.use(MuseUI);
Vue.config.productionTip = false;
Vue.prototype.$errorCode = errorCode;

const Notification = window.Notification;

const popNotice = function (msgInfo) {
  if (Notification.permission === "granted") {
    let content = '';
    if (msgInfo.img !== '') {
      content = '[图片]';
    } else {
      content = msgInfo.msg;
    }
    const notification = new Notification(`【${msgInfo.roomid}】 提示`, {
      body: content,
      icon: msgInfo.src
    });
    notification.onclick = function () {
      notification.close();
    };
  }
};

socket.on('connect', () => {
  console.log('connect');
  const roomId = queryString(window.location.href, 'roomId');
  const userId = store.state.userInfo.userid;
  if (userId) {
    socket.emit('login', {name: userId});
  }
  if (roomId) {
    const obj = {
      name: userId,
      src: store.state.userInfo.src,
      roomid: roomId
    };
    socket.emit('room', obj);

    if (store.state.isDiscount) {
      store.commit('setRoomDetailInfos');
      store.commit('setCurrent', 1);
      store.commit('setDiscount', false);
      store.commit('setTotal', 0);
      store.dispatch('getAllMessHistory', {
        current: 1,
        roomid: roomId
      });
    }
  }
});

socket.on('disconnect', () => {
  console.log('disconnect');
  store.commit('setDiscount', true);
});

socket.on('message', function (obj) {
  store.commit('addRoomDetailInfos', [obj]);
  console.log(Notification.permission);
  if (Notification.permission === "granted") {
    popNotice(obj);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      popNotice(obj);
    });
  }
});

document.addEventListener('touchstart', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
    store.commit('setEmoji', true);
  } else {
    store.commit('setEmoji', false);
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
