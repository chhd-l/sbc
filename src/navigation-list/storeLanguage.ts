import * as webapi from './webapi';
import { cache, Const, history, util, Fetch } from 'qmkit';

export async function getStoreLanguages() {
  const { res } = await webapi.querySysDictionary({ type: 'Language' });
  let allLanguages = [...res.context.sysDictionaryVOS];

  const { res: storeRes } = await webapi.getStoreInfo();
  let store = storeRes.context;

  if (res.code === 'K-000000' && storeRes.code === 'K-000000') {
    if (store && store.languageId) {
      sessionStorage.setItem(cache.STORE_INFRO, JSON.stringify(store));
      let languages = [];
      store.languageId.map((item) => {
        let language = allLanguages.find((x) => x.id.toString() === item);
        languages.push(language);
      });
      sessionStorage.setItem(cache.STORE_LANGUAGES, JSON.stringify(languages));
      if (languages && languages.length > 0) {
        sessionStorage.setItem(cache.DEFAULT_LANGUAGE, languages[0].name);
      }
      return languages;
    }
  }

  return [];
}
