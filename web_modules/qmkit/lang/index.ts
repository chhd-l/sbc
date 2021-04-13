import ruRU from 'antd/es/locale/ru_RU';
import enUS from 'antd/es/locale/en_US';
import deDE from 'antd/es/locale/de_DE';
import es_ES from '../es_ES';
import es_RUS from '../es_RUS';
import { cache } from 'qmkit';

const context = (require as any).context('./files',true, /\.ts$/)

const importAll = context => {
    const map = {}
  
    for (const key of context.keys()) {
      const keyArr = key.split('/')
      keyArr.shift() // 移除.
      map[keyArr.join('.').replace(/\.ts$/g, '')] = context(key)
    }
  
    return map
  }

 let langFile= importAll(context)

 console.log(langFile)



let language: any = es_ES;
let antLanguage: any = enUS;
if (sessionStorage.getItem(cache.LANGUAGE) == 'English') {
    language = es_ES;
    antLanguage = enUS;
} else if (sessionStorage.getItem(cache.LANGUAGE) == 'Russian') {
    language = es_RUS;
    antLanguage = ruRU;
} else if (sessionStorage.getItem(cache.LANGUAGE) == 'Russian') {
    language = es_RUS;
    antLanguage = deDE;
}

export  {
    language,
    antLanguage
}