<template>

  <div :class="['app', 'app-' + $route.name]">
    <app-header :nav-title.sync="navTitle"></app-header>
    <router-view v-show="showContent" transition="fade"></router-view>
    <app-footer v-show="showFooter"></app-footer>
    <preloader :show="preloader.show" :text="preloader.text"></preloader>
    <loading :show="loading.show" :text="loading.text"></loading>
    <alert
      :show.sync="alert.show"
      :title="alert.title"
      :button-text="alert.buttonText"
      @on-hide="alert.onHide">{{alert.text}}</alert>
  </div>

</template>

<script>

import 'vux/vux.css';
import 'assets/css/m_base.css';
import 'assets/css/m_index.css';

import * as api from 'src/api';

export default {

  replace: false,

  components: {
    'app-header': require('./_layout/Header.vue'),
    'app-footer': require('./_layout/Footer.vue'),
    'preloader': require('./_inc/Preloader.vue'),
    'loading': require('weui-components/loading'),
    'alert': require('weui-components/alert')
  },

  data () {
    return {
      navTitle: 'Stay生活家',
      userLocation: {
        longitude: null,
        latitude: null
      },
      showContent: false,
      showFooter: true,
      preloader: {
        show: true,
        text: '正在加载 ...'
      },
      loading: {
        show: false,
        text: '数据加载中'
      },
      alert: {
        show: false,
        title: '提示信息',
        text: '提示内容',
        buttonText: '确定',
        onHide () {
          // do nothing
        }
      }
    }
  },

  computed: {
    userAgent () {
      return navigator.userAgent.toLowerCase();
    },
    isWeixin () {
      return this.userAgent.indexOf('micromessenger') !== -1;
    },
    isQQ () {
      return this.userAgent.indexOf('qq') !== -1;
    },
    isAndroid () {
      return this.userAgent.indexOf('android') !== -1;
    },
    isApple () {
      return this.userAgent.indexOf('iphone') !== -1 || this.userAgent.includes('ipad') !== -1;
    },
    showHeader () {
      return ! this.isWeixin && ! this.isQQ;
    }
  },

  methods: {
    resetAlert () {
      this.alert = {
        show: false,
        title: '提示信息',
        text: '提示内容',
        buttonText: '确定',
        onHide () {
          // do nothing
        }
      };
    }
  },

  events: {

    showPreloader () {
      this.showContent = false;
      this.preloader.show = true;
    },

    hidePreloader () {
      this.showContent = true;
      this.preloader.show = false;
    },

    showLoading () {
      this.loading.show = true;
    },

    hideLoading () {
      this.loading.show = false;
    },

    // 通用弹窗组件
    alert (msgs) {

      this.resetAlert();

      if (typeof msgs === 'string') {
        this.alert.text = msgs;
      } else {
        this.alert.text = msgs.text;
        if (msgs.title) {
          this.alert.title = msgs.title;
        }
      }

      this.alert.show = true;
    }

  },

  ready () {

    // 初始化微信JS-SDK
    if (this.isWeixin) {

      api.callWxJsApi(this, () => {

        // 获取我的位置
        window.wx.getLocation({
          type: 'gcj02',
          success (resp) {
            this.userLocation = {
              longitude: resp.longitude,
              latitude: resp.latitude
            };
          }
        });

        window.wx.ready(() => {

          // 发送给朋友
          window.wx.onMenuShareAppMessage({
            title: 'Stay - 有格调的生活家',
            desc: '我在这里发现了格调颜值超高的好去处！',
            link: 'http://m.staylife.cn',
            imgUrl: 'http://stay-static-img.69night.cn/stay_120a.png',
            trigger (res) {},
            success (res) {},
            cancel (res) {},
            fail (res) {
              window.alert(JSON.stringify(res));
            }
          });

          // 分享到朋友圈
          window.wx.onMenuShareTimeline({
            title: 'Stay - 有格调的生活家',
            link: 'http://m.staylife.cn',
            imgUrl: 'http://stay-static-img.69night.cn/stay_120a.png',
            trigger (res) {},
            success (res) {},
            cancel (res) {},
            fail (res) {
              window.alert(JSON.stringify(res));
            }
          });

        });

      });

    }

  }

}

</script>

<style>

html, body {
  height: 100%;
  -webkit-tap-highlight-color: transparent;
}

.page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@keyframes slideIn {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideOut {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}

.page.slideIn {
  animation: slideIn .2s forwards;
}

.page.slideOut {
  animation: slideOut .2s forwards;
}

.slide-transition {
  transition: transform 0.2s ease;
  width: 100%;
}

.slide-enter, .slide-leave {
  transform: translateX(100%);
}

.app-transition {
  transition: opacity 0.2s ease;
}

.app-enter, .app-leave {
  opacity: 0;
}

.fade-transition {
  opacity: 1;
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave {
  opacity: 0;
}

</style>