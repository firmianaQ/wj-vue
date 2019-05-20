import Vue from 'vue'
import Vuex from 'vuex'
import Storage from 'good-storage'
import { getToken } from "./util/dataStorage.js";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    _islogin: Storage.get('_islogin'),
    _userinfo: Storage.get('USER_INFO'),
    _token:getToken,
    _djUrl:'http://www.irua.cn/'
  },
  mutations: {
    _islogin (state) {
      state._islogin=true;
    },
    _isout(state){
      state._islogin=false;
    }
  }
})
export default store;