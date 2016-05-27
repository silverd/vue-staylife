'use strict'

// import * as config from './config';
// import sha1 from 'locutus/php/strings/sha1';

exports.saltPwd = (password) => {
  return password;
  // return sha1(password + config.PASSWORD_SALT);
}

exports.saveUserToken = (__vuser) => {
  if (__vuser) {
    window.localStorage.VUSER = __vuser;
    window.Vue.http.headers.common['VUSER'] = __vuser;
  }
}

exports.invoke = ($vm, url, params, callback, btnObj, options) => {

  options = options || {};

  // 快捷写法兼容
  if (btnObj === true) {
    btnObj = null;
    options = true;
  }

  if (options === true) {
    options = {
      loading: true
    };
  }

  if (options.loading) {
    $vm.$dispatch('showLoading');
  }

  if (btnObj) {
    btnObj.orgText = btnObj.text;
    btnObj.text = '加载中';
    btnObj.disabled = true;
  }

  $vm.$http.post(url, params).then((resp) => {

    if (options.loading) {
      $vm.$dispatch('hideLoading');
    }

    if (btnObj) {
      btnObj.disabled = false;
      btnObj.text = btnObj.orgText;
    }

    // 非JSON响应
    if (resp.data.status_msg === undefined) {
      $vm.$dispatch('alert', resp.data);
      return false;
    }

    let statusNo = resp.data.status_no;
    let statusMsg = resp.data.status_msg;
    let referUrl = encodeURIComponent($vm.$route.path);

    switch (statusNo) {

      // 请先登录
      case -1000:

        // 清除过期的令牌
        window.localStorage.clear();

        $vm.$route.router.go('/auth/login?refer=' + referUrl);

        break;

      // 请前往完善用户信息（昵称、头像）
      case -1010:

        // TODO
        break;

      // 指定内容不存在
      case -404:

        $vm.$dispatch('alert', statusMsg);

        setTimeout(() => {
          window.location.href = '/';
        }, 3000);

        break;

      case -1:

        $vm.$dispatch('alert', statusMsg);

        break;

      default:

        callback && callback(resp.data);
    }

  }).catch((err) => console.log(err));
}

exports.sendMobileVcode = ($vm, mobile, scene) => {

  exports.invoke($vm, 'auth/sendVcode', {'mobile': mobile, 'scene': scene}, (resp) => {

    let cdSecs = resp.data.secs;

    $vm.btns.sendVcode.text = cdSecs + '秒后重发';
    $vm.btns.sendVcode.disabled = true;

    let __st = setInterval(() => {
      if (cdSecs > 1) {
        $vm.btns.sendVcode.text = (cdSecs--) + '秒后重发';
      } else {
        $vm.btns.sendVcode.text = '获取验证码';
        $vm.btns.sendVcode.disabled = false;
        clearInterval(__st);
      }
    }, 1000);

  });
}

// 调用微信JSSDK
exports.callWxJsApi = ($vm, callback) => {

  let params = {
    url: window.location.href.split('#')[0]
  };

  $vm.$http.post('utils/getSignPackage', params).then((resp) => {

    let signPackage = resp.data;

    window.wx.config({
      // debug: true,
      appId: signPackage.appId,
      timestamp: signPackage.timestamp,
      nonceStr: signPackage.nonceStr,
      signature: signPackage.signature,
      jsApiList: [
        'checkJsApi',
        'chooseWXPay',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage'
      ]
    });

    window.wx.error((res) => {
      window.alert(JSON.stringify(res));
    });

    if (callback) {
      window.wx.ready(callback)
    }

  }).catch((err) => console.log(err));
}

// 禁止微信分享
exports.forbidWxShare = ($vm) => {
  window.wx.hideMenuItems({
    menuList: [
      'menuItem:share:appMessage',
      'menuItem:share:timeline',
      'menuItem:share:qq',
      'menuItem:share:weiboApp'
    ]
  });
}