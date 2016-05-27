<template>

  <div class="m_card">

    <!--发布人信息-->
    <feed-user :feed-info="feedInfo" :user-nolink="userNolink" :show-follow-btn="showFollowBtn"></feed-user>

    <div class="m_card_main" v-link="{name: 'feedInfo', params: {feedType: feedType, feedId: feedInfo.id}}">
      <div v-if="feedInfo.cover_url != ''" class="rel">
        <img :src="feedInfo.cover_url | getThumbUrl 750 750" class="m_card_main_img" />
        <div v-if="feedInfo.img_count > 0" class="m_card_main_img_num">共 {{feedInfo.img_count}} 张</div>
      </div>
      <p class="m_card_main_text">{{{feedInfo.content}}}</p>
    </div>

    <div class="m_card_bottom">
      <a v-if="showHotel && feedInfo.hotel_info" v-link="{name: 'hotelInfo', params: {hotelId: feedInfo.hotel_id}}" class="weui_media_box weui_media_appmsg m_card_hotel_info">
        <div class="weui_media_hd">
          <img class="weui_media_appmsg_thumb" :src="feedInfo.hotel_info.logo_url | getThumbUrl 100 100" alt="" />
        </div>
        <div class="weui_media_bd">
          <h4 class="weui_media_title hotel_name">
            {{feedInfo.hotel_info.name}}
          </h4>
          <p class="weui_media_desc">
            <span>本次评分</span>
            <span>{{feedInfo.avg_score}}</span>
          </p>
        </div>
        <div class="m_card_arrow_right">
          <img src="../../assets/img/arrow_right_black@2x.png" />
        </div>
      </a>
      <div class="m_card_function">
        <div class="m_card_function_left l">
          <span class="m_card_function_zan" @click="doLike">
            <img v-show="feedInfo.is_liked" src="../../assets/img/zan_hover@2x.png" />
            <img v-else src="../../assets/img/zan@2x.png" />
            {{feedInfo.like_count}}
          </span>
          <span class="m_card_function_comment" v-link="{name: 'comments', params: {targetType: feedType, targetId: feedInfo.id}}">
            <img v-show="feedInfo.comment_count > 0" src="../../assets/img/comment_hover@2x.png" />
            <img v-else src="../../assets/img/comment@2x.png" />
            {{feedInfo.comment_count}}
          </span>
        </div>
        <div v-if="feedInfo.icon_ids" @click="viewInviteIcons" class="m_card_function_right r" :class="{'m_card_function_right_exp': slideUpInviteIcon}">
          <button class="btn_mini">可约</button>
          <template v-for="icon in feedInfo.invite_icons">
            <i v-if="icon.status > 0" :class="'i_invite_ico_' + icon.id"></i>
          </template>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  props: {
    feedType: {
      default: 1
    },
    feedInfo: {},
    showHotel: {
      default: true
    },
    showFollowBtn: {
      default: true
    },
    userNolink: {
      default: false
    }
  },

  components: {
    'feed-user': require('./FeedUser.vue')
  },

  data () {
    return {
      slideUpInviteIcon: 0
    }
  },

  methods: {

    // 展开『可约』图标
    viewInviteIcons () {
      this.slideUpInviteIcon = ! this.slideUpInviteIcon;
    },

    // 点赞、取赞
    doLike () {

      if (! window.localStorage.VUSER) {
        this.$route.router.go('/auth/login?refer=' + encodeURIComponent(this.$route.path));
        return false;
      }

      if (this.feedInfo.is_liked) {
        this.feedInfo.like_count--;
        this.feedInfo.is_liked = 0;
      } else {
        this.feedInfo.like_count++;
        this.feedInfo.is_liked = 1;
      }

      api.invoke(this, 'like/like', {
        target_id: this.feedInfo.id,
        target_type: this.feedType
      });

    }
  }
}

</script>