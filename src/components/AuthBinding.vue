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
      <div class="weui_cell">
        <div class="weui_cell_hd"><label class="weui_label">验证码</label></div>
        <div class="weui_cell_bd weui_cell_primary">
          <input v-model="vcode"
            class="weui_input"
            type="text"
            name="vcode"
            placeholder="请输入验证码"
            pattern="[0-9]*" />
        </div>
        <div class="weui_cell_ft">
          <button type="button" class="weui_btn weui_btn_mini weui_btn_plain_primary"
            @click="sendVcode"
            :class="{'weui_btn_disabled': btns.sendVcode.disabled}"
            :disabled="btns.sendVcode.disabled"
            v-text="btns.sendVcode.text">
          </button>
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
  </div>

</template>

<script>

import * as api from 'src/api';

export default {

  attached () {
    this.$root.navTitle = '绑定帐号';
    this.$root.showFooter = false;
    this.$dispatch('hidePreloader');
  },

  components: {
    'alert': require('weui-components/alert')
  },

  data () {
    return {
      mobile: '',
      password: '',
      vcode: '',
      // 按钮定义
      btns: {
        sendVcode: {
          text: '获取验证码',
          disabled: false
        },
        submitForm: {
          text: '确定',
          disabled: false
        }
      }
    }
  },

  methods: {

    sendVcode () {
      api.sendMobileVcode(this, this.mobile, 'REGISTER');
    },

    submitForm () {

      let params = {
        mobile: this.mobile,
        password: api.saltPwd(this.password),
        vcode: this.vcode
      };

      // 传递 session_id
      params[this.$route.query.sess_name] = this.$route.query.sess_value;

      api.invoke(this, 'account3rd/bindingAccountLite', params, (resp) => {

        // 保存用户凭证
        api.saveUserToken(resp.data.__vuser);

        // 成功跳转
        this.$route.router.go(window.sessionStorage.loginReferUrl || '/');

      }, this.btns.submitForm, true);

    }

  }

}

</script>