<template>
  <div>
    <Header/>
    <div class="pageContent">
      <mu-container>
        <mu-paper class="paper" :z-depth="3">
          <h1 @click="titleClick" v-if="!titleChange">{{wj.wjTitle}}</h1>
          <mu-text-field
            v-model="titleValue"
            label-float
            label="请输入标题"
            full-width
            v-if="titleChange"
            @change="titlesubmit"
            @blur="titlesubmit"
            @keyup.enter="titlesubmit"
          ></mu-text-field>
          <p
            class="edits"
            v-if="!initiatorChange"
            @click="initiatorClick"
            style="text-align:right"
          >发布者：{{wj.wjInitiator}}</p>
          <mu-text-field
            v-model="initiatorValue"
            label-float
            label="请输入发布单位或发布人(不输入默认为当前用户账号)"
            full-width
            v-if="initiatorChange"
            @change="initiatorsubmit"
            @blur="initiatorsubmit"
            @keyup.enter="initiatorsubmit"
          ></mu-text-field>
          <h3 class="edits" @click="memoClick" v-if="!memoChange">{{wj.wjMemo}}</h3>
          <mu-text-field
            v-model="memoValue"
            label-float
            label="请输入副标题"
            full-width
            v-if="memoChange"
            @change="memosubmit"
            @blur="memosubmit"
            @keyup.enter="memosubmit"
          ></mu-text-field>
          <div class="content">
            <mu-form
              :model="question"
              class="mu-demo-form"
              label-position="top"
              v-for="(qs, index) in wj.wjtms"
              :key="index"
            >
              <div class="tmdiv" v-if="qs.wjtmType=='填空'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.wjtmTitle}}({{qs.wjtmType}})
                    <span
                      v-if="qs.wjtmRequired"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.wjtmMemo!=''">({{qs.wjtmMemo}})</p>
                  <mu-form-item prop="input">
                    <mu-text-field v-model="question.input" :rules="inputRules"></mu-text-field>
                  </mu-form-item>
                </div>
                <mu-container v-if="!qs.edit">
                  <mu-button flat color="red" @click="removeTm(index)" small>
                    <mu-icon value="delete_sweep"></mu-icon>删除
                  </mu-button>
                  <mu-button flat small @click="copy(index, qs)">
                    <mu-icon value="flip_to_front"></mu-icon>复制
                  </mu-button>
                  <mu-button flat small v-if="index !== 0" @click="goUp(index)">
                    <mu-icon value="keyboard_arrow_up"></mu-icon>上移
                  </mu-button>
                  <mu-button flat small v-if="index !== wj.wjtms.length - 1" @click="goDown(index)">
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.wjtmTitle" full-width>
                        是否必填
                        <mu-switch v-model="qs.wjtmRequired"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.wjtmMemo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.wjtmType=='文本'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.wjtmTitle}}({{qs.wjtmType}})
                    <span
                      v-if="qs.wjtmRequired"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.wjtmMemo!=''">({{qs.wjtmMemo}})</p>
                  <mu-form-item prop="textarea">
                    <mu-text-field
                      multi-line
                      :rows="3"
                      :rows-max="6"
                      v-model="question.textarea"
                      :rules="inputRules"
                    ></mu-text-field>
                  </mu-form-item>
                </div>
                <mu-container v-if="!qs.edit">
                  <mu-button flat color="red" @click="removeTm(index)" small>
                    <mu-icon value="delete_sweep"></mu-icon>删除
                  </mu-button>
                  <mu-button flat small @click="copy(index, qs)">
                    <mu-icon value="flip_to_front"></mu-icon>复制
                  </mu-button>
                  <mu-button flat small v-if="index !== 0" @click="goUp(index)">
                    <mu-icon value="keyboard_arrow_up"></mu-icon>上移
                  </mu-button>
                  <mu-button flat small v-if="index !== wj.wjtms.length - 1" @click="goDown(index)">
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.wjtmTitle" full-width>
                        是否必填
                        <mu-switch v-model="qs.wjtmRequired"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.wjtmMemo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.wjtmType=='单选'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.wjtmTitle}}({{qs.wjtmType}})
                    <span
                      v-if="qs.wjtmRequired"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.wjtmMemo!=''">({{qs.wjtmMemo}})</p>
                  <mu-form-item
                    prop="radio"
                    v-for="(xx, ti) in qs.tmxxs"
                    v-show="xx.tmxxTitle!='其他'"
                    :key="ti"
                  >
                    <mu-radio
                      v-model="question.radio"
                      :value="xx.tmxxTitle"
                      :label="xx.tmxxTitle"
                      :rules="inputRules"
                    ></mu-radio>
                  </mu-form-item>
                  <mu-form-item
                    prop="radio"
                    v-for="(xx, ti) in qs.tmxxs"
                    v-show="xx.tmxxTitle=='其他'"
                    :key="'tmxx'+ti"
                  >
                    <mu-radio
                      v-model="question.radio"
                      :value="xx.tmxxTitle"
                      :label="xx.tmxxTitle"
                      :rules="inputRules"
                    ></mu-radio>
                    <mu-text-field></mu-text-field>
                  </mu-form-item>
                </div>
                <mu-container v-if="!qs.edit">
                  <mu-button flat color="red" @click="removeTm(index)" small>
                    <mu-icon value="delete_sweep"></mu-icon>删除
                  </mu-button>
                  <mu-button flat small @click="copy(index, qs)">
                    <mu-icon value="flip_to_front"></mu-icon>复制
                  </mu-button>
                  <mu-button flat small v-if="index !== 0" @click="goUp(index)">
                    <mu-icon value="keyboard_arrow_up"></mu-icon>上移
                  </mu-button>
                  <mu-button flat small v-if="index !== wj.wjtms.length - 1" @click="goDown(index)">
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.wjtmTitle" full-width>
                        是否必填
                        <mu-switch v-model="qs.wjtmRequired"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.wjtmMemo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="radio" label="请输入选项">
                      <mu-text-field
                        v-for="(xx, ti) in qs.tmxxs"
                        :key="ti"
                        v-model="xx.tmxxTitle"
                        :value="xx.tmxxTitle"
                        :rules="inputRules"
                        full-width
                      >
                        <mu-button icon color="primary" @click="removeTmxx(index,ti,xx.tmxxId)">
                          <mu-icon value="clear"></mu-icon>
                        </mu-button>
                      </mu-text-field>
                      <mu-button color="primary" small @click="addTmxx(index,'')">添加选项</mu-button>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.wjtmType=='多选'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.wjtmTitle}}({{qs.wjtmType}})
                    <span
                      v-if="qs.wjtmRequired"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.wjtmMemo!=''">({{qs.wjtmMemo}})</p>
                  <mu-form-item prop="checkbox">
                    <mu-checkbox
                      v-for="(xx, ti) in qs.tmxxs"
                      :key="ti"
                      :label="xx.tmxxTitle"
                      :rules="inputRules"
                    ></mu-checkbox>
                  </mu-form-item>
                </div>
                <mu-container v-if="!qs.edit">
                  <mu-button flat color="red" @click="removeTm(index)" small>
                    <mu-icon value="delete_sweep"></mu-icon>删除
                  </mu-button>
                  <mu-button flat small @click="copy(index, qs)">
                    <mu-icon value="flip_to_front"></mu-icon>复制
                  </mu-button>
                  <mu-button flat small v-if="index !== 0" @click="goUp(index)">
                    <mu-icon value="keyboard_arrow_up"></mu-icon>上移
                  </mu-button>
                  <mu-button flat small v-if="index !== wj.wjtms.length - 1" @click="goDown(index)">
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.wjtmTitle" full-width>
                        是否必填
                        <mu-switch v-model="qs.wjtmRequired"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.wjtmMemo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="checkbox" label="请输入选项">
                      <mu-text-field
                        v-for="(xx, ti) in qs.tmxxs"
                        :key="ti"
                        v-model="xx.tmxxTitle"
                        :value="xx.tmxxTitle"
                        :rules="inputRules"
                        full-width
                      >
                        <mu-button icon color="primary" @click="removeTmxx(index,ti,xx.tmxxId)">
                          <mu-icon value="clear"></mu-icon>
                        </mu-button>
                      </mu-text-field>
                      <mu-button color="primary" small @click="addTmxx(index)">添加选项</mu-button>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>
            </mu-form>
          </div>
          <mu-form :model="question" v-show="tmType==1" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.wjtmTitle" full-width>
                是否必填
                <mu-switch v-model="question.wjtmRequired"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>

          <mu-form :model="question" v-show="tmType==2" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.wjtmTitle" full-width>
                是否必填
                <mu-switch v-model="question.wjtmRequired"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>

          <mu-form :model="question" v-show="tmType==3" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.wjtmTitle" full-width>
                是否必填
                <mu-switch v-model="question.wjtmRequired"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="radio" label="请输入选项">
              <mu-text-field
                v-for="(xx, ti) in question.tmxxs"
                :key="ti"
                v-model="xx.tmxxTitle"
                :value="xx.tmxxTitle"
                :rules="inputRules"
                full-width
              >
                <mu-button icon color="primary" @click="delTmxx(ti)">
                  <mu-icon value="clear"></mu-icon>
                </mu-button>
              </mu-text-field>
              <mu-button color="primary" small @click="newTmxx">添加选项</mu-button>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>

          <mu-form :model="question" v-show="tmType==4" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.wjtmTitle" full-width>
                是否必填
                <mu-switch v-model="question.wjtmRequired"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="checkbox" label="请输入选项">
              <mu-text-field
                v-for="(xx, ti) in question.tmxxs"
                :key="ti"
                v-model="xx.tmxxTitle"
                :value="xx.tmxxTitle"
                :rules="inputRules"
                full-width
              >
                <mu-button icon color="primary" @click="delTmxx(ti)">
                  <mu-icon value="clear"></mu-icon>
                </mu-button>
              </mu-text-field>
              <mu-button color="primary" small @click="newTmxx">添加选项</mu-button>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>
          <div class="add">
            <mu-button @click="showAdd = !showAdd" large color="primary">添加题目</mu-button>
            <mu-flex class="mu-transition-row">
              <mu-expand-transition>
                <div v-show="!showAdd" style="width:100%">
                  <mu-button large color="success" class="addbtn" @click="addTm(1)">填空题</mu-button>
                  <mu-button large color="success" class="addbtn" @click="addTm(2)">文本题</mu-button>
                  <mu-button large color="success" class="addbtn" @click="addTm(3)">单选题</mu-button>
                  <mu-button large color="success" class="addbtn" @click="addTm(4)">多选题</mu-button>
                </div>
              </mu-expand-transition>
            </mu-flex>
          </div>
        </mu-paper>
      </mu-container>
    </div>
    <Footer/>
  </div>
