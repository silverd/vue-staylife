<template>

  <div class="container">
    <div class="weui_cells weui_cells_form">
      <div class="weui_cell">
        <div class="weui_cell_hd"><label class="weui_label">手机号</label></div>
        <div class="weui_cell_bd weui_cell_primary">
          <input v-model="mobile"
            class="weui_input"
            type="text"
            name="mobile"
            placeholder="请输入手机号"
            pattern="[0-9]*" />
        </div>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_hd"><label class="weui_label">密码</label></div>
        <div class="weui_cell_bd weui_cell_primary">
          <input v-model="password"
            class="weui_input"
            type="password"
            name="password"
            placeholder="请输入密码" />
        </div>
      </div>
    </div>
    <div class="weui_btn_area">
      <button type="button" class="weui_btn weui_btn_primary"
        @click="submitForm"
        :class="{'weui_btn_disabled': btns.submitForm.disabled}"
        :disabled="btns.submitForm.disabled"
        v-text="btns.submitForm.text">
      </button>
    </div>
    <div class="weui_icon_area">
      <ul class="line_list">
        <li class="list1"></li>
        <li class="list2"><p><span>或使用第三方账号登录</span></p></li>
      </ul>
      <div class="icon_list">
        <div @click="thirdLogin('QQ_Web')">
          <i class="qq_ico"></i><span>QQ</span>
        </div>
        <div @click="thirdLogin('Weibo_Web')">
          <i class="weibo_ico"></i><span>微博</span>
        </div>
        <div @click="thirdLogin('Weixin_MP')">
          <i class="weixin_ico"></i><span>微信</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import * as api from 'src/api';
import * as filters from 'src/filters';

export default {

  attached () {

    this.$root.navTitle = '登录';
    this.$root.showFooter = false;

    // 是微信浏览器
    if (this.$root.isWeixin) {
      this.thirdLogin('Weixin_MP');
    // 是否QQ内部打开
    } else if (this.$root.isQQ) {
      this.thirdLogin('QQ_Web');
    } else {
      this.$dispatch('hidePreloader');
    }

  },

  components: {
    'alert': require('weui-components/alert')
  },

  data () {
    return {
      mobile: '',
      password: '',
      // 按钮定义
      btns: {
        submitForm: {
          text: '登录',
          disabled: false
        }
      }
    }
  },

  route: {

    data ({to}) {
      // 记住登录前的URL
      window.sessionStorage.loginReferUrl = decodeURIComponent(filters.removeXss(to.query.refer));
    }

  },

  methods: {

    submitForm () {

      let params = {
        mobile: this.mobile,
        password: api.saltPwd(this.password)
      };

      api.invoke(this, 'auth/login', params, (resp) => {

        // 保存用户凭证
        api.saveUserToken(resp.data.__vuser);

        // 成功跳转
        this.$route.router.go(window.sessionStorage.loginReferUrl || '/');

      }, this.btns.submitForm, true);

    },

    thirdLogin (source) {

      let params = {source: source};

      api.invoke(this, 'account3rd/login', params, (resp) => {
        let authorizeUrl = resp.data.url;
        window.location.href = authorizeUrl;
      }, true);

    }
  }

}

</script>

<style scoped>
.line_list {
  margin:0;
  padding:0;
  list-style-type:none;
  font:14px verdana;
  padding:0 15px 13px;
  color:#9c9c9c;
  margin-top: 45px;
}
.line_list li span {
  background: #FBFBFB;
  padding: 0 4px;
}
.line_list li {
  float: left;
  height: 30px;
  width: 100%;
}
.line_list .list1 {
  border-bottom: 1px solid #dbdbdb;
  width: 100%;
  margin-bottom: -17px;
}
.line_list p {
  display: block;
  color: #666;
  text-decoration: none;
  padding: 6px 5px;
  width: 100%;
  text-align: center;
}
.icon_list {
  margin-top: 50px;
  text-align: center;
}
.icon_list div {
  display: inline-block;
  margin: 0 auto;
  padding-right: 50px;
  width: 46px;
  font-size: 12px;
}
.icon_list div:last-child {
  padding-right: 0;
}
.icon_list div i {
  width: 46px;
  height: 46px;
  background-size: 46px;
  display: inline-block;
}
.qq_ico {
  background: url(../assets/img/QQ@2x.png) 0 0 no-repeat;
}
.weibo_ico {
  background: url(../assets/img/weibo@2x.png) 0 0 no-repeat;
}
.weixin_ico {
  background: url(../assets/img/weixin@2x.png) 0 0 no-repeat;
}
</style>