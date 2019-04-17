import Vue from 'vue'
import confirmComponent from './Confirm.vue';

let defaultOptions = {
  show: false,
  title: '',
  content: '',
  ok: '确定',
  cancel: '取消'
};

let Confirm = (options) => {
  let alertConstructor = Vue.extend(confirmComponent);
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
    let successBtn = instance.onSubmit;
    let closeBtn = instance.onClose;
    instance.onSubmit = () => {
      resolve("submit");
      successBtn();
    };
    instance.onClose = () => {
      reject("close");
      closeBtn();
    }
  });
};

export default Confirm;
