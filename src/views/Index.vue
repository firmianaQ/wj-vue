<template>
  <div>
    <Header/>
    <div class="page_content">
      <img src="../assets/img/succ.png">
      <div class="content_title">
        <div>欢迎使用怪兽问卷</div>
        <div>
          <mu-button large color="red" @click="toCreateWj">立即开始</mu-button>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<style>
.page_content {
  min-height: 50rem;
  width: 100%;
  text-align: center;
}
.page_content img {
  margin-top: -5%;
}
.content_title {
  font-size: 2.5rem;
  margin-top: -5%;
}
</style>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "index",
  components: {
    Header,
    Footer
  },
  data() {
    return {};
  },
  methods: {
    toCreateWj(){
      const loading = this.$loading();
      this.$router.replace({ path: "/create" });
      loading.close();
    }
  },
  mounted() {}
};
</script>
