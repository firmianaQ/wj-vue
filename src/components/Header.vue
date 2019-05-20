<template>
  <mu-appbar style="width: 100%;" color="indigo400">
    <img src="../assets/logo.png" alt="怪兽问卷" slot="left" style="height:6.5rem" @click="toIndex">
    <mu-button flat slot="left" @click="toCreateWj">
      <mu-icon value="edit"></mu-icon>创建问卷
    </mu-button>
    <mu-button flat slot="left" color="info" @click="toMyWj">
      <mu-icon value="line_weight"></mu-icon>我的问卷
    </mu-button>
    <mu-menu  placement="top-start" open-on-hover slot="right"  v-if="!isLogin">
      <mu-button flat>登录 or 注册</mu-button>
      <mu-list slot="content">
        <mu-list-item button @click="toLogin">
          <mu-icon value="line_weight"></mu-icon>
          <mu-list-item-title>登录</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button  @click="toRegister">
          <mu-icon value="line_weight"></mu-icon>
          <mu-list-item-title>注册</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-menu>
    <mu-menu placement="top-start" open-on-hover  slot="right" v-if="isLogin">
      <mu-button flat>
        <mu-icon value="face"></mu-icon>
        {{userinfo.ucode}}
      </mu-button>
      <mu-list slot="content">
        <mu-list-item button>
          <mu-icon value="line_weight"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>个人中心</mu-list-item-title>
          </mu-list-item-content>
        </mu-list-item>
        <mu-list-item button @click="outLogin">
          <mu-icon value="line_weight"></mu-icon>
          <mu-list-item-content>
            <mu-list-item-title>退出登录</mu-list-item-title>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
    </mu-menu>
  </mu-appbar>
</template>
<style>

</style>

<script>
import { getToken, getUserInfo, removeToken } from "../util/dataStorage.js";
import { isNullOrUndefined } from "util";
export default {
  name: "Header",
  data() {
    return {
      isLogin: false,
      userinfo: {}
    };
  },
  methods: {
    getLoginState() {
      let token = getToken();
      if (isNullOrUndefined(token)) {
        this.isLogin = false;
      } else {
        this.userinfo = getUserInfo();
        this.isLogin = true;
      }
    },
    toIndex(){
      const loading = this.$loading();
      this.$router.replace({ path: "/" });
      loading.close();
    },
    toLogin() {
      const loading = this.$loading();
      this.$router.replace({ path: "/login" });
      loading.close();
    },
    outLogin() {
      this.$axios
        .post("/outlogin")
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            removeToken();
            this.isLogin = false;
            this.$router.replace({ path: "/" });
          }
        })
        .catch(failResponse => {});
    },
    toRegister(){
      const loading = this.$loading();
      this.$router.replace({ path: "/register" });
      loading.close();
    },
    toCreateWj(){
      const loading = this.$loading();
      this.$router.replace({ path: "/create" });
      loading.close();
    },
    toMyWj(){
      const loading = this.$loading();
      this.$router.replace({ path: "/list" });
      loading.close();
    }
  },
  mounted() {
    this.getLoginState();
  }
};
</script>
