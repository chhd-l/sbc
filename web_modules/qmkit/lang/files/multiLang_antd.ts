/**
 * antd组件多语言文件引入
 * 根据当前店铺加载对应的antd多语言文件
 */
import { cache } from 'qmkit';
import de from 'antd/es/locale/de_DE';
import enUS from 'antd/es/locale/en_US';
import es from 'antd/es/locale/es_ES';
import fr from 'antd/es/locale/fr_FR';
import ru from 'antd/es/locale/ru_RU';
import sv from 'antd/es/locale/sv_SE';
import bg from 'antd/es/locale/bg_BG';
import tr from 'antd/es/locale/tr_TR';
import hr from 'antd/es/locale/hr_HR';
import cz from 'antd/es/locale/cs_CZ';
import dk from 'antd/es/locale/da_DK';
import nl from 'antd/es/locale/nl_NL';
import ee from 'antd/es/locale/et_EE';
import fi from 'antd/es/locale/fi_FI';
import gr from 'antd/es/locale/el_GR';
import hu from 'antd/es/locale/hu_HU';
import ie from 'antd/es/locale/ga_IE';
import it from 'antd/es/locale/it_IT';
import jp from 'antd/es/locale/ja_JP';
import lv from 'antd/es/locale/lv_LV';
// import lt from 'antd/es/locale/lt_LT'; //3.0版本的antd没有，4版本有
import lt from 'antd/es/locale/en_US';
import mt from 'antd/es/locale/en_US'; // mt Malta 马其他 antd没有
import pl from 'antd/es/locale/pl_PL';
import pt from 'antd/es/locale/pt_PT';
import ro from 'antd/es/locale/ro_RO';
import sk from 'antd/es/locale/sk_SK';
import si from 'antd/es/locale/sl_SI'
const antdMultiLang = {
  mx: enUS,
  de: de,
  fr: fr,
  'en-US': enUS,
  ru: ru,
  tr: tr,
  es: es,
  sv:sv,
  'bg-BG':bg,
  "hr-HR":hr,
  "cs-CZ":cz,
  "da-DK":dk,
  "nl-NL":nl,
  "et-EE":ee,
  "fi-FI":fi,
  "el-GR":gr,
  "hu-HU":hu,
  "ga-IE":ie,
  "it-IT":it,
  "ja-JP":jp,
  "lv-LV":lv,
  "lt-LT":lt,
  "mt-MT":mt,
  "pl-PL":pl,
  "pt-PT":pt,
  'ro-RO':ro,
  "sk-SK":sk,
  'sl-SI':si
};

const key = localStorage.getItem(cache.LANGUAGE) || 'en-US';

const antdLang = antdMultiLang[key] || antdMultiLang['en-US'];

export default antdLang;
