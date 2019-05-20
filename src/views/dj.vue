<template>
  <div class="dj_body">
    <mu-container>
    <div class="dj_head">
      <p class="wj_title">{{wj.wjTitle}}</p>
      <p class="wj_memo">{{wj.wjMemo}}</p>
    </div>
    <mu-paper class="dj_form" :z-depth="3">
      <div v-for="(tm, tmi) in wj.wjtms" :key="tmi">
        <p class="tm_title">
          {{tmi+1}}.{{tm.wjtmTitle}}
          <span v-if="tm.wjtmRequired=='true'">&nbsp;*必填项</span>
          <input type="hidden" v-model="dj.djtms[tmi].djtmTitle">
        </p>
        <p class="tm_memo" v-if="tm.wjtmMemo!=''">{{tm.wjtmMemo}}</p>
        <div class="tm_input">
          <mu-form :model="dj" v-if="tm.wjtmType=='单选'">
            <mu-form-item v-for="(xx,xi) in tm.tmxxs" :key="xi">
              <mu-radio :value="xx.tmxxId+''" v-model="dj.djtms[tmi].djtmAnswer" :label="xx.tmxxTitle"></mu-radio>
            </mu-form-item>
          </mu-form>
          <mu-form :model="dj" v-if="tm.wjtmType=='多选'">
            <mu-form-item>
              <mu-checkbox
                v-for="(xx,xi) in tm.tmxxs"
                :key="xi"
                :value="xx.tmxxId"
                v-model="djtmAnswer[xx.tmxxId]"
                :label="xx.tmxxTitle"
                @click="ckboxAnswer(xi,tmi,xx.tmxxId)"
              ></mu-checkbox>
            </mu-form-item>
          </mu-form>
          <mu-form :model="dj" v-if="tm.wjtmType=='填空'">
            <mu-form-item>
              <mu-text-field type="text" v-model="dj.djtms[tmi].djtmAnswer" max-length="30"></mu-text-field>
            </mu-form-item>
          </mu-form>
          <mu-form :model="dj" v-if="tm.wjtmType=='文本'">
            <mu-form-item>
              <mu-text-field
                multi-line
                :rows="1"
                :rows-max="6"
                v-model="dj.djtms[tmi].djtmAnswer"
                max-length="300"
              ></mu-text-field>
            </mu-form-item>
          </mu-form>
        </div>
      </div>
      <mu-button color="secondary" large @click="answerSub">我完事儿了</mu-button>
    </mu-paper>
    
    </mu-container>
      <Footer/>
  </div>
</template>
<style>
html,
body {
  background-color: rgb(149, 218, 212);
}
.dj_body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
.dj_head {
  margin: 0 auto;
  text-align: center;
  padding: 0rem 2rem;
}
.dj_form {
  height: 90%;
  margin: 1% auto;
  padding: 1rem 2rem;
  text-align: center;
}
.wj_title {
  color: rgb(51, 62, 71);
  font-size: 2rem;
}
.wj_memo {
  color: rgb(51, 62, 71);
  font-size: 1rem;
}
.tm_title {
  text-align: left;
  font-size: 1rem;
}
.tm_memo {
  text-align: left;
  font-size: 0.7rem;
  color: rgb(168, 161, 161);
}
.tm_title span {
  color: red;
  font-size: 0.5rem;
}
</style>

<script>
import Footer from "@/components/Footer.vue";
export default {
  name: "dj",
  components: {
    Footer
  },
  data() {
    return {
      wjId: this.$route.params.wjId + "",
      wj: {},
      dj: {
        wjId: this.$route.params.wjId + "",
        djtms: []
      },
      djtmAnswer: []
    };
  },
  methods: {
    getData(wjId) {
      const loading = this.$loading();
      this.$axios
        .get("/data/wjs/" + wjId)
        .then(successResponse => {
          let data = successResponse.data;
          let statusCode = data.meta.code;
          if (statusCode === 200) {
            this.wj = data.data;
            console.log(this.wj);
            this.wj.wjtms.forEach(i => {
              let djtm = {
                wjtmId: i.wjtmId + "",
                djtmTitle: i.wjtmTitle,
                djtmAnswer: [],
                answerRequired: i.wjtmRequired
              };
              this.dj.djtms.push(djtm);
            });
            loading.close();
           
            if (this.wj.wjState=='停止回收') {
              this.$toast.warning(data.meta.msg)
            }
          }else if(statusCode === 500){
            this.$toast.error("问卷不存在");
            loading.close();
            this.$router.replace({ path: "/" });
          }
        })
        .catch(failResponse => {
          loading.close();
        });
    },
    ckboxAnswer(xi, tmi, str) {
      let index = this.dj.djtms[tmi].djtmAnswer.findIndex(function(value) {
        return value == str;
      });
      if (this.djtmAnswer[str]) {
        if (index > -1) {
          this.dj.djtms[tmi].djtmAnswer[index] = str + "";
        } else {
          this.dj.djtms[tmi].djtmAnswer.push(str + "");
        }
      } else {
        if (index > -1) {
          this.dj.djtms[tmi].djtmAnswer.splice(index, 1);
        } 
      }
      console.log(this.djtmAnswer);
    },
    answerSub() {
      const loading = this.$loading();
      let answerCheck = [];
      this.dj.djtms.forEach(item => {
        if (item.answerRequired == "true") {
          if (item.djtmAnswer == "") {
            answerCheck.push(item);
          }
        }
      });
      if (answerCheck.length == 0) {
        this.sub(loading);
      } else {
        loading.close();
        this.$toast.error("问卷还没有填完哦");
      }
    },
    sub(loading) {
      console.log(this.dj);
      this.$axios
        .get("https://pv.sohu.com/cityjson?ie=utf-8")
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("成功提交");
            loading.close();
            this.$router.replace({ path: "/succ" });
          }
        })
        .catch(failResponse => {});
      this.$axios
        .put("/dj", this.dj)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("成功提交");
            loading.close();
            this.$router.replace({ path: "/succ" });
          }
        })
        .catch(failResponse => {});
      loading.close();
    }
  },
  created() {
    this.getData(this.wjId);
  }
};
</script>