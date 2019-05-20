<template>
  <div class="page_body">
    <mu-container>
      <div class="page_contents">
        <img src="../assets/img/succ.png">
        <div class="content_title">问卷到此结束,感谢您的参与</div>
         
      </div>
    </mu-container>
    <Footer/>
  </div>
</template>
<style>
html,
body {
  background-color: rgb(236, 227, 227);
}
.page_body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.page_contents {
  text-align: center;
}
img {
    width: 70%;
    margin: 0 auto;
}
.content_title {
  text-align: center;
  font-size: 2.5rem;
}
</style>

<script>
import Footer from "@/components/Footer.vue";
export default {
  name: "dj_succ",
  components: {
    Footer
  }
};
</script>

