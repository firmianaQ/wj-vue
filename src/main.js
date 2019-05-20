import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import store from './store.js'
import qs from 'qs'
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import 'muse-ui-message/dist/muse-ui-message.css';
import './assets/icon/iconfont.css';
import Message from 'muse-ui-message';
import Loading from 'muse-ui-loading';
import Toast from 'muse-ui-toast';
import VueQriously from 'vue-qriously'
import VueWeChatTitle from 'vue-wechat-title';
import VueClipboard from 'vue-clipboard2'
import Storage from 'good-storage'
import Print from 'vue-print-nb'
import { removeToken } from './util/dataStorage.js';
Vue.use(Print);

//引入echarts
var echarts = require('echarts');

//引入axios，并设置基础URL为后端服务api地址
var axios = require('axios');
let token = Storage.get('ACCESS_TOKEN');
axios.defaults.baseURL = 'http://127.0.0.1:8443/api';
//axios.defaults.baseURL = '/api';
axios.defaults.headers.common['token'] = token;
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.interceptors.response.use(response => {  //成功请求到数据        
  //这里根据后端提供的数据进行对应的处理        
  return response;
},
  error => {  //响应错误处理console.log('error');    
    debugger;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          removeToken();
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })
Toast.config({
  position: 'top',               // 弹出的位置
  time: 3000,                       // 显示的时长
  closeIcon: 'close',               // 关闭的图标
  close: true,                      // 是否显示关闭按钮
  successIcon: 'check_circle',      // 成功信息图标
  infoIcon: 'info',                 // 信息信息图标
  warningIcon: 'priority_high',     // 提醒信息图标
  errorIcon: 'warning'              // 错误信息图标
})
// 将API方法绑定到全局
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$toast = Toast;
Vue.prototype.$loading = Loading;
Vue.prototype.$echarts = echarts;

Vue.use(MuseUI);
Vue.use(VueWeChatTitle)
Vue.use(VueQriously)
Vue.use(Message);
Vue.use(VueClipboard)
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state._islogin) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.query.redirect }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
