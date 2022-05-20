import Handlebars from 'handlebars';
import SendSay from './sendsay';
import { cache } from './index';

Handlebars.registerHelper('equals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function (arg1, options) {
  return arg1.length;
});
Handlebars.registerHelper('greaterThan', function (arg1, arg2, options) {
  return arg1 > arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function (fn) {
  return '';
});

export const getPreviewEmailTemp = (temp: string = '', data: object = {}) => {

  let template = null;

  // 邮件模板 俄罗斯用的是SendSay 其他国家用的是SendGrid
  // SendGrid 可以用 handlebar.js 来编译解析模板
  // SendSay 转换是参考 template.js 编写的
  if (
    (window as any).countryEnum[
      JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId']
    ] === 'ru'
  ) {
    template = new SendSay(temp, { anketa: { params: { ...data } } }).getTemplate();
  } else {
    if((window as any).countryEnum[
      JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId']
    ] === 'mx'){
      //这是是第一种写法 mx [de fr us tr se uk nl]
      template = Handlebars.compile(temp, data);
    }else{
      // 这是第二种  jp [de fr us tr se uk nl]
      template = Handlebars.compile(temp)(data);
    }
  }

  return template;
};


export class EnhanceEmailTemp {
  _tempOutBox = null;
  _bubble = null;
  _phraseKeys = [];

  constructor(el = document.body) {
    this._tempOutBox = el;
    this.createBubble();
  }

  init = () => {
    this.destroy();
    this._phraseKeys = this._tempOutBox.querySelectorAll('[phrase]');
    this._phraseKeys.forEach((el) => {
      if (el.nodeName === 'A') {
        el.setAttribute('href', 'javascript:;');
        el.removeAttribute('target');
      }
      el.addEventListener('mouseover', this._tempAddMouseOver);
      el.addEventListener('mouseleave', this._tempAddMouseLeave);
      el.addEventListener('click', this._tempAddClick);
    });
    this._phraseKeys.length &&
      this._tempOutBox.addEventListener('mousemove', this._tempAddMouseMove);
  };

  destroy = () => {
    this._tempOutBox.removeEventListener('mousemove', this._tempAddMouseMove);
    this._phraseKeys.forEach((el) => {
      el.removeEventListener('mouseover', this._tempAddMouseOver);
      el.removeEventListener('mouseleave', this._tempAddMouseLeave);
      el.removeEventListener('click', this._tempAddClick);
    });
  };

  createBubble = () => {
    const bubbleEl = document.createElement('div');
    bubbleEl.style.display = 'none';
    bubbleEl.style.position = 'fixed';
    bubbleEl.style.padding = '6px 12px';
    bubbleEl.style.boxShadow =
      '0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d';
    bubbleEl.style.backgroundColor = '#fff';
    bubbleEl.style.borderRadius = '2px';
    bubbleEl.style.color = '#333';
    bubbleEl.style.fontSize = '14px';
    bubbleEl.style.zIndex = '100001';
    document.body.appendChild(bubbleEl);
    this._bubble = bubbleEl;
  };

  layer = (message) => {
    const layerEl = document.createElement('div');
    layerEl.style.position = 'fixed';
    layerEl.style.top = '10px';
    layerEl.style.left = '0';
    layerEl.style.right = '0';
    layerEl.style.margin = '0 auto';
    layerEl.style.padding = '10px 16px';
    layerEl.style.width = '220px';
    layerEl.style.borderLeft = '2px solid #b7eb8f';
    layerEl.style.boxShadow =
      '0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d';
    layerEl.style.borderRadius = '2px';
    layerEl.style.fontSize = '14px';
    layerEl.style.backgroundColor = '#fff';
    layerEl.style.zIndex = '100002';
    layerEl.innerText = message;
    document.body.appendChild(layerEl);
    setTimeout(() => {
      document.body.removeChild(layerEl);
    }, 1500);
  };

  _tempAddMouseOver = (e) => {
    e.target.style.backgroundColor = '#b7eb8f';
    e.target.style.opacity = '.8';
    this._bubble.style.display = 'block';
    this._bubble.innerText = e.target.attributes.phrase.value;
  };

  _tempAddMouseLeave = (e) => {
    e.target.style.backgroundColor = '';
    e.target.style.opacity = '';
    this._bubble.style.display = 'none';
    this._bubble.innerText = '';
  };

  _tempAddClick = (e) => {
    const phraseKey = e.target.attributes.phrase.value;
    const input = document.createElement('input');
    input.value = phraseKey;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    this.layer('Copy Command to Clipboard');
  };

  _tempAddMouseMove = (e) => {
    const { clientX, clientY } = e;
    this._bubble.style.left = clientX + 10 + 'px';
    this._bubble.style.top = clientY + 10 + 'px';
  };
}
