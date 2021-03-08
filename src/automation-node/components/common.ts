import { Fonts } from 'qmkit';

export function substringName(name, limitOneRowLen, limitTotalLen) {
  let text = name;
  let textList = [];
  if (text) {
    textList = text.split('');
    let initNum = 0;
    for (let i = 1; i < text.length; i++) {
      if (i % limitOneRowLen == 0) {
        textList.splice(i + initNum, 0, '\n');
        initNum++;
      }
    }
    text = textList.join('');
    if (text.length > limitTotalLen) {
      text = text.substr(0, limitTotalLen) + '...';
    }
  }
  return text;
}

export function getBrowserType() {
  const userAgent = navigator.userAgent;
  const isOpera = userAgent.indexOf('Opera') > -1;
  if (isOpera) {
    return 'Opera';
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF';
  }
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  }
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return 'IE';
  }
  if (userAgent.indexOf('Trident') > -1) {
    return 'Edge';
  }
}

const icons = Fonts.glyphs.map((icon) => {
  return {
    name: icon.name,
    unicode: String.fromCodePoint(icon.unicode_decimal) // `\\u${icon.unicode}`,
  };
});
export function getIcon(type) {
  const matchIcon = icons.find((icon) => {
    return icon.name === type;
  }) || { unicode: '', name: 'default' };
  return matchIcon.unicode;
}
