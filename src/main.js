'use strict'

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';
import VueLazyLoad from 'vue-lazyload';
import VueInfiniteScroll from 'vue-infinite-scroll';

import routerConfig from './routers';
import initHttp from './http';
import * as filters from './filters';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);
Vue.use(VueLazyLoad);
Vue.use(VueInfiniteScroll);

// 注册过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const router = new VueRouter({
  hashbang: false,
  history: true,
  saveScrollPosition: true
});

// 请求、响应全局封装
initHttp(Vue);

// 执行路由分发
routerConfig(router);

const App = Vue.extend(require('./components/App.vue'));
router.start(App, '#app');

window.Vue = Vue;
window.router = router;