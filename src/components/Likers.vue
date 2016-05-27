<template>

  <div class="container"
    v-infinite-scroll="loadLikers()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="100"
    infinite-scroll-immediate-check="immediateCheck">

    <div class="m_zan mb50">
      <ul class="m_zan_list">
        <li v-for="user in likers">
          <div class="zan_user_icon">
            <img :src="user.headimgurl | getThumbUrl 40 40" />
          </div>
          <div class="zan_user_info" v-link="{name: 'userInfo', params: {uid: user.uid}}">
            <span class="pr10">{{user.nickname}}</span>
            <img v-for="membs_lv in user.membs_lvs" :src="membs_lv.logo_url" :title="membs_lv.name" class="pr5" />
          </div>
        </li>
      </ul>
    </div>

    <div class="no-more" v-show="page > 1 && noMore">
      <p>没有更多数据了~</p>
    </div>

  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '点赞人名单';
    this.$root.showFooter = false;
    this.$dispatch('showPreloader');
  },

  data () {
    return {
      targetId: 0,
      targetType: 1,
      likers: [],
      page: 1,
      lastMaxId: '',
      noMore: false,
      offScroll: false,
      immediateCheck: false
    }
  },

  route: {

    data ({to}) {

      this.targetId = to.params.targetId;
      this.targetType = to.params.targetType || '1';  // 1:体验 2:文章

      // 加载第一页数据
      this.loadLikers();
    },

    deactivate (transition) {
      this.offScroll = true;
      transition.next();
    }

  },

  methods: {

    loadLikers () {

      this.offScroll = true;

      let params = {
        target_id: this.targetId,
        target_type: this.targetType,
        page: this.page,
        last_max_id: this.lastMaxId
      };

      api.invoke(this, 'like/getLikerList', params, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        let newDataList = resp.data;

        if (! newDataList || newDataList.length < 1) {
          this.noMore = true;
          return false;
        }

        // 追加当前列表
        for (let item of newDataList) {
          this.likers.push(item);
        }

        this.lastMaxId = newDataList[newDataList.length - 1]['id'];
        this.page++;

        this.offScroll = false;

      });

    }

  }

}

</script>
