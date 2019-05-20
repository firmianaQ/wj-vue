<template>
  <div>
    <Header/>
    <div class="pageContent">
      <mu-container>
        <mu-paper class="paper" :z-depth="3">
          <h1 @click="titleClick" v-if="!titleChange">{{qsItem.wjTitle}}</h1>
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
          >发布者：{{qsItem.wjInitiator}}</p>
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
          <h3 class="edits" @click="memoClick" v-if="!memoChange">{{qsItem.wjMemo}}</h3>
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
              v-for="(qs, index) in qsItem.question"
              :key="index"
            >
              <div class="tmdiv" v-if="qs.type=='填空'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.title}}({{qs.type}})
                    <span
                      v-if="qs.required"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.memo!=''">({{qs.memo}})</p>
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
                  <mu-button
                    flat
                    small
                    v-if="index !== qsItem.question.length - 1"
                    @click="goDown(index)"
                  >
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.title" full-width>
                        是否必填
                        <mu-switch v-model="qs.required"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.memo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.type=='文本'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.title}}({{qs.type}})
                    <span
                      v-if="qs.required"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.memo!=''">({{qs.memo}})</p>
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
                  <mu-button
                    flat
                    small
                    v-if="index !== qsItem.question.length - 1"
                    @click="goDown(index)"
                  >
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.title" full-width>
                        是否必填
                        <mu-switch v-model="qs.required"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.memo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.type=='单选'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.title}}({{qs.type}})
                    <span
                      v-if="qs.required"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.memo!=''">({{qs.memo}})</p>
                  <mu-form-item
                    prop="radio"
                    v-for="(xx, ti) in qs.tmxx"
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
                    v-for="(xx, ti) in qs.tmxx"
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
                  <mu-button
                    flat
                    small
                    v-if="index !== qsItem.question.length - 1"
                    @click="goDown(index)"
                  >
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.title" full-width>
                        是否必填
                        <mu-switch v-model="qs.required"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.memo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="radio" label="请输入选项">
                      <mu-text-field
                        v-for="(xx, ti) in qs.tmxx"
                        :key="ti"
                        v-model="xx.tmxxTitle"
                        :value="xx.tmxxTitle"
                        :rules="inputRules"
                        full-width
                      >
                        <mu-button icon color="primary" @click="removeTmxx(index,ti)">
                          <mu-icon value="clear"></mu-icon>
                        </mu-button>
                      </mu-text-field>
                      <mu-button color="primary" small @click="addTmxx(index,'')">添加选项</mu-button>
                      <mu-button color="primary" small @click="addTmxx(index,'其他')">添加其他项</mu-button>
                    </mu-form-item>
                    <mu-form-item>
                      <mu-button color="primary" @click="subEdit(index)">提交</mu-button>
                    </mu-form-item>
                  </mu-form>
                </div>
              </div>

              <div class="tmdiv" v-if="qs.type=='多选'">
                <div v-if="!qs.edit" @click="editTm(index)">
                  <h3>
                    {{index +1}}.{{qs.title}}({{qs.type}})
                    <span
                      v-if="qs.required"
                      style="color:red"
                    >*</span>
                  </h3>
                  <p v-if="qs.memo!=''">({{qs.memo}})</p>
                  <mu-form-item prop="checkbox">
                    <mu-checkbox
                      v-for="(xx, ti) in qs.tmxx"
                      :key="ti"
                      v-model="xx.tmxxTitle"
                      :value="xx.tmxxTitle"
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
                  <mu-button
                    flat
                    small
                    v-if="index !== qsItem.question.length - 1"
                    @click="goDown(index)"
                  >
                    <mu-icon value="keyboard_arrow_down"></mu-icon>下移
                  </mu-button>
                </mu-container>
                <div v-if="qs.edit">
                  <mu-form :model="qs" class="mu-demo-form" label-position="left">
                    <mu-form-item prop="input" label="请输入标题">
                      <mu-text-field v-model="qs.title" full-width>
                        是否必填
                        <mu-switch v-model="qs.required"></mu-switch>
                      </mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="input" label="请输入备注">
                      <mu-text-field v-model="qs.memo" full-width></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="checkbox" label="请输入选项">
                      <mu-text-field
                        v-for="(xx, ti) in qs.tmxx"
                        :key="ti"
                        v-model="xx.tmxxTitle"
                        :value="xx.tmxxTitle"
                        :rules="inputRules"
                        full-width
                      >
                        <mu-button icon color="primary" @click="removeTmxx(index,ti)">
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
              <mu-text-field v-model="question.title" full-width>
                是否必填
                <mu-switch v-model="question.required"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>

          <mu-form :model="question" v-show="tmType==2" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.title" full-width>
                是否必填
                <mu-switch v-model="question.required"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item>
              <mu-button color="primary" @click="subAddTm(tmType)">提交</mu-button>
            </mu-form-item>
          </mu-form>

          <mu-form :model="question" v-show="tmType==3" label-position="left">
            <mu-form-item prop="input" label="请输入标题">
              <mu-text-field v-model="question.title" full-width>
                是否必填
                <mu-switch v-model="question.required"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="radio" label="请输入选项">
              <mu-text-field
                v-for="(xx, ti) in question.tmxx"
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
              <mu-text-field v-model="question.title" full-width>
                是否必填
                <mu-switch v-model="question.required"></mu-switch>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="checkbox" label="请输入选项">
              <mu-text-field
                v-for="(xx, ti) in question.tmxx"
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
            <mu-button @click="showAdd = !showAdd" large color="primary">添加题目</mu-button>&nbsp;
            <mu-button large color="indigo400" @click="save">保存问卷</mu-button>
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
.edits:hover{
  background-color: darkgrey;
}
.pageContent {
  min-height: 50rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
}
.pageContent .paper {
  min-height: 50rem;
  padding: 0 5rem;
  width: 80%;
  margin: 0 auto;
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
  name: "type1_wj",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      userinfo: {},
      qsItem: {},
      question: {
        title: "默认标题",
        type: "",
        required: false,
        memo: "",
        edit: false,
        tmxx: [
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
    fetchData() {
      let item = {};
      item.wjType = "问卷调查";
      item.wjTitle = "这里是标题";
      item.wjMemo =
        "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！";
      item.user = this.userinfo;
      item.wjInitiator = this.userinfo.ucode;
      item.wjState = "停止回收";
      item.question = [
        {
          title: "测试题目1",
          memo: "",
          type: "填空",
          required: false,
          edit: false,
          score: 0
        },
        {
          title: "测试题目2",
          memo: "",
          type: "单选",
          required: true,
          score: 0,
          edit: false,
          tmxx: [
            { tmxxTitle: "选项一", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项二", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        }
      ];
      item.checked = false;
      this.qsItem = item;
    },
    titleClick() {
      this.titleChange = true;
    },
    titlesubmit() {
      this.titleValue = this.titleValue.trim();
      this.qsItem.wjTitle =
        this.titleValue === "" ? this.qsItem.wjTitle : this.titleValue;
      this.titleChange = false;
    },
    memoClick() {
      this.memoChange = true;
    },
    memosubmit() {
      this.memoValue = this.memoValue.trim();
      this.qsItem.wjMemo =
        this.memoValue === "" ? this.qsItem.wjMemo : this.memoValue;
      this.memoChange = false;
    },
    initiatorClick() {
      this.initiatorChange = true;
    },
    initiatorsubmit() {
      this.initiatorValue = this.initiatorValue.trim();
      this.qsItem.wjInitiator =
        this.initiatorValue === ""
          ? this.qsItem.wjInitiator
          : this.initiatorValue;
      this.initiatorChange = false;
    },
    addTm(tm) {
      this.showAdd = true;
      this.tmType = tm;
    },
    removeTm(index) {
      this.qsItem.question.splice(index, 1);
    },
    goUp(index) {
      let option = this.qsItem.question[index];
      let tempOption = this.qsItem.question[index - 1];
      this.$set(this.qsItem.question, index - 1, option);
      this.$set(this.qsItem.question, index, tempOption);
    },
    goDown(index) {
      let option = this.qsItem.question[index];
      let tempOption = this.qsItem.question[index + 1];
      this.$set(this.qsItem.question, index + 1, option);
      this.$set(this.qsItem.question, index, tempOption);
    },
    copy(index, qs) {
      qs = Object.assign({}, qs);
      this.qsItem.question.splice(index, 0, qs);
    },
    subAddTm(tm) {
      if (tm == 1) {
        this.question.type = "填空";
        this.qsItem.question.push(this.question);
        this.question = {
          title: "默认题目",
          memo: "",
          required: false,
          edit: false,
          score: 0,
          tmxx: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else if (tm == 2) {
        this.question.type = "文本";
        this.qsItem.question.push(this.question);
        this.question = {
          title: "默认题目",
          memo: "",
          required: false,
          edit: false,
          score: 0,
          tmxx: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else if (tm == 3) {
        this.question.type = "单选";
        this.qsItem.question.push(this.question);
        this.question = {
          title: "默认题目",
          memo: "",
          required: false,
          edit: false,
          score: 0,
          tmxx: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      } else {
        this.question.type = "多选";
        this.qsItem.question.push(this.question);
        this.question = {
          title: "默认题目",
          memo: "",
          required: false,
          edit: false,
          score: 0,
          tmxx: [
            { tmxxTitle: "选项1", tmxxSortkey: null, tmxxIscorrectchoice: "" },
            { tmxxTitle: "选项2", tmxxSortkey: null, tmxxIscorrectchoice: "" }
          ]
        };
        this.tmType = 0;
      }
    },
    editTm(index) {
      this.qsItem.question[index].edit = true;
    },
    addTmxx(index, title) {
      if (title == "") {
        this.qsItem.question[index].tmxx.push({ tmxxTitle: "新选项" });
      } else {
        let data = this.qsItem.question[index].tmxx.filter(function(item) {
          return item.tmxxTitle == title;
        });
        if (data.length == 0) {
          this.qsItem.question[index].tmxx.push({ tmxxTitle: title });
        }
      }
    },
    newTmxx() {
      this.question.tmxx.push({ tmxxTitle: "新选项" });
    },
    removeTmxx(index, xx) {
      this.qsItem.question[index].tmxx.splice(xx, 1);
    },
    delTmxx(xx) {
      this.question.tmxx.splice(xx, 1);
    },
    subEdit(index) {
      this.qsItem.question[index].title = this.qsItem.question[
        index
      ].title.trim();
      if (this.qsItem.question[index].title == "") {
        this.qsItem.question[index].edit = true;
      } else {
        this.qsItem.question[index].edit = false;
      }
    },
    save() {
      const loading = this.$loading();
      this.$axios
        .put("/wj", this.qsItem)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("成功保存");
            loading.close();
            this.$router.replace({ path: "/list" });
          }
        })
        .catch(failResponse => {});
    }
  },
  mounted(){

  },
  created() {
    this.userinfo = getUserInfo();
    this.fetchData();
  }
};
</script>