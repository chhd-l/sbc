
import { cache, Const } from 'qmkit';

const context = (require as any).context('./files', true, /\.ts$/);
const importAll = context => {
  const map = {};
  for (const key of context.keys()) {
    const keyArr = key.split('/');
    keyArr.shift(); // 移除.
    map[keyArr.join('.').replace(/\.ts$/g, '')] = context(key).default || context(key);
  }
  return map;
};

let key = localStorage.getItem(cache.LANGUAGE) || 'en-US';
let langFile = importAll(context);
let language: any = langFile[key];
let antLanguage: any = langFile[key + '_antd'];


function RCi18n({ id }) {
  return language[id] || id;
}

function assignObj(obj, source) {
  const retObj = {...obj};

  for (const [key, value] of Object.entries(source)) {
    retObj[key] = value ? value : obj[key]
  }

  return retObj
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
  }).then(res => {

    return res.ok ? res.json() : false;

  }).then(resJson => {

    if (resJson) {
      retRes = resJson;
      window.localStorage.setItem('PHRASE_LANGUAGE', JSON.stringify(retRes));
    }

  }).catch((err) => {
    console.log('phrase langugage fetch error', err);
  });

  language = assignObj(langFile[key], retRes);

  return language;
}


export {
  language,
  antLanguage,
  RCi18n,
  getDynamicLanguage
};
