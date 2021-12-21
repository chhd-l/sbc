/**
 * antd组件多语言文件引入
 * 根据当前店铺加载对应的antd多语言文件
 */
import de from 'antd/es/locale/de_DE';
import enUS from 'antd/es/locale/en_US';
import es from 'antd/es/locale/es_ES';
import fr from 'antd/es/locale/fr_FR';
import ru from 'antd/es/locale/ru_RU';
import sv from 'antd/es/locale/sv_SE';
import tr from 'antd/es/locale/tr_TR';
import { cache } from 'qmkit';

const antdMultiLang = {
  mx: enUS,
  de: de,
  fr: fr,
  'en-US': enUS,
  ru: ru,
  tr: tr,
  es:es,
  sv:sv,
  default: enUS,
};

export default antdMultiLang[localStorage.getItem(cache.LANGUAGE)||'default']
