import axios from 'axios';
import router from "../router"
import {setItem, getItem, removeItem} from '../utils/localStorage';

const baseURL = 'http://localhost:9090';

const instance = axios.create();

instance.defaults.baseURL = baseURL;
instance.defaults.timeout = 30000; // 所有接口30s超时
instance.defaults.withCredentials = true; // 允许跨域

// 请求统一处理
instance.interceptors.request.use(request => {
  const qmai_token = getItem('qmai_token');
  if (qmai_token) {
    // 此处有坑，下方记录
    request.headers['Authorization'] =`Bearer ${qmai_token}`;
  }

  return request;
}, error => Promise.reject(error));

// 对返回的内容做统一处理
instance.interceptors.response.use(response => {
  if (response.status === 200) {
    if(response.data.code == 600) {//token过期
      removeItem('qmai_token');
      router.replace({
        path: "/login"
      });
    }else {
      if (response.data.code == 200 && response.data.data.token) {
        setItem('qmai_token', response.data.data.token);
      }
    }
    return response;
  }
  return Promise.reject(response);
}, error => {
  if (error) {
    console.log(JSON.stringify(error));
  } else {
    console.log('出了点问题，暂时加载不出来，请稍后再来吧');
  }
  return Promise.reject(error);
});

export default instance;
