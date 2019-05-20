<template>
  <div>登录中...</div>
</template>
<script>
import { setToken, setUserInfo } from "../../util/dataStorage.js";
import Toast from "muse-ui-toast";
export default {
  name: "github",
  data() {
    return {
      isLogin: false,
      userinfo: {}
    };
  },
  methods: {
    getData() {
      var url = location.search;
      this.$axios
        .get("/login_callback/git" + url)
        .then(function(response) {
          var data = response.data;
          console.log(response);
          if (data.meta.code == 200) {
            setToken(data.data.token);
            setUserInfo(data.data.data);
            Toast.success("登录成功");
            window.location.replace("/");
          } else {
            Toast.error("登陆失败");
            window.location.replace("/login");
          }
        })
        .catch(function(error) {
          Toast.error("服务器异常");
          window.location.replace("/login");
          console.log(error);
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
