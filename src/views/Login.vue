<template>
  <div>
    <Header/>
    <div class="pageContent">
      <mu-container class="mu-demo-container">
        <mu-paper class="demo-paper" :z-depth="1">
          <mu-form ref="form" :model="validateForm" class="mu-demo-form">
            <h3>用户登录</h3>
            <mu-form-item label="用户名" prop="username" :rules="usernameRules">
              <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="密码" prop="password" :rules="passwordRules">
              <mu-text-field
                v-model="validateForm.password"
                :action-icon="visibility ? 'visibility_off' : 'visibility'"
                :action-click="() => (visibility = !visibility)"
                :type="visibility ? 'text' : 'password'"
              ></mu-text-field>
            </mu-form-item>
            <mu-form-item prop="isAgree" :rules="argeeRules">
              <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="submit">提交</mu-button>
              <mu-button @click="clear">重置</mu-button>
            </mu-form-item>
            <mu-form-item>
              第三方登录：
              <mu-button icon @click="togithub">
                <mu-icon size="36" value=":iconfont login-github"></mu-icon>
              </mu-button>
            </mu-form-item>
          </mu-form>
        </mu-paper>
      </mu-container>
    </div>
    <Footer/>
  </div>
</template>
<style>
.pageContent {
  min-height: 50rem;
}
.mu-demo-form {
  width: 50%;
  max-width: 460px;
  margin: 1% auto;
  padding: 10% 5%;
}
</style>

<script>
import { setToken, setUserInfo } from "../util/dataStorage.js";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "Login",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "必须填写用户名" },
        { validate: val => val.length >= 5, message: "用户名长度大于5" }
      ],
      passwordRules: [
        { validate: val => !!val, message: "必须填写密码" },
        {
          validate: val => val.length >= 6 && val.length <= 10,
          message: "密码长度大于6小于10"
        }
      ],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        username: "",
        password: "",
        isAgree: false
      },
      visibility: false,
      githubUrl:
        "https://github.com/login/oauth/authorize?client_id=0a743bb1463b1af5435b&redirect_uri=http://127.0.0.1:8081/github&state="
    };
  },
  methods: {
    randomNum(m, n) {
      var num = Math.floor(Math.random() * (m - n) + n);
      return num;
    },
    submit() {
      this.$refs.form.validate().then(result => {
        if (result) {
          const loading = this.$loading();

          let postData = {
            ucode: this.validateForm.username,
            upwd: this.validateForm.password
          };
          this.$axios
            .post(
              "/login",
              //this.$qs.stringify(postData)
              postData
            )
            .then(successResponse => {
              let data = successResponse.data;

              if (data.meta.code === 200) {
                setToken(data.data.token);
                setUserInfo(data.data.data);
                this.$toast.success("登陆成功");
                loading.close();
                window.location.replace("/");
              } else {
                this.$toast.error("账号或密码错误");
                loading.close();
              }
            })
            .catch(failResponse => {
              loading.close();
            });
        }
      });
    },
    togithub() {
      var state = this.randomNum(1,100)
      window.location.href=this.githubUrl+state;
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        username: "",
        password: "",
        isAgree: false
      };
    }
  }
};
</script>
