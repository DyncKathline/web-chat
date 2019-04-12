import Vue from 'vue'
import alertComponent from './Alert.vue';

let defaultOptions = {
  show: false,
  title: '提示',
  content: '',
  btn: '确定',
  html: ''
};

let Alert = (options) => {
  let alertConstructor = Vue.extend(alertComponent);
  let instance = new alertConstructor({
    el: document.createElement('div')
  });
  document.body.appendChild(instance.$el);
  // 将单个 confirm instance 的配置合并到默认值中
  let newOptions = Object.assign({}, defaultOptions, options);

  Object.keys(newOptions).map(item => {
    instance[item] = newOptions[item];
  });

  return new Promise((resolve, reject) => {
    // instance.show = true;
    const onClose = (type) => {
      resolve(type);
    };
    instance.onClose = onClose;
  });
};

export default Alert;
