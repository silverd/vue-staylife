<template>
  <div class="preloader-cover" v-show="show">
    <div class="preloader-box">
      <div class="preloader-icon">
        <rotate-loader :loading="loading" color="#666"></rotate-loader>
      </div>
      <div class="preloader-text">{{text}}</div>
    </div>
  </div>
</template>

<script>

export default {

  components: {
    'rotate-loader': require('vue-spinner/src/RotateLoader.vue')
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '正在加载 ...'
    }
  }

}

</script>

<style scoped>
.preloader-cover {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 4;
  color: #666;
  /*background-color: #F8F8F8;*/
}
.preloader-box {
  margin: auto;
  position: relative;
}
.preloader-icon {
  position: absolute;
  margin-top: -50px;
  margin-left: 32px;
}
.preloader-text {
  margin-top: 0px;
}
</style>