<template>
  <div>
    <div>
      <Header/>
      <mu-container class="mu-demo-container">
        <mu-paper class="demo-paper" :z-depth="1">
          <mu-form ref="form" :model="validateForm" class="mu-demo-form">
            <h3>用户注册</h3>
            <mu-form-item label="用户名" prop="username" :rules="usernameRules" :error-text="ucodeV">
              <mu-text-field v-model="validateForm.username" prop="username" @change="Vucode"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="密码" prop="password" :rules="passwordRules">
              <mu-text-field
                v-model="validateForm.password"
                :action-icon="visibility ? 'visibility_off' : 'visibility'"
                :action-click="() => (visibility = !visibility)"
                :type="visibility ? 'text' : 'password'"
              ></mu-text-field>
            </mu-form-item>
            <mu-form-item label="邮箱" prop="email" :rules="emailRules" :error-text="emailV">
              <mu-text-field prop="email" v-model="validateForm.email" @change="Vemail"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="验证码" prop="vcode" :rules="vcodeRules" v-if="emailFlag">
              <mu-text-field v-model="validateForm.vcode" prop="vcode">
                <mu-button
                  @click="getVcode()"
                  :disabled="(!this.emailReg.test(this.validateForm.email)) ?true:false"
                  small
                  v-show="codeshow"
                >获取邮箱验证码</mu-button>
                <mu-button :disabled="true" small v-show="!codeshow">{{codecount}}秒后重新获取</mu-button>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="isAgree" :rules="argeeRules">
              <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="submit">提交</mu-button>
              <mu-button @click="clear">重置</mu-button>
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
  padding: 10%;
}
</style>

<script>
import { setToken, setUserInfo } from "../util/dataStorage.js";
import { truncate } from "fs";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "Register",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      ucodeV: "",
      emailV: "",
      emailFlag: false,
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
      emailRules: [
        { validate: val => !!val, message: "必须填写邮箱" },
        { validate: val => this.emailReg.test(val), message: "邮箱格式不正确" }
      ],
      vcodeRules: [{ validate: val => !!val, message: "必须填写验证码" }],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        username: "",
        password: "",
        email: "",
        vcode: "",
        isAgree: false
      },
      visibility: false,
      emailReg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      codeshow: true,
      codecount: "",
      timer: null
    };
  },
  methods: {
    getVcode() {
      const TIME_COUNT = 60;
      let emails = [this.validateForm.email];
      this.$axios
        .post("/vcode/emailcode", { emails: emails })
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("验证码已发送");
            if (!this.timer) {
              this.codecount = TIME_COUNT;
              this.codeshow = false;
              this.timer = setInterval(() => {
                if (this.codecount > 0 && this.codecount <= TIME_COUNT) {
                  this.codecount--;
                } else {
                  this.codeshow = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.$toast.error(data.meta.msg);
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    Vucode() {
      this.ucodeV = "";

      this.$axios
        .post("/verifyUcode", { ucode: this.validateForm.username })
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code != 200) {
            this.ucodeV = "账号已存在";
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    Vemail() {
      this.emailV = "";
      if (this.emailReg.test(this.validateForm.email)) {
        this.$axios
          .post("/verifyUcode", { email: this.validateForm.email })
          .then(successResponse => {
            let data = successResponse.data;
            if (data.meta.code != 200) {
              this.emailV = "邮箱已被注册，您可以尝试找回密码";
               this.emailFlag = false;
            } else {
              this.emailFlag = true;
            }
          })
          .catch(failResponse => {
            this.$toast.error("服务器异常");
          });
      }
    },
    submit() {
      this.$refs.form.validate().then(result => {
        if (result) {
          const loading = this.$loading();
          this.$axios
            .post("/vcode/emailcode/ecode", { ecode: this.validateForm.vcode })
            .then(successResponse => {
              let data = successResponse.data;
              if (data.meta.code === 200) {
                this.$axios
                  .put("/register", {
                    ucode: this.validateForm.username,
                    upwd: this.validateForm.password,
                    email: this.validateForm.email
                  })
                  .then(successResponse => {
                    let data = successResponse.data;
                    if (data.meta.code === 200) {
                      loading.close();
                      this.$toast.success("注册成功,快去登录吧");
                      this.$router.replace({ path: "/login" });
                    } else {
                      loading.close();
                      this.$toast.error(data.meta.msg);
                    }
                  })
                  .catch(failResponse => {
                    loading.close();
                  });
              } else {
                this.$toast.error(data.meta.msg);
                loading.close();
              }
            })
            .catch(failResponse => {
              loading.close();
            });
        }
      });
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        username: "",
        password: "",
        email: "",
        vcode: "",
        isAgree: false
      };
    }
  }
};
</script>
