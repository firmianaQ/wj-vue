import Storage from 'good-storage'
import { isNullOrUndefined } from 'util';
import store from '../store.js'
export function getUserInfo() {
    let userInfo = Storage.get('USER_INFO')
    return userInfo
}


export function setUserInfo(user) {
    Storage.set('USER_INFO', user)
    return user
}

export function getToken() {
   let TOKEN_CREATETIME = Storage.get('TOKEN_CREATETIME');
   let now = new Date().getTime();
   if((now-TOKEN_CREATETIME)/60000>60){
    removeToken();
   }else{
    return Storage.get('ACCESS_TOKEN');
   }  
}

export function setToken(token) {
    store.commit('_islogin');
    Storage.set('TOKEN_CREATETIME',new Date().getTime());
    Storage.set('_islogin', true);
    return Storage.set('ACCESS_TOKEN', token)

    //return Cookies.set(Config.tokenKey, token ,{ expires: Config.cookiesExpires })
}

export function removeToken() {
    store.commit('_isout')
    Storage.set('_islogin', false);
    return Storage.remove('ACCESS_TOKEN')
}


export function isLogin() {
    return (getToken() || '').length > 5
}
