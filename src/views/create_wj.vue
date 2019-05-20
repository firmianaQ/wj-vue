<template>
  <div>
    <Header/>
    <div class="pageContent">
      <mu-flex class="flex-wrapper" align-items="center">
        <mu-flex class="flex-demo" justify-content="center" fill>
          <mu-paper class="wj_paper" :z-depth="3">
            <div class="wj_paper_div" style="background-color: aquamarine">
              <div style="margin: 0 auto;">
                <img src="../assets/img/type1.png" alt>
                <div style="margin: -10% auto;">
                  <h2>创建一个调查</h2>
                  <mu-button @click="toType(1)">开始</mu-button>
                </div>
              </div>
            </div>
          </mu-paper>
        </mu-flex>
        <mu-flex class="flex-demo" justify-content="center" fill>
          <mu-paper class="wj_paper" :z-depth="3">
            <div class="wj_paper_div" style="background-color: lightcyan">
              <div style="margin: 0 auto;">
                <img src="../assets/img/type2.png" alt>
                <div style="margin: -10% auto;">
                  <h2>创建一套试卷</h2>
                  <mu-button @click="toType(2)">开始</mu-button>
                </div>
              </div>
            </div>
          </mu-paper>
        </mu-flex>
        <mu-flex class="flex-demo" justify-content="center" fill>
          <mu-paper class="wj_paper" :z-depth="3">
            <div class="wj_paper_div" style="background-color: cornflowerblue">
              <div style="margin: 0 auto;">
                <img src="../assets/img/type3.png">
                <div style="margin: -10% auto;">
                  <h2>创建一次投票</h2>
                  <mu-button @click="toType(3)">开始</mu-button>
                </div>
              </div>
            </div>
          </mu-paper>
        </mu-flex>
      </mu-flex>
    </div>
    <Footer/>
  </div>
</template>
<style>
.pageContent {
  min-height: 50rem;
}
.wj_paper {
  width: 100%;
  height: 30rem;
}
.wj_paper .wj_paper_div {
  width: 100%;
  height: 30rem;
}
.wj_paper .wj_paper_div div {
  text-align: center;
}
.wj_paper .wj_paper_div img {
  width: 50%;
}
.wj_paper .wj_paper_div h2 {
  color: #9ca0a1;
}
</style>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "create_wj",
  components: {
    Header,
    Footer
  },
  methods: {
    toType(type) {
      const loading = this.$loading();
      this.$router.replace({ path: "/type" + type });
      loading.close();
    }
  }
};
</script>
