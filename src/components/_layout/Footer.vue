<template>

  <div class="m_fixed_bottom">
    <div class="m_fiexd_bottom_tabs">
      <div class="m_col_50" v-link="{path: '/feeds/latest', activeClass: 'm_selected'}">
        最新
      </div>
      <div class="m_col_50" v-link="{path: '/feeds/recommend', activeClass: 'm_selected'}">
        推荐
      </div>
      <div class="m_search" v-link="'/search'">
        <img src="../../assets/img/i-search@2x.png" />
      </div>
    </div>
  </div>

</template>