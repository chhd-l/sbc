import React, { useEffect } from 'react';
import { Const, util } from 'qmkit';

export default function MarsFooter () {

  const getCookieBanner = () => {
    util.loadJS({
      url: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      dataSets: {
        domainScript: Const.ISPRODUCT?'18097cd9-5541-4f5f-98dc-f59b2b2d5730':'18097cd9-5541-4f5f-98dc-f59b2b2d5730-test',
        documentLanguage: 'true'
      }
    });
  }

  const getMarsFooter = () => {
    // 未登录不能区分国家，先不区分
    // let country =  (window as any)?.countryEnum[JSON.parse(sessionStorage?.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0]||''
    // let footerParamsMap ={
    //   'mx':'shop-royalcanin-mx',
    //   'de':'shop-royalcanin-de',
    // }
    // let footerParams = footerParamsMap[country]||'store-royalcanin-com'
    // util.loadJS({url: `https://footer.mars.com/js/footer.js.aspx?${footerParams}`})
    return util.loadJS({url: `https://footer.mars.com/js/footer.js.aspx?store-royalcanin-com`})
  }

  useEffect(() => {
    getCookieBanner();
    getMarsFooter();
    return () => {
      document.getElementById('mars-footer-panel')?.remove();
    };
  }, []);

  return null;
}
