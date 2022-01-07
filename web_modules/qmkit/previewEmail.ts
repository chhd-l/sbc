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


export const wrapperEmailTemp = (temp: string = '') => {
  const JSTemp = '<script>const _tempOutBox=document.querySelector("#enhance-email-box");const _tempPhraseKeys=_tempOutBox.querySelectorAll("[phrase]");const _tempLayerBox=document.createElement("div");_tempLayerBox.style.display="none";_tempLayerBox.style.position="fixed";_tempLayerBox.style.padding="6px 12px";_tempLayerBox.style.boxShadow="0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d";_tempLayerBox.style.backgroundColor="#fff";_tempLayerBox.style.borderRadius="2px";_tempLayerBox.style.color="#333";_tempLayerBox.style.fontSize="14px";_tempLayerBox.style.zIndex="10000";_tempOutBox.appendChild(_tempLayerBox);const _tempLayerMessage=(e)=>{const msgBox=document.createElement("div");msgBox.style.position="fixed";msgBox.style.top="10px";msgBox.style.left="0";msgBox.style.right="0";msgBox.style.margin="0 auto";msgBox.style.padding="10px 16px";msgBox.style.width="220px";msgBox.style.boxShadow="0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d";msgBox.style.borderRadius="2px";msgBox.style.fontSize="14px";msgBox.style.backgroundColor="#fff";msgBox.innerText=e;_tempOutBox.appendChild(msgBox);setTimeout(()=>{_tempOutBox.removeChild(msgBox)},1500)};const _tempAddMouseOver=(e)=>{e.target.style.backgroundColor="#f3f3f3";_tempLayerBox.style.display="block";_tempLayerBox.innerText=e.target.attributes.phrase.value};const _tempAddMouseLeave=(e)=>{e.target.style.backgroundColor="";_tempLayerBox.style.display="none";_tempLayerBox.innerText=""};const _tempAddClick=(e)=>{const phraseKey=e.target.attributes.phrase.value;const input=document.createElement("input");input.value=phraseKey;_tempOutBox.appendChild(input);input.select();document.execCommand("copy");_tempOutBox.removeChild(input);_tempLayerMessage("Copy Command to Clipboard")};const addMouseMove=(e)=>{const{clientX,clientY}=e;_tempLayerBox.style.left=clientX+10+"px";_tempLayerBox.style.top=clientY+10+"px"};_tempPhraseKeys.forEach(el=>{el.removeEventListener("mouseover",_tempAddMouseOver);el.addEventListener("mouseover",_tempAddMouseOver);el.removeEventListener("mouseleave",_tempAddMouseLeave);el.addEventListener("mouseleave",_tempAddMouseLeave);el.removeEventListener("click",_tempAddClick);el.addEventListener("click",_tempAddClick)});_tempOutBox.removeEventListener("mousemove",addMouseMove);_tempOutBox.addEventListener("mousemove",addMouseMove);<\/script>';
  return `<div id="enhance-email-box">${temp}${JSTemp}</div>`;
}

export const enhanceEmailTemp = () => {
  const container = document.querySelector('#enhance-email-box');
  if (!container) {
    return;
  }
  const jsContent = container.querySelector('script');
  container.removeChild(jsContent);
  const dynamicScript = document.createElement('script');
  dynamicScript.innerHTML = jsContent.innerHTML;
  container.appendChild(dynamicScript);
}