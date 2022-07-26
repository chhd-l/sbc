import { cache, Const, history } from 'qmkit';
import CryptoJS from 'crypto-js';
/**
 * 判断用户是否登陆
 * @returns {boolean}
 */
export function isLogin() {
  let data = sessionStorage.getItem(cache.LOGIN_DATA);
  if (!data) {
    data = sessionStorage.getItem(cache.LOGIN_DATA);
  }

  if (!data) {
    return false;
  }
  //解析数据
  // 全局保存token
  (window as any).token = JSON.parse(data).token;
  return (window as any).token != null;
}

/**
 * 是否第三方店铺
 * companyType==0 平台自营, companyType==1 第三方商家
 */
export function isThirdStore() {
  if (window.companyType == undefined) {
    const data = sessionStorage.getItem(cache.LOGIN_DATA);
    window.companyType = JSON.parse(data).companyType;
  }
  return window.companyType == 1;
}

/**
 * 将信息脱敏
 * @param str 需要被脱敏的字符串
 * @param {number} beginNum 从第几位开始脱敏,后面也保留几位(默认第4位)
 * @param {number} n 脱敏几个字符
 * @returns {String} 脱敏之后的字符串
 */
export function desensitizeStr(str, beginNum = 4, n = 4) {
  // str不存在 或者 位数小于beginNum位,直接返回(不脱敏)
  if (!str || str.length < beginNum) {
    return str;
  } else {
    let secretStr = '';
    for (let i = 0; i < n; i++) {
      secretStr = secretStr.concat('*');
    }
    return `${str.substring(0, beginNum)}${secretStr}${str.substring(
      str.length - beginNum,
      str.length
    )}`;
  }
}

/**
 * Base64加密
 */
export function Base64() {
  const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const _keyStrUrl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';
  this.encode = function (input) {
    return encodebase(input, _keyStr);
  };

  // public method for decoding
  this.decode = function (input) {
    return decodebase(input, _keyStr);
  };

  this.urlEncode = function (input) {
    //将/号替换为_  将+号替换为-  后端采用 new String(Base64.getUrlDecoder().decode(encrypted.getBytes())) 进行解码
    return encodebase(input, _keyStrUrl);
  };

  this.urlDecode = function (input) {
    //将_号替换为/ 将-号替换为+
    return decodebase(input, _keyStrUrl);
  };

  const encodebase = (input, _keyStr) => {
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }
    return output;
  };

  const decodebase = (input, _keyStr) => {
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  };

  // private method for UTF-8 encoding
  const _utf8_encode = (string) => {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };

  // private method for UTF-8 decoding
  const _utf8_decode = (utftext) => {
    let string = '';
    let i = 0;
    let c,
      c2,
      c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  };
}

/**
 * 日期格式化
 * @param date
 * @returns {string}
 */
export function formateDate(date: Date) {
  //月份或者date小于10的时候，前面要加0
  return (
    date.getFullYear() +
    '-' +
    formateMonth(date.getMonth() + 1) +
    '-' +
    formateMonth(date.getDate())
  );
}

/**
 * 格式化小于10的数
 * @param num
 */
export function formateMonth(num: number) {
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
}

/**
 * 除法计算百分比,保留两位小数
 * @param a
 * @param b
 * @returns {string}
 */
export function devision(a, b) {
  if (b == 0) {
    return 0;
  } else {
    return ((parseInt(a) * 100) / parseInt(b)).toFixed(2) + '%';
  }
}

export function formateMoney(money) {
  if (money) {
    return sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + money.toFixed(2);
  } else {
    return sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + '0.00';
  }
}

/**
 * 商品统计排序名称枚举
 * @param sortCol
 */
export function getSortCol(sortCol) {
  let sortName = '';
  switch (sortCol) {
    //下单笔数
    case '0':
      sortName = 'orderCount';
      break;
    //下单金额
    case '1':
      sortName = 'orderAmt';
      break;
    //下单件数
    case '2':
      sortName = 'orderNum';
      break;
    //付款商品数
    case '3':
      sortName = 'payNum';
      break;
    //退单笔数
    case '4':
      sortName = 'returnOrderCount';
      break;
    //退单金额
    case '5':
      sortName = 'returnOrderAmt';
      break;
    //退单件数
    case '6':
      sortName = 'returnOrderNum';
      break;
    //转化率
    case '7':
      sortName = 'orderConversion';
      break;
    default:
      sortName = 'orderNum';
      break;
  }
  return sortName;
}

/**
 * 商品统计排序类型枚举
 * @param sortType
 * @returns {string|string}
 */
export function getSortType(sortType) {
  let sortOrder = sortType == 1 ? 'descend' : 'ascend';
  return sortOrder;
}

/**
 * 渲染钱
 *  接受负数，负数分两种
 *  1。显示上的负数，比如平台佣金，相对于商家，显示负数
 *  2。真实运算中出现的负数
 *
 * @param value 钱数值
 * @param asMinus 是否显示为负数（比如平台佣金）
 * @param showPlus 正值是否加上+号，比如特价价格上调
 * @return {any}
 */
