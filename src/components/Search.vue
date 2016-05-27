<template>

  <div class="container" :class="{'has_header': $root.showHeader}"
    v-infinite-scroll="doSearch()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="50">

    <div class="weui_search_bar m_search_bar" :class="{'weui_search_focusing': isSearching}">
      <div class="weui_search_outer">
        <div class="weui_search_inner">
          <i class="weui_icon_search"></i>
          <input @keyup.enter="doSearch(true)"
            @blur="hideSearchInput"
            v-model="keyword"
            type="search"
            class="weui_search_input"
            placeholder="输入酒店关键字"
            required
            v-el:input />
          <a @click="resetSearch" class="weui_icon_clear"></a>
        </div>
        <label @click="showSearchInput" for="search_input" class="weui_search_text">
          <i class="weui_icon_search"></i>
          <span>输入酒店关键字</span>
        </label>
      </div>
      <a @click="cancelSearch" class="weui_search_cancel">取消</a>
    </div>

    <div class="m_search_list">
      <ul v-show="! noRecord">
        <li v-for="hotel in hotels" track-by="$index" class="weui_panel weui_panel_access">
          <div class="weui_panel_bd">
            <div class="m_hotel_item">
              <a v-link="{name: 'hotelInfo', params: {hotelId: hotel.id}}" class="weui_media_box weui_media_appmsg">
                <div class="weui_media_hd">
                  <img class="weui_media_appmsg_thumb m_hotel_logo" :src="hotel.logo_url" alt="">
                </div>
                <div class="weui_media_bd">
                  <h4 class="weui_media_title">
                    <span class="pr10">{{hotel.name}}</span>
                  </h4>
                  <p class="weui_media_desc">
                    {{hotel.address}}
                  </p>
                  <div>
                    <span class="m_hotel_tag" v-for="tag in hotel.tags" v-if="$index < 2" :style="{backgroundColor: tag.color}">
                      {{tag.name}}
                    </span>
                    <span class="m_hotel_mark">评分<strong>{{hotel.stats.avg_score}}</strong></span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-more" v-show="noMore">
        <p>没有更多数据了~</p>
      </div>
      <div class="m_search_no_result" v-show="noRecord">
        <p>目前还未收录您心仪的酒店，</p>
        <p>我们后期会尽快添加。</p>
      </div>
      <div class="h44"></div>
    </div>
  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '发现';
    this.$root.showFooter = true;
    this.$dispatch('showPreloader');
  },

  data () {
    return {
      page: 1,
      noMore: false,
      noRecord: false,
      keyword: '',
      hotels: [],
      isSearching: false,
      offScroll: false
    }
  },

  ready () {
    // 缺省无关键字搜索
    this.doSearch();
  },

  route: {
    deactivate (transition) {
      this.offScroll = true;
      transition.next();
    }
  },

  methods: {

    showSearchInput () {
      this.isSearching = true;
      // 使文本框聚焦
      this.$els.input.focus();
    },

    hideSearchInput () {
      this.isSearching = false;
    },

    cancelSearch () {
      this.keyword = '';
      this.hideSearchInput();
    },

    resetSearch () {
      this.keyword = '';
      this.showSearchInput();
    },

    doSearch (clear) {

      // 新一次搜索，清空旧结果
      if (clear) {
        this.hotels = [];
        this.page = 1;
        this.noMore = false;
        this.noRecord = false;
        // 清屏并显示加载中
        this.$dispatch('showPreloader');
      }

      this.offScroll = true;

      let params = {
        keyword: this.keyword,
        page: this.page,
        coord_type: 3,  // gcj02
        longitude: this.$root.userLocation.longitude,
        latitude: this.$root.userLocation.latitude
      };

      api.invoke(this, 'hotel/search', params, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        let newDataList = resp.data;

        if (! newDataList || newDataList.length < 1) {

          if (clear) {
            this.noRecord = true;
          } else {
            this.noMore = true;
          }

          return false;
        }

        // 追加当前列表
        for (let item of newDataList) {
          this.hotels.push(item);
        }

        this.page++;

        this.offScroll = false;

      });
    }
  }

}

</script>