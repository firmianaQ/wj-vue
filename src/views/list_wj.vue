<template>
  <div>
    <Header/>
    <div class="pageContent">
      <mu-paper :z-depth="1" class="paper">
        <mu-container>
          <mu-data-table
            selectable
            select-all
            :selects.sync="selects"
            checkbox
            :columns="columns"
            :sort.sync="sort"
            @sort-change="handleSortChange"
            :data="list"
          >
            <template slot="expand" slot-scope="prop">
              <div style="padding: 24px;">
                <div>标题： {{prop.row.wjTitle}}</div>
                <div v-if="prop.row.wjMemo!=''">介绍： {{prop.row.wjMemo}}</div>
                <div>状态： {{prop.row.wjState}}</div>
                <div
                  v-if="prop.row.wjState!='待投放'"
                >时间： {{prop.row.wjTime1}}&nbsp;至&nbsp;{{prop.row.wjTime2}}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <td class="is-center tds">
                {{scope.row.wjTitle}}
                <br>
                ({{scope.row.wjId}})
              </td>
              <td class="is-center tds">{{scope.row.wjType}}</td>
              <td class="is-center tds">
                <mu-chip v-if="scope.row.wjState=='正在回收'">
                  <mu-avatar :size="32">
                    <mu-circular-progress></mu-circular-progress>
                  </mu-avatar>
                  {{scope.row.wjState}}
                </mu-chip>

                <mu-chip v-else>
                  <mu-avatar :size="32">
                    <mu-icon value="play_arrow" color="red"></mu-icon>
                  </mu-avatar>
                  {{scope.row.wjState}}
                </mu-chip>
              </td>
              <td class="is-center tds">
                <mu-menu placement="top-start" open-on-hover>
                  <mu-button icon>
                    <mu-icon value="more_vert"></mu-icon>
                  </mu-button>
                  <mu-list slot="content">
                    <mu-list-item
                      button
                      v-if="scope.row.wjState=='停止回收'"
                      @click="startRecyle(scope.row.wjId)"
                    >
                      <mu-icon value="play_arrow" color="green"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>开始回收</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button v-else @click="pauseRecyle(scope.row.wjId)">
                      <mu-icon value="pause" color="red"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>停止回收</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button @click="oQrcode(scope.row.wjId)">
                      <mu-icon value="send" color="orange"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>投放问卷</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button @click="editWj(scope.row.wjId)">
                      <mu-icon value="filter_none" color="pink300"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>修改</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button @click="analysis(scope.row.wjId)">
                      <mu-icon value="filter_none" color="pink300"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>分析</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button @click="copyWj(scope.row.wjId)">
                      <mu-icon value="filter_none" color="pink300"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>复制</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                    <mu-list-item button @click="delWj(scope.row.wjId)">
                      <mu-icon value="delete" color="red"></mu-icon>
                      <mu-list-item-content>
                        <mu-list-item-title>删除</mu-list-item-title>
                      </mu-list-item-content>
                    </mu-list-item>
                  </mu-list>
                </mu-menu>
              </td>
            </template>
          </mu-data-table>
          <mu-dialog
            max-width="80%"
            :esc-press-close="true"
            :overlay-close="true"
            :open.sync="openQrcode"
            title="问卷链接"
          >
            <div class="qrcodeDialog">
              <mu-text-field :value="initQCode">
                <mu-button
                  flat
                  small
                  color="secondary"
                  v-clipboard:copy="initQCode"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</mu-button>
                <mu-button flat small color="secondary" @click="toDj(initQCode)">打开</mu-button>
              </mu-text-field>

              <qriously ref="qr" :value="initQCode" :size="138"/>
              <mu-button flat color="secondary" @click="saveQrcode">
                <mu-icon value="get_app"></mu-icon>保存二维码
              </mu-button>
            </div>
          </mu-dialog>
          <mu-flex justify-content="center">
            <mu-pagination :total="total" :current.sync="current"></mu-pagination>
          </mu-flex>
          <mu-flex align-items="center" style="padding: 8px;" wrap="wrap">
            selects:
            <mu-chip
              delete
              v-for="selectIndex in selects"
              @delete="removeSelect(selectIndex)"
              style="margin: 8px;"
              color="green"
              :key="selectIndex"
            >编号{{list[selectIndex].wjId}}</mu-chip>
          </mu-flex>
        </mu-container>
      </mu-paper>
    </div>
    <Footer/>
  </div>
