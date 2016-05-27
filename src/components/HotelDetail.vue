<template>

  <div class="container"
    v-infinite-scroll="loadFeeds()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="50">

    <div v-if="hotelTopImgs">
      <swiper auto :list="hotelTopImgs" :height="240"></swiper>
    </div>

    <div v-if="noRecord">
      没有体验，请前往发布
    </div>

    <div class="m_hotel_info">
      <div class="weui_panel weui_panel_access">
        <div class="weui_panel_bd">
          <a href="javascript:void(0);" class="weui_media_box weui_media_appmsg">
            <div class="weui_media_hd">
              <img class="weui_media_appmsg_thumb m_hotel_logo" :src="hotelInfo.logo_url" alt="" />
            </div>
            <div class="weui_media_bd">
              <h4 class="weui_media_title">
                <span class="pr10">{{hotelInfo.name}}</span>
              </h4>
              <div>
                <span v-for="tag in hotelInfo.tags" class="m_hotel_tag">{{tag.name}}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="m_hotel_score weui-row weui-no-gutter">
        <div v-for="value in hotelInfo.stats.scores" class="weui-col-25 m_hotel_score_item">
          {{value.name}}
          <span class="score_num">{{value.score}}</span>
        </div>
      </div>
      <div v-if="hotelInfo.address" @click="openLocation | debounce 300" class="m_hotel_address">
        <i class="m_position_icon"></i>
        <span>{{hotelInfo.address}}</span>
      </div>
      <div v-if="hotelInfo.phone" class="m_hotel_phone">
        <i class="m_phone_icon"></i>
        <span><a href="tel://{{hotelInfo.phone}}">{{hotelInfo.phone}}</a></span>
      </div>
    </div>

    <p class="m_hotel_share_text">本酒店其他体验</p>

    <div class="weui_panel weui_panel_access m_hotel_share">
      <div class="weui_panel_bd">
        <feed-node
          v-for="feedInfo in feeds"
          :feed-info="feedInfo"
          :show-hotel="false"
          track-by="$index">
        </feed-node>
        <div class="no-more" v-show="noMore">
          <p>没有更多数据了~</p>
        </div>
      </div>
    </div>

    <div class="h44"></div>

  </div>

</template>

<script>

import * as api from 'src/api';
import * as filters from 'src/filters';

export default {

  attached () {
    this.$root.navTitle = '酒店详情';
    this.$root.showFooter = true;
    this.$dispatch('showPreloader');
  },

  components: {
    'feed-node': require('./_inc/FeedNode.vue'),
    'swiper': require('weui-components/swiper')
  },

  data () {
    return {
      hotelId: '',
      hotelInfo: {
        stats: {}
      },
      feeds: [],
      noRecord: false,
      page: 1,
      lastMaxId: '',
      noMore: false,
      offScroll: false
    }
  },

  computed: {

    // 酒店轮播头图
    hotelTopImgs () {

      if (! this.hotelInfo.img_list || this.hotelInfo.img_list.length < 1) {
        return null;
      }

      let topImgs = [];

      for (let item of this.hotelInfo.img_list) {
        topImgs.push({
          'img': filters.getThumbUrl(item.img_url, 750, 240),
          'url': 'javascript:;',
          'title': 'by ' + item.nickname
        });
      }

      return topImgs;
    }
  },

  methods: {

    // 获取体验列表
    loadFeeds () {

      this.offScroll = true;

      let params = {
        hotel_id: this.hotelId,
        page: this.page,
        last_max_id: this.lastMaxId
      };

      api.invoke(this, 'hotel/getExpList', params, (resp) => {

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

    // 打开微信地图
    openLocation () {

      // 没有经纬度
      if (! this.hotelInfo.poi_google.latitude || ! this.hotelInfo.poi_google.longitude) {
        return false;
      }

      window.wx.ready(() => {
        window.wx.openLocation({
          latitude: this.hotelInfo.poi_google.latitude,
          longitude: this.hotelInfo.poi_google.longitude,
          name: this.hotelInfo.name,
          address: this.hotelInfo.address,
          scale: 16,  // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
      });

    }

  },

  route: {

    data ({to}) {

      this.hotelId = to.params.hotelId;

      // 获取酒店详情
      api.invoke(this, 'hotel/index', {'hotel_id': this.hotelId}, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        this.hotelInfo = resp.data;

        if (this.hotelInfo === null) {
          this.$route.router.go('/');
        }

        this.$root.navTitle = this.hotelInfo.name;

      });

      // 获取体验列表
      this.loadFeeds();

    },

    deactivate (transition) {
      this.offScroll = true;
      transition.next();
    }

  }

}

</script>