export function FORMAT_YUAN(value, asMinus = false, showPlus = false) {
  if (isNaN(value)) {
    return value;
  } else {
    value = +value;
    if (asMinus) {
      value = -value;
    }
    if (value < 0) {
      return `-${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + Math.abs(value).toFixed(2)}`;
    } else {
      if (showPlus && value != 0) {
        return `+${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + value.toFixed(2)}`;
      } else {
        return `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + value.toFixed(2)}`;
      }
    }
  }
}

/**
 * require获取图片的时候，如果本地图片不存在，直接报错，页面白屏，做一个try-catch
 * @param srcPath
 * @returns {null}
 */
export function requireLocalSrc(srcPath) {
  let icon = null;
  try {
    icon = require(`./images/${srcPath}`);
  } catch (err) {
    //console.warn('本地图片加载失败 ----> ', err);
  }
  return icon;
}

/**
 * 清除缓存并跳转登录页
 */

export function logout() {
  const accountName = sessionStorage.getItem(cache.LOGIN_DATA)
    ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).accountName
    : '';
  window.token = null;
  localStorage.removeItem(cache.LOGIN_DATA);
  localStorage.removeItem(cache.DATA_BOARD.concat(accountName));
  sessionStorage.clear();
}

/**
 * 邮箱验证
 */
export function checkEmail(str) {
  let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

/**
 * antd 邮箱验证
 */
export function checkEmailWithAntd(str) {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}

//set children data, 递归取Childre
export function setChildrenData(source) {
  var rootParnets = source.filter((x) => !x.parentId);
  var cycleData = this.cycleBuild(rootParnets, source);
  return cycleData;
}

export function cycleBuild(list, source) {
  var sortList = list.sort((x1, x2) => x1.sort - x2.sort);
  sortList.map((item, index) => {
    var children = source.filter((x) => x.parentId === item.id);
    if (children.length > 0) {
      item.children = children;
      this.cycleBuild(children, source);
    } else {
      return item;
    }
  });
  return sortList;
}

export const isMobileApp = () => {
  const devices = navigator.userAgent.toLowerCase();
  return /iphone/.test(devices) || /android/.test(devices);
};
//导出方法
export const onExport = (params, downloadUrl) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      let base64 = new Base64();
      const token = (window as any).token;
      if (token) {
        let result = JSON.stringify({ ...params, token: token });
        let encrypted = base64.urlEncode(result);

        // 新窗口下载
        const exportHref = Const.HOST + `${downloadUrl}/${encrypted}`;
        window.open(exportHref);
      }
      resolve();
    }, 500);
  });
};
/**
 * 加载js
 * @param fn 执行函数
 * @param url 加载链接
 *
 */
interface PropsLoadJS {
  url: string;
  callback?: () => void;
  dataSets?: any;
  code?: string;
  className?: string;
  type?: string;
  id?: string;
}
export const loadJS = ({
  url,
  callback = function () {},
  dataSets,
  code,
  className,
  type,
  id
}: PropsLoadJS) => {
  var script = document.createElement('script');

  if (className) {
    script.className = className;
  }
  script.type = type || 'text/javascript';

  if (id) {
    script.id = id;
  }

  if (dataSets) {
    for (let key in dataSets) {
      script.dataset[key] = dataSets[key];
    }
  }
  if (code) {
    script.innerHTML = code;
  }
  //IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //其他浏览器
    script.onload = function () {
      callback();
    };
  }
  if (url) {
    script.src = url;
  }
  document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 *
 * @param aseKey 密钥
 * @param message 内容
 * @returns
 */
export function encryptAES(message, aseKey = 'AYHRJqH1zrfgWuKL3mN5xQQhSs7Srd62') {
  var encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encrypt;
}
/**
 *
 * @param aseKey 密钥
 * @param encrypt 加密字符串
 * @returns
 */
export function decryptAES(encrypt, aseKey = 'AYHRJqH1zrfgWuKL3mN5xQQhSs7Srd62') {
  var decrypt = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
  return decrypt;
}

/**
 * 通过添加CDN前缀和width优化图片size
 * @param originImageUrl 源图片url
 * @param width width 默认150
 * @param height height 默认等于width
 * @returns
 */
export function optimizeImage(
  originImageUrl: string,
  width: number = 150,
  height?: number | string
): string {
  const CDN_PREFIX =
    sessionStorage.getItem(cache.PRODUCT_IMAGE_CDN) ||
    'https://d2c-cdn.royalcanin.com/cdn-cgi/image/';
  return originImageUrl &&
    originImageUrl.startsWith('http') &&
    !originImageUrl.startsWith(CDN_PREFIX)
    ? `${CDN_PREFIX}width=${width},h=${height ?? width}/${originImageUrl}`
    : originImageUrl;
}

/**
 * 获取随机数
 */
export function getRandomValues() {
  return Math.rdmValue();
}
