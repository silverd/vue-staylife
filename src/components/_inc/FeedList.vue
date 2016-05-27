<template>

  <div v-for="info in feeds" track-by="$index">

    <!--附近的人-->
    <div v-if="info.target_type == 601 && info.target_info.is_ok" class="m_nearby">
      <img :src="info.target_info.bg_img" />
      <div class="m_local_icon">
        <i class="m_circle"></i>
        <span class="m_local_rect">{{info.target_info.address || '获取位置信息失败，找不到附近的人'}}</span>
      </div>
      <div class="btn_nearby">
        <span class="btn_nearby_text">点击查看附近的人</span>
      </div>
    </div>

    <!--图文运营位-->
    <div v-if="info.target_type == 602" class="m_operation" @click="gotoOuterURL(info.target_info.url)">
      <img :src="info.target_info.bg_img | getThumbUrl 750 750" />
      <div class="m_operation_bottom">
        <div class="m_operation_title">{{info.target_info.title}}</div>
        <div class="m_operation_contant">{{info.target_info.description}}</div>
      </div>
    </div>

    <!--明星用户-->
    <div v-if="info.target_type == 603" class="m_recommend">
      <p class="m_recommend_title">{{info.target_info.title}}</p>
      <ul>
        <li class="m_recommend_contant" v-for="_user in info.target_info.user_list">
          <a v-link="{name: 'userInfo', params: {uid: _user.uid}}" class="weui_media_box weui_media_appmsg m_card_top">
            <div class="weui_media_hd">
              <img class="weui_media_appmsg_thumb br50" :src="_user.headimgurl | getThumbUrl 100 100" alt="" />
            </div>
            <div class="weui_media_bd">
              <h4 class="weui_media_title">
                <span class="pr10">{{_user.nickname}}</span>
                <img v-for="membs_lv in _user.membs_lvs" :src="membs_lv.logo_url" :title="membs_lv.name" class="pr5" />
              </h4>
              <p class="weui_media_desc m_recommend_contant_signature">
                {{_user.signature}}
              </p>
            </div>
            <div class="m_add_attention">
              <button>+ 关注</button>
            </div>
          </a>
        </li>
      </ul>
      <p class="m_recommend_more">更多</p>
    </div>

    <!--普通feed-->
    <div v-if="info.target_type == 1 || info.target_type == 2">
      <feed-node :feed-type="info.target_type" :feed-info="info.target_info"></feed-node>
    </div>

  </div>

</template>

<script>

import * as filters from 'src/filters';

export default {

  props: [
    'feeds'
  ],

  components: {
    'feed-node': require('./FeedNode.vue')
  },

  methods: {
    gotoOuterURL (url) {
      url = filters.transDeepLinks(url);
      // 站内路由跳转
      if (url.substring(0, 1) === '/') {
        this.$route.router.go(url);
      // 外链直接跳
      } else {
        window.location.href = url;
      }
    }
  }

}

</script>