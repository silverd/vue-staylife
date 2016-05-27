'use strict'

export const API_HOST = (process.env.NODE_ENV === 'production')
  ? 'https://api.staylife.cn'
  : 'https://qa.api.staylife.cn';

export const APPID = '3';
export const APPVER = '1.2.99';

// 密码防窃听（传给服务端前需手动加盐）
export const PASSWORD_SALT = 'HiCrew';