<template>

  <div class="container">
    <div class="no-more">
      数据加载中 ...
    </div>
    <alert :show.sync="alert.submitErr.show" title="提示信息" @on-hide="alert.submitErr.onHide">{{alert.submitErr.text}}</alert>
  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '授权登录';
    this.$root.showFooter = false;
    this.$dispatch('hidePreloader');
  },

  components: {
    'alert': require('weui-components/alert')
  },

  data () {
    return {
      // 弹窗定义
      alert: {
        submitErr: {
          show: false,
          text: '',
          onHide () {
            this.$route.router.go('/');
          }
        }
      }
    }
  },

  route: {

    data ({to}) {

      let params = {
        source: to.params.source,
        code: to.query.code
      };

      // 注意：这里要求是 GET 方法
      this.$http.get('account3rd/redirectOAuth', params).then((resp) => {

        // 降维
        resp = resp.data;

        // 请前往绑定官方账号
        if (resp.status_no === -1020) {
          this.$route.router.go('/auth/binding?sess_name=' + resp.data.sess_id.name + '&sess_value=' + resp.data.sess_id.value);
          return false;
        }

        // 如果有异常
        if (resp.status_no !== 0) {
          this.alert.submitErr.show = true;
          this.alert.submitErr.text = resp.status_msg;
          return false;
        }

        // 保存用户凭证
        api.saveUserToken(resp.data.__vuser);

        // 成功跳转
        this.$route.router.go(window.sessionStorage.loginReferUrl || '/');

      }).catch((err) => console.log(err));

    }

  }

}

</script>