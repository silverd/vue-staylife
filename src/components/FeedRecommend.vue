<template>

  <div class="container">
    <feed-index data-url="feed/stick" :off-scroll="offScroll"></feed-index>
  </div>

</template>

<script>

export default {

  attached () {
    this.$root.navTitle = '推荐';
    this.$root.showFooter = true;
    this.$dispatch('showPreloader');
  },

  data () {
    return {
      offScroll: false
    };
  },

  components: {
    'feed-index': require('./_inc/FeedIndex.vue')
  },

  route: {
    deactivate (transition) {
      this.offScroll = true;
      transition.next();
    }
  }

}

</script>