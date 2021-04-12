import ruRU from 'antd/es/locale/ru_RU';
import enUS from 'antd/es/locale/en_US';
import deDE from 'antd/es/locale/de_DE';
import es_ES from '../es_ES';
import es_RUS from '../es_RUS';
import { cache } from 'qmkit';

const lang = (require as any).context('./files',true, /\.ts$/)

lang.keys().forEach(i => {
    
    console.log(i)
});

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