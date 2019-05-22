<template>
  <div class="page" id="printMe">
    <Header/>
    <div class="pageContent">
      <mu-paper class="demo-paper" :z-depth="3">
        <mu-container>
          <div class="wj_header">
            <span class="wj_title">{{wj.wjTitle}}</span>
            <span class="wj_recycle">(id:{{wj.wjId}} 回收数量:{{recycle}})</span>
          
              <mu-button large flat @click="downloadWord"  v-if="wordLoading">
                <mu-icon size="30" value="screen_share" ></mu-icon>导出数据
              </mu-button>
            <mu-button large flat @click="downloadWord"  v-if="!wordLoading">
                <mu-circular-progress></mu-circular-progress>正在导出
              </mu-button>
          </div>
          <div v-for="(qs, index) in wj.wjtms" :key="index">
            <div>
              <span class="wj_tmTitle">{{index+1}}.{{qs.wjtmTitle}}</span>
              <div v-if="qs.wjtmType=='单选'" class="wj_tmContent">
                <mu-data-table
                  max-height="200"
                  :columns="columns"
                  :data="qs.stat_info.total.optios"
                >
                  <template slot-scope="scope">
                    <td class="is-center">{{scope.row.name}}</td>
                    <td class="is-center">{{scope.row.value}}</td>
                    <td
                      class="is-center"
                    >{{Math.round(scope.row.value/qs.stat_info.total.answer_total * 10000) / 100.00 }}</td>
                  </template>
                </mu-data-table>
                <div class="wj_charts">
                  <MyEcharts
                    :id="'exampleId'+qs.wjtmId"
                    :style="{width: '100%', height: '300%'}"
                    :option="chartOption.filter(function(item){ return item.chartId == qs.wjtmId })[0].option"
                  ></MyEcharts>
                </div>
              </div>
              <div v-else-if="qs.wjtmType=='多选'">
                <mu-data-table
                  max-height="300"
                  :columns="columns"
                  :data="qs.stat_info.total.optios"
                >
                  <template slot-scope="scope">
                    <td class="is-center">{{scope.row.name}}</td>
                    <td class="is-center">{{scope.row.value}}</td>
                    <td
                      class="is-center"
                    >{{Math.round(scope.row.value/qs.stat_info.total.answer_total * 10000) / 100.00 }}</td>
                  </template>
                </mu-data-table>
                <div class="wj_charts">
                  <MyEcharts
                    :id="'exampleId'+qs.wjtmId"
                    :style="{width: '100%', height: '380px'}"
                    :option="chartOption.filter(function(item){ return item.chartId == qs.wjtmId })[0].option"
                  ></MyEcharts>
                </div>
              </div>
              <div v-else>
                <mu-data-table
                  max-height="300"
                  :columns="columns2"
                  :data="qs.stat_info.total.texts"
                >
                  <template slot-scope="scope">
                    <td class="is-center">{{scope.$index+1}}</td>
                    <td class="is-center">{{scope.row}}</td>
                  </template>
                </mu-data-table>
              </div>
            </div>
          </div>
        </mu-container>
      </mu-paper>
    </div>

    <Footer/>
  </div>
</template>
<style>
.page {
  width: 100%;
  height: 100%;
}
.demo-paper {
  width: 70%;
  margin: 1% auto;
  padding: 1%;
}
.pageContent {
  min-height: 50rem;
  width: 80%;
  margin: 0 auto;
}
.wj_header {
  height: 4rem;
}
.wj_title {
  font-size: 2rem;
  font-weight: 500;
}
.wj_recycle {
  font-size: 1rem;
  color: darkgrey;
}
.wj_tmTitle {
  font-size: 1rem;
  line-height: 2rem;
}
.wj_tmContent {
  margin-bottom: 1%;
}
.wj_charts {
  margin: 1rem 0;
}
</style>

<script>
import MyEcharts from "@/components/Echarts/index"; //echarts
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "analysis",
  components: {
    MyEcharts,
    Header,
    Footer
  },
  data() {
    return {
      wordLoading:true,
      datas: {},
      wjId: this.$route.params.wjId + "",
      chartOption: [],
      echartsXYcolor: "#fff000",
      lineColor: "#5bb1f0",
      tmxxs: [],
      wj: {},
      recycle: 0,
      sort: {
        name: "",
        order: "asc"
      },
      columns: [
        { title: "选项", align: "center", name: "name" },
        {
          title: "小计",
          name: "value",
          align: "center"
        },
        {
          title: "百分比(%)",
          name: "to",
          align: "center"
        }
      ],
      columns2: [
        { title: "编号", align: "center", name: "name" },
        {
          title: "文本答案",
          name: "value",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.getData(this.wjId);
  },
  methods: {
    downloadWord() {
      this.wordLoading = !this.wordLoading;
      this.$axios({
        method: "get",
        url: "/analysis/word/" + this.wjId, // 请求地址
        responseType: "blob"
      })
        .then(res => {
          //定义文件名等相关信息
          const blob = res.data;
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.wj.wjTitle + "-数据分析.doc");
          document.body.appendChild(link);
          link.click();
          this.$toast.success("下载成功");
          this.wordLoading = !this.wordLoading;
        })
        .catch(failResponse => {
          alert("出现错误");
        });
    },
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[name] - b[name] : b[name] - a[name]
      );
    },
    getOption(wjtmId) {
      return Object.getOwnPropertyDescriptor(this.chartOption, wjtmId).value
        .optios;
    },
    getData(wjId) {
      const loading = this.$loading();
      this.$axios
        .get("/chart/" + wjId)
        .then(successResponse => {
          let data = successResponse.data;
          let statusCode = data.meta.code;
          if (statusCode == 200) {
            this.datas = data.data;
            this.wj = data.data.wj;
            this.recycle = data.data.recycle;
            this.wj.wjtms.forEach(element => {
              if (element.wjtmType != "填空" && element.wjtmType != "文本") {
                var item = [];
                var chartId = element.wjtmId;
                var option = element.stat_info.total.optios;
                option.forEach(e => {
                  item.push({ name: e.name, value: e.value });
                });
                if (element.wjtmType == "单选") {
                  this.pieCharts("" + chartId, item);
                }
                if (element.wjtmType == "多选") {
                  this.barCharts("" + chartId, item);
                }
              }
            });
            loading.close();
          } else {
            loading.close();
            this.$toast.error("问卷没有找到");
            this.$router.replace({ path: "/list" });
          }
        })
        .catch(failResponse => {
          loading.close();
        });
    },
    pieCharts(chartId, data) {
      var option = {
        title: {
          text: "选项数据对比",
          subtext: "数据来源@怪兽问卷",
          sublink: "http://www.irua.cn"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: true },
            magicType: { type: [] },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: data.map(function(item) {
            return item.name;
          })
        },
        series: [
          {
            name: "选项数据",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: data.map(function(item) {
              return item;
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.chartOption.push({ chartId, option });
      console.log(this.chartOption);
    },
    barCharts(chartId, data) {
      var option = {
        title: {
          text: "选项数据对比",
          subtext: "数据来源@怪兽问卷",
          sublink: "http://www.irua.cn"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: true },
            magicType: { type: ["pie"] },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: data.map(function(item) {
            return item.name;
          })
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 5]
        },
        yAxis: {
          type: "category",
          data: ["选项数据对比"]
        },
        series: data.map(function(item) {
          var series = {
            name: item.name,
            type: "bar",
            data: [item.value]
          };
          return series;
        })
      };
      this.chartOption.push({ chartId, option });
      console.log(this.chartOption);
    }
  }
};
</script>


