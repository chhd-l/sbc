/**
 * 国际化语言如何新增?
 * 1、与后端约定新增语言的 key 名, 如 en-US
 * 2、本地新增 multiLang_antd.ts 的对应 key 国际化语言  如 en-US
 * 3、在Phrase APP 上面 store-portal 项目, 增加对应 key 的 国际化语言 如 en-US
 *
 * 国际化中如何新增翻译?
 * 登录 https://app.phrase.com/account/login
 * 账户 minytang@deloitte.com.cn
 * 密码 Test1106,,,^^^^^^
 * 找到项目 store-portal 选择对应的语言, 如 en-US,  新增一个key即可
 *
 * 注意
 * 1、phrase 语言, 几个环境共用, 不要随意修改内容
 * 2、每次发布生产环境前 需要将 phrase app -> store-portal 的 en-US英语翻译 拷贝到 en-US.ts中
 *    这样即使 phrase 的语言拉取失败，页面也可以使用本地的 en-US 翻译展示
 *
 * */

import { cache, Const } from 'qmkit';
import enUSLang from './files/en-US';
import antdLang from './files/multiLang_antd';

let language: any = enUSLang;
const antLanguage: any = antdLang;
const key = localStorage.getItem(cache.LANGUAGE) || 'en-US';

function RCi18n({ id }) {
  return language[id] || id;
}

function assignObj(obj, source) {
  const retObj = { ...obj };

  for (const [key, value] of Object.entries(source)) {
    retObj[key] = value ? value : obj[key];
  }

  return retObj;
}

async function getDynamicLanguage() {
  const url = `https://api.phrase.com/v2/projects/${Const.PHRASE_PROJECT_ID}/locales/${key}/download?access_token=31950e3e49b165b8b2c604b65574e6cf279d9ea395e3718ce52b1ec335bef6e5&include_empty_translations=true&file_format=node_json`;

  let retRes = JSON.parse(window.localStorage.getItem('PHRASE_LANGUAGE')) || {};

  await fetch(url, {
    method: 'get',
    mode: 'cors',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      return res.ok ? res.json() : false;
    })
    .then((resJson) => {
      if (resJson) {
        retRes = resJson;
        window.localStorage.setItem('PHRASE_LANGUAGE', JSON.stringify(retRes));
      }
    })
    .catch((err) => {
      console.log('phrase language fetch error', err);
    });

  language = assignObj(enUSLang, retRes);

  return language;
}

export { language, antLanguage, RCi18n, getDynamicLanguage };
