'use strict'

exports.getDomain = (url) => {
  const urlParser = document.createElement('a')
  urlParser.href = url
  return urlParser.hostname
}

exports.strReplace = (search, replace, subject, count) => {
  let i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);

  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }

  return sa ? s : s[0];
}

// 过滤XSS
exports.removeXss = (str, reg) => {
  return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, (a, b) => {
    if (b) {
      return a;
    } else {
      return {
        '<': '&lt;',
        '&': '&amp;',
        '"': '&quot;',
        '>': '&gt;',
        "'": '&#39;'
      }[a]
    }
  }) : '';
}

exports.getThumbUrl = (imgUrl, width = 750, height = 750, quality = 100) => {
  if (! imgUrl) {
    return null;
  }
  let con = imgUrl.indexOf('?') !== -1 ? encodeURIComponent('|') : '?';
  return `${imgUrl}${con}imageView2/1/w/${width}/h/${height}/interlace/1/quality/${quality}`;
}

exports.timeFormatISO = (value) => {

  let date = new Date(value),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth() < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1,
    day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate(),
    hour = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours(),
    minute = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes(),
    second = date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds(),
    millisecond = date.getUTCMilliseconds() < 10 ? '0' + date.getUTCMilliseconds() : date.getUTCMilliseconds()

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;
}

// 从文本中提取出@username 标记的用户名数组
exports.fetchUsers = (text) => {

  if (! text) {
    return [];
  }

  var ignoreRegexs = [
    /```.+?```/g, // 去除单行的 ```
    /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
    /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
    /^\s{4}.*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
    /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
    /\[@.+?\]\(\/.+?\)/g // 已经被 link 的 username
  ];

  ignoreRegexs.forEach((regex) => {
    text = text.replace(regex, '');
  });

  let results = text.match(/@[a-z0-9\-_]+\b/igm);
  let names = [];

  if (results) {
    for (let i = 0, l = results.length; i < l; i++) {
      let s = results[i];
      // remove leading char @
      s = s.slice(1);
      names.push(s);
    }
  }

  // names = _.uniq(names);
  return names;
};

exports.linkUsers = (text) => {

  let users = exports.fetchUsers(text);

  for (let i = 0, l = users.length; i < l; i++) {
    let name = users[i];
    text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
  }

  return text;
}

/**
 *   对Date的扩展，将 Date 转化为指定格式的String
 *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *   例子：
 *   (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 *   (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 */
exports.fmtDate = (date, fmt) => {

  let o = {
    'M+': date.getMonth() + 1,
    // 月份
    'd+': date.getDate(),
    // 日
    'h+': date.getHours(),
    // 小时
    'm+': date.getMinutes(),
    // 分
    's+': date.getSeconds(),
    // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3),
    // 毫秒
    'S': date.getMilliseconds()
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (o[k])
        : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return fmt;
}

// 日期格式：2016-05-09 10:10:10
exports.timeFromNow = (date) => {

  // JS标准日期格式：将『-』替换为『/』
  date = date.replace(/\-/g, '/');

  let timestamp = Date.parse(new Date(date)) / 1000;
  let now = Date.parse(new Date()) / 1000;
  let time = now - timestamp;

  return time || 0;
}

// 日期格式：2016-05-09 10:10:10
exports.timeFormatForIndex = (date) => {

  let time = exports.timeFromNow(date);

  let str = '';

  if (! time) {
    return str;
  }

  if (time < 60) {
    str = parseInt(time, 10) + ' 秒前';
  } else if (time < 180) {
    str = '刚刚';
  } else if (time < 3600) {
    str = parseInt(time / 60.0, 10) + ' 分钟前';
  } else if (time < 86400) {
    str = parseInt(time / 3600.0, 10) + ' 小时前';
  } else if (time < 86400 * 3) {
    str = parseInt(time / 86400.0, 10) + ' 天前';
  } else {
    str = date.substring(0, 10);
  }

  return str;
}

// 日期格式：2016-05-09 10:10:10
exports.timeFormatForDetail = (date) => {

  let time = exports.timeFromNow(date);

  let str = '';

  if (! time) {
    return str;
  }

  if (time < 60) {
    str = parseInt(time, 10) + ' 秒前';
  } else if (time < 180) {
    str = '刚刚';
  } else if (time < 3600) {
    str = parseInt(time / 60.0, 10) + ' 分钟前';
  } else if (time < 86400) {
    let now = new Date();
    let today = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    // JS标准日期格式：将『-』替换为『/』
    date = date.replace(/\-/g, '/');
    // 今天
    if (Date.parse(date) >= Date.parse(today)) {
      str = '今天 ' + date.substring(11, 16);
    // 昨天
    } else {
      str = '昨天 ' + date.substring(11, 16);
    }
  } else {
    str = date.substring(0, 10);
  }

  return str;
}

exports.timeFormatFull = (date) => {

  // 日期格式：2016-05-09 10:10:10
  let time = exports.timeFromNow(date);

  let str = '';

  if (! time) {
    return str;
  }

  if (time < 60) {
    str = parseInt(time, 10) + ' 秒前';
  } else if (time < 180) {
    str = '刚刚';
  } else if (time < 3600) {
    str = parseInt(time / 60.0, 10) + ' 分钟前';
  } else if (time < 86400) {
    str = parseInt(time / 3600.0, 10) + ' 小时前';
  } else if (time < 86400 * 30) {
    str = parseInt(time / 86400.0, 10) + ' 天前';
  } else if (time < 86400 * 365) {
    str = parseInt(time / (86400.0 * 30), 10) + ' 个月前';
  } else {
    str = date.substring(0, 16);
  }

  return str;
}

// 将deeplink转为可点击的url
exports.transDeepLinks = (url) => {
  if (url.indexOf('stayapp://hotel_exp/') !== -1) {
    return '/feed/1/' + exports.strReplace('stayapp://hotel_exp/', '', url);
  } else if (url.indexOf('stayapp://article/') !== -1) {
    return '/feed/2/' + exports.strReplace('stayapp://article/', '', url);
  } else if (url.indexOf('stayapp://user/') !== -1) {
    return '/user/' + exports.strReplace('stayapp://user/', '', url);
  } else if (url.indexOf('stayapp://hotel/') !== -1) {
    return '/hotel/' + exports.strReplace('stayapp://hotel/', '', url);
  } else if (url.indexOf('stayapp://membership/') !== -1) {
    return '/membership/' + exports.strReplace('stayapp://membership/', '', url);
  } else {
    // 解决微信公众号内跳微信图文在iOS上无法返回的BUG（链接末尾加锚点 #wechat_redirect）
    return exports.strReplace(['#wechat_redirect', '#rd'], '', url) + '#wechat_redirect';
  }
}