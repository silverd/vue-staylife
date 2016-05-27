<template>

  <div class="container">

    <!--发布人信息-->
    <feed-user :feed-info="feedInfo" v-if="feedInfo.user_info"></feed-user>

    <div class="s_main">

      <div class="s_main_text">{{{feedInfo.content}}}</div>

      <div v-if="feedInfo.tags" class="s_main_label">
        <div class="s_main_label_l">
          <span v-for="tag in feedInfo.tags" v-text="tag.name"></span>
        </div>
        <div class="s_main_label_r">
          本次评分
          <span class="c_blue">{{feedInfo.avg_score}}</span>
        </div>
      </div>

      <div v-if="feedInfo.img_list" class="s_main_pic" id="pic_list_ul">
        <ul>
          <li v-for="imgUrl in feedInfo.img_list">
            <img :src="imgUrl | getThumbUrl 750 750" @click="previewImg(imgUrl)" />
          </li>
        </ul>
      </div>

      <div v-if="feedInfo.hotel_info" class="s_main_hotel">
        <a v-link="{name: 'hotelInfo', params: {hotelId: feedInfo.hotel_id}}">
          <div class="hotel_logo">
            <img :src="feedInfo.hotel_info.logo_url | getThumbUrl 100 100" alt="" />
          </div>
          <div class="hotel_info">
            <div class="fl">
              <div class="hotel_name">{{feedInfo.hotel_info.name}}</div>
              <p class="hotel_mark"><span>本次评分</span><span>{{feedInfo.avg_score}}</span></p>
            </div>
          </div>
          <div class="m_card_arrow_right">
            <img src="../assets/img/arrow_right_black@2x.png" />
          </div>
        </a>
      </div>

      <div class="s_main_menu_bar">
        <div class="like" @click="doLike">
          <i :class="{'like_pic': feedInfo.is_liked, 'unlike_pic': ! feedInfo.is_liked}">
            {{feedInfo.like_count}}
          </i>
        </div>
        <div class="review" v-link="{name: 'comments', params: {targetType: feedType, targetId: feedId}}">
          <i :class="{'has_comment_pic': feedInfo.comment_count > 0, 'no_comment_pic': feedInfo.comment_count < 1}">
            {{feedInfo.comment_count}}
          </i>
        </div>
      </div>
    </div>

    <div class="s_bottom">

      <div class="s_bottom_like" v-link="{name: 'likers', params: {targetType: feedType, targetId: feedId}}">
        <span class="s_bottom_like_left">
          <span class="number">{{feedInfo.like_count}}</span>个人点赞
        </span>
        <span class="s_bottom_like_right">
          <span v-for="_user in feedInfo.liker_list">
            <img :src="_user.headimgurl | getThumbUrl 25 25" />
          </span>
        </span>
      </div>

      <comment-list v-show="feedComments.length > 0" :comments="feedComments"></comment-list>

    </div>

    <div class="h140"></div>

    <div id="bottom-bar">
      <div id="app-icon"></div>
      <div id="app-slogan">Stay - 酒店生活家
        <p>发现全世界最想住的酒店</p>
      </div>
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.amokie.stay&amp;g_f=991653" class="btn">打开</a>
    </div>

    <div class="comment_list_bottom" v-link="{name: 'comments', params: {targetType: feedType, targetId: feedId}}">
      <input type="text" placeholder="请说点什么吧 ……"/>
      <span class="comment_button">
        <button>评论</button>
      </span>
    </div>

  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.showFooter = false;
    this.$dispatch('showPreloader');
  },

  components: {
    'feed-user': require('./_inc/FeedUser.vue'),
    'comment-list': require('./_inc/CommentList.vue'),
    'toast': require('weui-components/toast')
  },

  data () {
    return {
      feedId: '',
      feedType: 1,
      feedInfo: {
        tags: [],
        stats: {}
      },
      feedComments: []
    }
  },

  route: {

    data ({to}) {

      this.feedId = to.params.feedId;
      this.feedType = to.params.feedType || '1';  // 1:体验 2:文章

      let feedTyps = {
        '1': ['exp/detail', '体验详情'],
        '2': ['article/detail', '文章详情']
      };

      if (! feedTyps[this.feedType]) {
        this.$route.router.go('/');
      }

      // 页面标题
      this.$root.navTitle = feedTyps[this.feedType][1];

      api.invoke(this, feedTyps[this.feedType][0], {id: this.feedId}, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        this.feedInfo = resp.data;

        // 不存在
        if (! this.feedInfo.id) {
          this.$route.router.go('/');
        }

        this.wxShare(this.feedInfo);

      });

      // 获取体验评论
      let params = {
        'target_id': this.feedId,
        'target_type': this.feedType
      };

      api.invoke(this, 'comment/list', params, (resp) => {
        if (resp.data) {
          this.feedComments = resp.data;
        }
      });

    }
  },

  methods: {

    // 预览图片
    previewImg (curUrl) {

      let imgUrls = [];

      for (let imgUrl of this.feedInfo.img_list) {
        imgUrls.push(imgUrl);
      }

      window.wx.previewImage({
        current: curUrl,
        urls: imgUrls
      });
    },

    // 点赞、取赞
    doLike () {

      if (! window.localStorage.VUSER) {
        this.$route.router.go('/auth/login?refer=' + encodeURIComponent(this.$route.path));
        return false;
      }

      let params = {
        target_id: this.feedId,
        target_type: this.feedType
      };

      api.invoke(this, 'like/like', params, (resp) => {
        if (this.feedInfo.is_liked) {
          this.feedInfo.like_count--;
          this.feedInfo.is_liked = 0;
        } else {
          this.feedInfo.like_count++;
          this.feedInfo.is_liked = 1;
        }
      });

    },

    // 微信分享文案
    wxShare (feedInfo) {

      window.wx.ready(() => {

        // 发送给朋友
        window.wx.onMenuShareAppMessage({
          title: feedInfo.shared_info.title,
          desc: feedInfo.shared_info.desc,
          link: feedInfo.shared_info.url,
          imgUrl: feedInfo.shared_info.logo,
          trigger (res) {},
          success (res) {},
          cancel (res) {},
          fail (res) {
            window.alert(JSON.stringify(res));
          }
        });

        // 分享到朋友圈
        window.wx.onMenuShareTimeline({
          title: feedInfo.shared_info.title,
          link: feedInfo.shared_info.url,
          imgUrl: feedInfo.shared_info.logo,
          trigger (res) {},
          success (res) {},
          cancel (res) {},
          fail (res) {
            window.alert(JSON.stringify(res));
          }
        });

      });

    }

  }

}

</script>