</template>

<style>
.pageContent {
  min-height: 50rem;
}
.pageContent .paper {
  width: 100%;
  min-height: 40rem;
  margin: 0 auto;
}
.tds {
  height: 1rem;
}
.qrcodeDialog {
  text-align: center;
}
</style>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { getUserInfo } from "../util/dataStorage.js";
import store from "../store.js";
export default {
  name: "list_wj",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      userinfo: {},
      current: 1,
      total: 100,
      selects: [],
      openQrcode: false,
      initQCode: "",
      sort: {
        name: "",
        order: "asc"
      },
      columns: [
        {
          title: "标题",
          name: "wjTitle",
          align: "center"
        },
        {
          title: "类型",
          name: "wjType",
          align: "center"
        },

        {
          title: "状态",
          name: "wjState",
          align: "center"
        },
        {
          title: "操作",
          name: "wjState",
          align: "center"
        }
      ],
      list: []
    };
  },
  methods: {
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[name] - b[name] : b[name] - a[name]
      );
    },
    removeSelect(selectIndex) {
      const index = this.selects.indexOf(selectIndex);
      this.selects.splice(index, 1);
    },
    getWjList() {
      this.$axios
        .get("/data/wjs/" + this.current + "/" + this.userinfo.uid)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.list = data.data.records;
            this.total = data.data.total;
          }
        })
        .catch(failResponse => {});
    },
    oQrcode(wjId) {
      let wj = wjId + "";
      this.initQCode = store.state._djUrl + "dj/" + wj;
      console.log("答卷地址:" + this.initQCode);
      this.openQrcode = true;
    },
    cQrcode() {
      this.openQrcode = false;
    },
    editWj(wjId) {
      const loading = this.$loading();
      this.$router.replace({ path: "/edit/" + wjId });
      loading.close();
    },
    analysis(wjId){
      this.$router.replace({ path: "/analysis/" + wjId });
    },
    copyWj(wjId) {
      let wjid = parseInt(wjId);
      this.$axios
        .put("/wj/" + wjid)
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("复制成功");
            this.getWjList();
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    delWj(wjId) {
      let wjid = parseInt(wjId);
      this.$confirm("删除问卷，收集的数据也会一起删除", "确定要删除？", {
        type: "warning"
      }).then(({ result }) => {
        if (result) {
          this.$axios
            .delete("/wj/" + wjid)
            .then(successResponse => {
              let data = successResponse.data;
              if (data.meta.code === 200) {
                this.$toast.success("删除成功");
                this.getWjList();
              }
            })
            .catch(failResponse => {
              this.$toast.error("服务器异常");
            });
        }
      });
    },
    // 复制成功
    onCopy(e) {
      alert("成功复制到剪贴板");
    },
    // 复制失败
    onError(e) {
      alert("复制失败");
      console.log(e);
    },
    toDj(url) {
      this.$nextTick(() => {
        window.open(url);
      });
    },
    saveQrcode() {
      //新Image对象，可以理解为DOM
      let qrcode = this.$refs["qr"].$el.firstChild.toDataURL("image/png");
      this.$nextTick(() => {});
      // canvas.toDataURL 返回的是一串Base64编码的URL

      let a = document.createElement("a");
      a.href = qrcode.replace("image/png", "image/octet-stream");
      a.download = "二维码.png";
      a.click();
      this.$toast.warning("正在保存");
    },
    startRecyle(wjid) {
      this.$axios
        .patch("/wj/" + wjid, { wjId: wjid, wjState: "正在回收" })
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("问卷开始回收数据");
            this.getWjList();
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    },
    pauseRecyle(wjid) {
      this.$axios
        .patch("/wj/" + wjid, { wjId: wjid, wjState: "停止回收" })
        .then(successResponse => {
          let data = successResponse.data;
          if (data.meta.code === 200) {
            this.$toast.success("问卷停止回收数据");
            this.getWjList();
          }
        })
        .catch(failResponse => {
          this.$toast.error("服务器异常");
        });
    }
  },
  mounted() {},
  created() {
    this.userinfo = getUserInfo();
    this.getWjList();
  }
};
</script>