import cache from "./cache";

// 校验规则常量
export default {
  // 手机号码
  phone: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/,
  //0.01~1之间的小数，eg:折扣率
  zeroOne: /(^0\.[1-9][0-9]{0,1}$)|(^0\.0[1-9]{1}$)|(^1((\.0)|(\.00))?$)/,
  //数字
  number: /^\d+$/,
  //正整数
  numbezz:/^[1-9]\d*$/,
  //价格 不能为0
  price: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.0[1-9]{1}$)|(^0\.[1-9][0-9]{0,1}$)/,
  //价格 可以为0
  zeroPrice: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  //数字,不包含0
  noZeroNumber: /^[1-9]\d{0,}$/,
  //9位数字,不包含0
  noZeroNineNumber: /^[1-9]\d{0,8}$/,
  //包含0且不以0开头的整数
  zeroNumber: /^(0|[1-9][0-9]*)$/,
  // 固定电话
  telephone: /(^\d{0,9}-\d{0,10}$)|(^\d{1,20}$)/,
  // 纳税人识别号
  tax: /^[A-Za-z0-9]{15,20}$/,
  // 银行户号
  bankNumber: /^\d{1,30}$/,
  //仅中文或英文，不允许含有数字
  noNumber: /^[a-zA-Z\u4E00-\u9FA5]*$/,
  //不允许含有特殊字符
  noChar: /^[0-9a-zA-Z\u4E00-\u9FA5]*$/,
  //有emoji表情
  emoji: /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/,
  //统一社会信用代码
  socialCreditCode: /^[A-Za-z0-9]{15,20}$/,
  //折扣率0.00-100.00, 可以为0
  discount: /^\d(\.\d{1,2})?$|^[1-9]\d(\.\d{1,2})?$|^100(\.(0){1,2})?$/,
  //邮箱
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  //排序合法数字 0-999
  sortNum: /^([1-9](\d{1,2})?)$|^0$/,
  //不允许输入中文
  noChinese: /^[^\u4e00-\u9fa5]{1,50}$/,
  //密码为6-16位字母或数字密码
  password: /^[0-9a-zA-Z]{6,16}$/,
  //1位小数
  singleDecimal: /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)|(^[0-9]\.[0-9]$)/,
  //0-9999999.99
  enterpriseRange:  /^(0|[1-9][0-9]{0,6})(\.([1-9]|[0-9][1-9]))?$/,
  //不能为负数
  noMinus: /^\d+(\.\d+)?$/,
  Retimes: undefined,
  validatePhoneNumber:()=>{
    let regExp=null;
    const COUNTRY= (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || '']
    console.log(COUNTRY)
    if (COUNTRY == 'fr') {
      // 法国
      regExp =
        /^\(\+[3][3]\)[\s](([0][1-9])|[1-9])[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}$/;
    } else if (COUNTRY == 'uk') {
      // 英国
      regExp =
        /^\(\+[4][4]\)[\s](([0][1-9][1-9])|[1-9][1-9])[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}$/;
    } else if (COUNTRY == 'us') {
      // 美国
      regExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    } else if (COUNTRY == 'mx') {
      // 墨西哥
      regExp = /^\+\([5][2]\)[\s\-][0-9]{3}[\s\-][0-9]{3}[\s\-][0-9]{4}$/;
    } else if (COUNTRY == 'ru') {
      // 俄罗斯
      regExp =
        /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    } else if (COUNTRY == 'tr') {
      // 土耳其
      regExp =
        /^0\s\(?([2-9][0-8][0-9])\)?\s([1-9][0-9]{2})[\-\. ]?([0-9]{2})[\-\. ]?([0-9]{2})(\s*x[0-9]+)?$/;
    } else {
      // 其他国家
      regExp = /\S/;
    }
    return regExp;
  }
};

