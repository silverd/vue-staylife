<template>

  <div class="weui_media_box weui_media_appmsg m_card_top">
    <div class="weui_media_hd" @click="goToUserPage">
      <img class="weui_media_appmsg_thumb br50" :src="feedInfo.user_info.headimgurl | getThumbUrl 100 100" alt="" />
    </div>
    <div class="weui_media_bd" @click="goToUserPage">
      <h4 class="weui_media_title">
        <span class="pr10">{{feedInfo.user_info.nickname}}</span>
        <img v-for="membs_lv in feedInfo.user_info.membs_lvs" :src="membs_lv.logo_url" :title="membs_lv.name" class="pr5" />
      </h4>
      <p class="weui_media_desc">
        <span class="pr10">{{feedInfo.created_at | timeFormatForDetail}}</span>
        <span>{{feedInfo.pub_addr}}</span>
      </p>
    </div>
    <div v-if="showFollowBtn" class="btn_attention" @click="doFollow | debounce 300">
      <button class="{{followBtn.class}}">{{followBtn.text}}</button>
    </div>
  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  props: {
    feedInfo: {},
    showFollowBtn: {
      default: true
    },
    userNolink: {
      default: false
    }
  },

  // 亮点：计算属性的奥秘
  // @link http://cn.vuejs.org/guide/reactivity.html#计算属性的奥秘
  computed: {

    // 根据当前关注状态决定『关注』按钮的文字
    // 0:未关注 1:已关注 2:互相关注 3:他关注了我
    followBtn () {

      let followBtns = {
        0: ['关注', 'ficon_add'],
        1: ['已关注', 'ficon_right'],
        2: ['互相关注', 'ficon_addtwo'],
        3: ['关注', 'ficon_add'],
        99: ['加载中', 'ficon_add']
      };

      return {
        class: followBtns[this.feedInfo.follow_relation][1],
        text: followBtns[this.feedInfo.follow_relation][0]
      }

    }

  },

  methods: {

    goToUserPage () {
      if (! this.userNolink) {
        this.$route.router.go({name: 'userInfo', params: {uid: this.feedInfo.uid}});
      }
    },

    // 关注、取关
    doFollow () {

      if (! window.localStorage.VUSER) {
        this.$route.router.go('/auth/login?refer=' + encodeURIComponent(this.$route.path));
        return false;
      }

      // 加载中
      this.feedInfo.follow_relation = 99;

      api.invoke(this, 'follow/follow', {follow_uid: this.feedInfo.uid}, (resp) => {
        this.feedInfo.follow_relation = ~~resp.data.relation;
      }, this.followBtn);

    }

  }

}

</script>