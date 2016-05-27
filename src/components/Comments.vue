<template>

  <div class="container"
    v-infinite-scroll="loadComments()"
    infinite-scroll-disabled="offScroll"
    infinite-scroll-distance="100"
    infinite-scroll-immediate-check="immediateCheck">

    <div v-show="comments.length < 1" class="s_main_comment">
      <div class="no_comment">
        <img src="../assets/img/comment0@2x.png"/>
        <p>暂无评论</p>
      </div>
    </div>

    <comment-list v-show="comments.length > 0" :comments="comments"></comment-list>

    <div class="no-more" v-show="page > 1 && noMore">
      <p>没有更多数据了~</p>
    </div>

    <div class="h100"></div>

    <div class="comment_list_bottom">
      <input type="text"
        v-model="commentContent"
        placeholder="请说点什么吧 ……"
        @keyup.enter="addComment" />
      <span class="comment_button">
        <button @click="addComment">评论</button>
      </span>
      <toast :show.sync="commentSuccess" :time="1500">评论成功</toast>
    </div>

  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '评论列表';
    this.$root.showFooter = false;
    this.$dispatch('showPreloader');
  },

  components: {
    'comment-list': require('./_inc/CommentList.vue'),
    'toast': require('weui-components/toast')
  },

  data () {
    return {
      targetId: 0,
      targetType: 1,
      comments: [],
      page: 1,
      lastMaxId: '',
      noMore: false,
      commentContent: '',
      commentSuccess: false,
      offScroll: false,
      immediateCheck: false,
      submitingComment: false
    }
  },

  route: {

    data ({to}) {

      this.targetId = to.params.targetId;
      this.targetType = to.params.targetType || '1';  // 1:体验 2:文章

      // 加载第一页数据
      this.loadComments();
    },

    deactivate (transition) {
      this.offScroll = true;
      transition.next();
    }

  },

  methods: {

    addComment () {

      // 去除空格
      this.commentContent = this.commentContent.replace(/(^\s*)|(\s*$)/g, '');

      if (! this.commentContent) {
        return false;
      }

      // 防止重复提交
      if (this.submitingComment) {
        return false;
      }

      this.submitingComment = true;

      let params = {
        target_type: this.targetType,
        target_id: this.targetId,
        content: this.commentContent,
        coord_type: 3,  // gcj02
        longitude: this.$root.userLocation.longitude,
        latitude: this.$root.userLocation.latitude,
        reply_to: ''
      };

      api.invoke(this, 'comment/save', params, (resp) => {

        this.comments.unshift(resp.data);
        this.commentContent = '';
        this.commentSuccess = true;
        this.submitingComment = false;

        // 滚动到顶部
        window.scrollTo(0, 0);

      }, true);

    },

    loadComments () {

      this.offScroll = true;

      let params = {
        target_id: this.targetId,
        target_type: this.targetType,
        page: this.page,
        last_max_id: this.lastMaxId
      };

      api.invoke(this, 'comment/list', params, (resp) => {

        // 隐藏页面加载指示器
        this.$nextTick(() => this.$dispatch('hidePreloader'));

        let newDataList = resp.data;

        if (! newDataList || newDataList.length < 1) {
          this.noMore = true;
          return false;
        }

        // 追加当前列表
        for (let item of newDataList) {
          this.comments.push(item);
        }

        this.lastMaxId = newDataList[newDataList.length - 1]['id'];
        this.page++;

        this.offScroll = false;

      });

    }

  }

}

</script>