</template>
<style>
h1 {
  text-align: center;
}
h1:hover {
  background-color: darkgrey;
}
.edits:hover {
  background-color: darkgrey;
}
.pageContent {
  padding: 1rem 0;
  margin-bottom: 1rem;
}
.pageContent .paper {
  min-height: 50rem;
  padding: 0 5rem;
  margin: 0 auto;
  width: 80%;
}
.add {
  align-content: center;
  text-align: center;
  width: 100%;
}
.tm {
  align-content: center;
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
}
.tm div {
  width: 100%;
  min-height: 10rem;
}
.addbtn {
  margin: 1rem 1%;
}
.content .tmdiv {
  min-height: 5rem;
}
.content .tmdiv:hover {
  background-color: darkgrey;
}
</style>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { getUserInfo } from "../util/dataStorage.js";
import { when } from "q";
import { isNullOrUndefined } from "util";
export default {
  name: "edit1_wj",
  components: {
    Header,
    Footer,
isNullOrUndefined
  },
  data() {
    return {
      wjId: this.$route.params.wjId + "",
      wj: {},
      userinfo: {},
      qsItem: {},
      question: {
        wjId: this.$route.params.wjId + "",
        wjtmTitle: "默认标题",
        wjtmType: "",
        wjtmRequired: false,
        wjtmMemo: "",
        edit: false,
        tmxxs: [
          { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
          { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
        ]
      },

      inputRules: [{ validate: val => !!val, message: "此项必填" }],
      titleChange: false,
      titleValue: "",
      memoChange: false,
      memoValue: "",
      initiatorChange: false,
      initiatorValue: "",
      showAdd: true,
      tmType: 0
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
          if (statusCode === 200 && data.data.uid === this.userinfo.uid) {
            for (let index = 0; index < data.data.wjtms.length; index++) {
              data.data.wjtms[index].edit = false;
              if (data.data.wjtms[index].wjtmRequired == "true") {
                data.data.wjtms[index].wjtmRequired = true;
              } else {
                data.data.wjtms[index].wjtmRequired = false;
              }
            }
            this.wj = data.data;
            console.log(this.wj);
            loading.close();
          } else if (statusCode === 500) {
            this.$toast.error("问卷不存在");
            loading.close();
            this.$router.replace({ path: "/" });
          }else{
            this.$toast.error("问卷不存在");
            loading.close();
            this.$router.replace({ path: "/" });
          }
        })
        .catch(failResponse => {
          loading.close();
        });
    },
    titleClick() {
      this.titleChange = true;
    },
    titlesubmit() {
      this.titleValue = this.titleValue.trim();
      if (this.wj.wjTitle != this.titleValue) {
        this.wj.wjTitle =
          this.titleValue === "" ? this.wj.wjTitle : this.titleValue;
        this.$axios
          .patch("/wj/" + this.wjId, {
            wjId: this.wjId,
            wjTitle: this.wj.wjTitle
          })
          .then(successResponse => {
            let data = successResponse.data;
            if (data.meta.code === 200) {
              this.$toast.success("修改成功");
            }
          })
          .catch(failResponse => {
            this.$toast.error("服务器异常");
          });
      }
      this.titleChange = false;
    },
    memoClick() {
      this.memoChange = true;
    },
    memosubmit() {
      this.memoValue = this.memoValue.trim();
      if (this.wj.wjMemo != this.memoValue) {
        this.wj.wjMemo =
          this.memoValue === "" ? this.wj.wjMemo : this.memoValue;
        this.$axios
          .patch("/wj/" + this.wjId, {
            wjId: this.wjId,
            wjMemo: this.wj.wjMemo
          })
          .then(successResponse => {
            let data = successResponse.data;
            if (data.meta.code === 200) {
              this.$toast.success("修改成功");
            }
          })
          .catch(failResponse => {
            this.$toast.error("服务器异常");
          });
      }

      this.memoChange = false;
    },
    initiatorClick() {
      this.initiatorChange = true;
    },
    initiatorsubmit() {
      this.initiatorValue = this.initiatorValue.trim();
      if (this.wj.wjInitiator != this.initiatorValue) {
        this.wj.wjInitiator =
          this.initiatorValue === ""
            ? this.wj.wjInitiator
            : this.initiatorValue;
        this.$axios
          .patch("/wj/" + this.wjId, {
            wjId: this.wjId,
            wjInitiator: this.wj.wjInitiator
          })
          .then(successResponse => {
            let data = successResponse.data;
            if (data.meta.code === 200) {
              this.$toast.success("修改成功");
            }
          })
          .catch(failResponse => {
            this.$toast.error("服务器异常");
          });
      }

      this.initiatorChange = false;
    },
    addTm(tm) {
      this.showAdd = true;
      this.tmType = tm;
    },
    removeTm(index) {
      var wjtmId = this.wj.wjtms[index].wjtmId;
      this.$axios
        .delete("/wjtm/" + wjtmId)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("删除成功");
            this.wj.wjtms.splice(index, 1);
          } else {
            this.$toast.success("删除失败");
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    goUp(index) {
      let option = this.wj.wjtms[index];
      let tempOption = this.wj.wjtms[index - 1];
      this.$set(this.wj.wjtms, index - 1, option);
      this.$set(this.wj.wjtms, index, tempOption);
    },
    goDown(index) {
      let option = this.wj.wjtms[index];
      let tempOption = this.wj.wjtms[index + 1];
      this.$set(this.wj.wjtms, index + 1, option);
      this.$set(this.wj.wjtms, index, tempOption);
    },
    copy(index, qs) {
      qs = Object.assign({}, qs);
      var wjtm = this.wj.wjtms[index];
      wjtm.edit = null;
      if (wjtm.wjtmRequired) {
        wjtm.wjtmRequired = "true";
      } else {
        wjtm.wjtmRequired = "false";
      }
      this.$axios
        .put("/wjtm", wjtm)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("复制成功");

            this.wj.wjtms.splice(index, 0, qs);
this.getData(this.wjId);
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    subAddTm(tm) {
      var wjtm = {};
      if (tm == 1) {
        this.question.wjtmType = "填空";
        this.wj.wjtms.push(this.question);
        wjtm = this.question;
        this.question = {
          wjId: this.wjId,
          wjtmTitle: "默认标题",
          wjtmType: "",
          wjtmRequired: false,
          wjtmMemo: "",
          edit: false,
          tmxxs: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else if (tm == 2) {
        this.question.wjtmType = "文本";
        this.wj.wjtms.push(this.question);
        wjtm = this.question;
        this.question = {
          wjId: this.wjId,
          wjtmTitle: "默认标题",
          wjtmType: "",
          wjtmRequired: false,
          wjtmMemo: "",
          edit: false,
          tmxxs: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else if (tm == 3) {
        this.question.wjtmType = "单选";
        this.wj.wjtms.push(this.question);
        wjtm = this.question;
        this.question = {
          wjId: this.wjId,
          wjtmTitle: "默认标题",
          wjtmType: "",
          wjtmRequired: false,
          wjtmMemo: "",
          edit: false,
          tmxxs: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else {
        this.question.wjtmType = "多选";
        this.wj.wjtms.push(this.question);
        wjtm = this.question;
        this.question = {
          wjId: this.wjId,
          wjtmTitle: "默认标题",
          wjtmType: "",
          wjtmRequired: false,
          wjtmMemo: "",
          edit: false,
          tmxxs: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      }
      wjtm.edit = null;
      if (wjtm.wjtmRequired) {
        wjtm.wjtmRequired = "true";
      } else {
        wjtm.wjtmRequired = "false";
      }
      this.$axios
        .put("/wjtm", wjtm)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("修改成功");
this.getData(this.wjId);
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    editTm(index) {
      this.$set(this.wj.wjtms[index], "edit", true);
    },
    addTmxx(index, title) {
      if (title == "") {
        this.wj.wjtms[index].tmxxs.push({ tmxxTitle: "新选项" });
      } else {
        let data = this.wj.wjtms[index].tmxxs.filter(function(item) {
          return item.tmxxTitle == title;
        });
        if (data.length == 0) {
          this.wj.wjtms[index].tmxxs.push({ tmxxTitle: title });
        }
      }
    },
    newTmxx() {
      this.question.tmxxs.push({ tmxxTitle: "新选项" });
    },
    removeTmxx(index, xx,id) {
      if(!isNullOrUndefined(id)){
	this.$axios
        .delete("/wjtm/tmxx/" + id)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.wj.wjtms[index].tmxxs.splice(xx, 1);
          } 
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
	}else{
	this.wj.wjtms[index].tmxxs.splice(xx, 1);
	}
	
    },
    delTmxx(xx) {
      this.question.tmxxs.splice(xx, 1);
    },
    subEdit(index) {
      this.wj.wjtms[index].wjtmTitle = this.wj.wjtms[index].wjtmTitle.trim();
      if (this.wj.wjtms[index].wjtmTitle == "") {
        this.wj.wjtms[index].edit = true;
      } else {
        var wjtm = this.wj.wjtms[index];
        var tmxxs = wjtm.tmxxs;
        wjtm.wj = null;
        wjtm.edit = null;
        if (wjtm.wjtmRequired) {
          wjtm.wjtmRequired = "true";
        } else {
          wjtm.wjtmRequired = "false";
        }
        console.log(wjtm);
        this.$axios
          .patch("/wjtm/" + wjtm.wjtmId, wjtm)
          .then(successResponse => {
            let data = successResponse.data;
            if (data.meta.code === 200) {
              this.$toast.success("修改成功");
              this.getData(this.wjId);
            }
          })
          .catch(failResponse => {
            this.$toast.error("服务器异常");
          });

        // this.wj.wjtms[index].edit = false;
      }
    }
  },
  created() {
    this.userinfo = getUserInfo();
    this.getData(this.wjId);
  }
};
</script>