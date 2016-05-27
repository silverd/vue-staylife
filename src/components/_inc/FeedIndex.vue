<template>

  <div class="m_index_main"
    v-infinite-scroll="loadFeeds()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="50">
    <div class="weui_panel weui_panel_access">
      <div class="weui_panel_bd">
        <feed-list :feeds="feeds"></feed-list>
        <div class="no-more" v-show="noMore">
          <p>没有更多数据了~</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  props: {
    dataUrl: '',
    offScroll: {
      default: false
    }
  },

  components: {
    'feed-list': require('./FeedList.vue')
  },

  data () {
    return {
      feeds: [],
      page: 1,
      lastMaxId: '',
      noMore: false
    }
  },

  ready () {
    // 自动加载列表
    this.loadFeeds();
  },

  methods: {

    // 获取体验列表
    loadFeeds () {

      this.offScroll = true;

      let params = {
        page: this.page,
        last_max_id: this.lastMaxId
      };

      api.invoke(this, this.dataUrl, params, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

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

    }
  }

}

</script>