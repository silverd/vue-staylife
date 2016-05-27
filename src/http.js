'use strict'

import * as config from './config';

export default (Vue) => {
  Vue.http.options.root = config.API_HOST;
  Vue.http.options.emulateJSON = true;
  Vue.http.options.crossOrigin = true;
  // Vue.http.options.xhr = {withCredentials: true};
  Vue.http.headers.common['APPID'] = config.APPID;
  Vue.http.headers.common['APPVER'] = config.APPVER;
  Vue.http.headers.common['VUSER'] = window.localStorage.VUSER;
}