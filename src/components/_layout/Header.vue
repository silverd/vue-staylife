<template>

  <template v-if="$root.showHeader">
    <header>
      <x-header :left-options="leftOptions" style="background-color:#000;">
        StayLife - {{navTitle}}
      </x-header>
    </header>
    <div style="height: 46px"></div>
  </template>

</template>

<script>

export default {

  props: [
    'navTitle'
  ],

  components: {
    'x-header': require('weui-components/x-header')
  },

  data () {
    return {
      leftOptions: {
        backText: '返回',
        showBack: true
      }
    }
  },

  watch: {

    // 同步更新浏览器的网页标题
    navTitle (newVal, oldVal) {

      document.title = newVal;

      // 黑科技（iOS微信浏览器专用）
      // 原因：微信浏览器的title在页面加载完成后就定了，不再监听 window.title 的 onchange 事件。
      // 所以这里修改了title后，立即创建一个请求，加载一个空的iframe
      if (this.$root.isWeixin && this.$root.isApple) {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('src', '/favicon.ico');
        iframe.setAttribute('style', 'display: none; width:0; height:0;');
        let handler = () => {
          setTimeout(() => {
            iframe.removeEventListener('load', handler);
            document.body.removeChild(iframe);
          }, 10);
        }
        iframe.addEventListener('load', handler);
        document.body.appendChild(iframe);
      }

    }
  }

}

</script>