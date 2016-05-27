<template>

  <div class="container"
    v-infinite-scroll="loadFeeds()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="50">

    <div class="m_top_user_info">
      <div class="full_info">
        <div class="m_head_portrait">
          <img :src="userInfo.headimgurl | getThumbUrl 100 100" alt="" />
        </div>
        <p class="m_user_name">
          {{userInfo.nickname}}
          <img v-if="userInfo.sex == 1" src="../assets/img/male.png" />
          <img v-else src="../assets/img/female.png" />
        </p>
        <p class="m_user_signature">
          <span class="m_user_signature_content">
            {{userInfo.signature || 'TA 很懒，没有留下个性签名'}}
          </span>
        </p>
        <div class="m_attention_button" @click="doFollow | debounce 300">
          <button class="{{followBtn.class}}"><i></i>{{followBtn.text}}</button>
        </div>
        <div class="m_user_atten">
          <div class="m_col_50 l f20">{{socialCount.follow_count}} <span class="f13">关注</span></div>
          <div class="m_col_50 l f20">{{socialCount.fans_count}} <span class="f13">粉丝</span></div>
        </div>
      </div>
    </div>

    <div class="m_main">
      <div class="weui_panel weui_panel_access">
        <div class="weui_panel_bd">
          <feed-node
            v-for="feedInfo in feeds"
            :feed-info="feedInfo.target_info"
            :user-nolink="true"
            :show-follow-btn="false"
            track-by="$index">
          </feed-node>
          <div class="no-more" v-show="noMore">
            <p>没有更多数据了~</p>
          </div>
        </div>
      </div>
    </div>

    <div class="h44"></div>

  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '用户详情';
    this.$root.showFooter = true;
    this.$dispatch('showPreloader');
  },

  components: {
    'feed-node': require('./_inc/FeedNode.vue')
  },

  data () {
    return {
      uid: '',
      userInfo: {},
      socialCount: {},
      followRelation: 0,
      feeds: [],
      page: 1,
      lastMaxId: '',
      noMore: false,
      offScroll: false
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
        class: followBtns[this.followRelation][1],
        text: followBtns[this.followRelation][0]
      }

    }

  },

  methods: {

    // 获取体验列表
    loadFeeds () {

      this.offScroll = true;

      let params = {
        uid: this.uid,
        page: this.page,
        last_max_id: this.lastMaxId
      };

      api.invoke(this, 'feed/postedList', params, (resp) => {

        let newDataList = resp.data;

        if (! newDataList || newDataList.length < 1) {
          this.noMore = true;
          return false;
        }

        // 追加当前列表
        for (let item of newDataList) {
          this.feeds.push(item);
        }

        this.lastMaxId = newDataList[newDataList.length - 1]['id'];
        this.page++;

        this.offScroll = false;

      });

    },

    // 关注、取关
    doFollow () {

      if (! window.localStorage.VUSER) {
        this.$route.router.go('/auth/login?refer=' + encodeURIComponent(this.$route.path));
        return false;
      }

      // 加载中
      this.followRelation = 99;

      api.invoke(this, 'follow/follow', {follow_uid: this.userInfo.uid}, (resp) => {

        this.followRelation = ~~resp.data.relation;

        // 关注
        if ([1, 2].includes(this.followRelation)) {
          this.socialCount.fans_count++;
        // 取关
        } else {
          this.socialCount.fans_count--;
        }

      });

    },

    isFollowed () {

      // 游客都显示『未关注』
      if (! window.localStorage.VUSER) {
        this.followRelation = 0;
        return false;
      }

      api.invoke(this, 'follow/getRelation', {follow_uid: this.userInfo.uid}, (resp) => {
        this.followRelation = ~~resp.data;
      });

    }

  },

  route: {

    data ({to}) {

      this.uid = to.params.uid;

      // 获取用户详情
      api.invoke(this, 'user/nameCard', {'uid': this.uid}, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        this.userInfo = resp.data;

        if (this.userInfo === null) {
          this.$route.router.go('/');
        }

        this.$root.navTitle = this.userInfo.nickname;

        // 获取我和他的关注关系
        this.isFollowed();

      });

      // 获取用户关注粉丝数
      api.invoke(this, 'user/socialCount', {'uid': this.uid}, (resp) => {
        this.socialCount = resp.data;
      });

      // 获取他发表的体验列表
      this.loadFeeds();

    },

    deactivate (transition) {
      this.offScroll = true ;
      transition.next();
    }

  }
}

</script>