import Vue from 'vue'
import toastMessage from './toast.vue'

let ToastTem = Vue.extend(toastMessage);
let instance;
let timer = null;
let defaultOptions = {
  content: '',
  timeout: 1500,
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  show: false
};

let Toast = (options) => {
  if (!instance) {
    instance = new ToastTem();
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
    instance.show = false;
    instance.content = '';
  }
  let time = 3000;
  if (typeof options === 'string') {
    instance.content = options
  } else if (typeof options === 'object') {
    let newOptions = Object.assign({}, defaultOptions, options);
    instance.content = newOptions.content;
    time = newOptions.timeout;
  } else {
    return
  }
  instance.show = true;
  timer = setTimeout(() => {
    instance.show = false;
    clearTimeout(timer);
    timer = null;
    instance.content = '';
    document.body.removeChild(instance.vm.$el);
    instance = null;
  }, time);
};

Toast.close = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    instance.show = false;
    instance.content = '';
  }
};

Toast.install = (Vue) => {
  Vue.prototype.$Toast = Toast
};

export default Toast
