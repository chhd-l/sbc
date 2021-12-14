import Handlebars from 'handlebars';
import SendSay from './sendsay';
import { cache } from './index';


Handlebars.registerHelper('equals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function(arg1, options) {
  return arg1.length;
});
Handlebars.registerHelper('greaterThan', function(arg1, arg2, options) {
  return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function(fn) {
  return ('');
});


export const getPreviewEmailTemp = (temp: string = '', data: object = {}) => {
  let template = null;

  // 邮件模板 俄罗斯用的是SendSay 其他国家用的是SendGrid
  // SendGrid 可以用 handlebar.js 来编译解析模板
  // SendSay 转换是参考 template.js 编写的
  if ((window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId']] === 'ru') {
    template = new SendSay(temp, { anketa: { params: { ...data } } }).getTemplate();
  } else {
    template = Handlebars.compile(temp)(data);
  }

  return template;
};