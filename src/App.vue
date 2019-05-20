<template>
  <div>
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<style>
.pageContent {
  min-height: 50rem;
}
</style>
<script>
export default {
  components: {},
  methods: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  },
  mounted() {
    if (this._isMobile()) {
      alert("手机端");
    } else {
      console.log("PC端");
    }
  }
};
</script>
