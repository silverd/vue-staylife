'use strict'

export default (router) => {

  let mapping = {
    '/': {
      name: 'home',
      component: require('./components/FeedRecommend.vue')
    },
    '/feeds/latest': {
      name: 'feedLatest',
      component: require('./components/FeedLatest.vue')
    },
    '/feeds/recommend': {
      name: 'feedRecommend',
      component: require('./components/FeedRecommend.vue')
    },
    '/search': {
      name: 'search',
      component: require('./components/Search.vue')
    },
    '/feed/:feedType/:feedId': {
      name: 'feedInfo',
      component: require('./components/FeedDetail.vue')
    },
    '/likers/:targetType/:targetId': {
      name: 'likers',
      component: require('./components/Likers.vue')
    },
    '/comments/:targetType/:targetId': {
      name: 'comments',
      component: require('./components/Comments.vue')
    },
    '/user/:uid': {
      name: 'userInfo',
      component: require('./components/UserDetail.vue')
    },
    '/hotel/:hotelId': {
      name: 'hotelInfo',
      component: require('./components/HotelDetail.vue')
    },
    '/auth/register': {
      name: 'register',
      guest: true,
      component: require('./components/AuthRegister.vue')
    },
    '/auth/login': {
      name: 'login',
      guest: true,
      component: require('./components/AuthLogin.vue')
    },
    '/auth/oauth/:source': {
      name: 'oauth',
      guest: true,
      component: require('./components/AuthOAuth.vue')
    },
    '/auth/binding': {
      name: 'binding',
      guest: true,
      component: require('./components/AuthBinding.vue')
    }
  };

  router.map(mapping);

  router.beforeEach((transition) => {

    window.scrollTo(0, 0);

    if (window.localStorage.VUSER === 'null') {
      window.localStorage.removeItem('VUSER');
    }

    // 登录中间验证
    if (transition.to.auth && ! window.localStorage.VUSER) {
      transition.redirect('/auth/login?refer=' + encodeURIComponent(transition.to.path));
    } else if (transition.to.guest && window.localStorage.VUSER) {
      transition.redirect('/?logined=1');
    } else {
      transition.next();
    }

  });

  router.redirect({
    '*': '/'
  });
}
