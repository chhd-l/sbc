// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import 'babel-polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import { Provider } from 'react-redux';
import { routeWithSubRoutes, history, util, noop, getRoutType, RCi18n, Const } from 'qmkit';
import { homeRoutes } from './router';
import store from './redux/store';
import './index.less';
import Main from './main';
import { ConfigProvider, Spin } from 'antd';
import { useRequest } from 'ahooks';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/sv';
import 'moment/locale/ja';
import { IntlProvider } from 'react-intl';
import { cache } from 'qmkit';
import { language, antLanguage, getDynamicLanguage } from '../web_modules/qmkit/lang';
import enUSLang from '../web_modules/qmkit/lang/files/en-US';
import configOkta from '../web_modules/qmkit/config-okta';
import MyvetrecoGuide from './myvetreco-guide';

let localeLang = localStorage.getItem(cache.LANGUAGE) || 'en-US';
(window as any).RCi18n = RCi18n;

const lastLang = JSON.parse(window.localStorage.getItem('PHRASE_LANGUAGE')) || enUSLang;
// 如果需要weebpicker展示设置和美国标准一致，则需要调用下面api设置
// moment.updateLocale(antLanguage.locale, {
//   week: {
//     dow: 0,
//     doy: 6
//   }
// });

const useDynamicLanguage = () => {
  const [loading, setLoading] = useState(false);
  const [dynamicLanguage, setDynamicLanguage] = useState({ ...lastLang });

  useEffect(() => {
    async function getLanguage() {
      setLoading(window.location.pathname !== '/login');
      const lang = await getDynamicLanguage();
      setDynamicLanguage(lang);
      setLoading(false);
    }
    getLanguage();
  }, []);

  return [loading, dynamicLanguage];
};

const PrescriberRouter = () => {
  const [loading, dynamicLanguage] = useDynamicLanguage();

  return (
    <>
      <MyvetrecoGuide />
      <IntlProvider locale="es" messages={dynamicLanguage}>
        <ConfigProvider locale={antLanguage}>
          <Provider store={store}>
            <Router history={history}>
              <Security {...configOkta.prescrberOidc}>
                <div className="father">
                  <Switch>
                    {routeWithSubRoutes(homeRoutes, noop)}
                    <Route component={Main} />
                  </Switch>
                </div>
              </Security>
            </Router>
          </Provider>
        </ConfigProvider>
      </IntlProvider>

      {loading && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1234567890,
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff'
          }}
        >
          <Spin />
        </div>
      )}
    </>
  );
};

const RcRouter = () => {
  const [loading, dynamicLanguage] = useDynamicLanguage();

  return (
    <>
      <IntlProvider locale={localeLang} messages={dynamicLanguage}>
        <ConfigProvider locale={antLanguage}>
          <Provider store={store}>
            <Router history={history}>
              <Security {...configOkta.RcOidc}>
                <div className="father">
                  <Switch>
                    {routeWithSubRoutes(homeRoutes, noop)}
                    <Route component={Main} />
                  </Switch>
                </div>
              </Security>
            </Router>
          </Provider>
        </ConfigProvider>
      </IntlProvider>

      {loading && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1234567890,
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff'
          }}
        >
          <Spin />
        </div>
      )}
    </>
  );
};

switchRouter();

export function switchRouter() {
  let type = getRoutType(window.location.search);
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  if (type === 'staff') {
    ReactDOM.render(<RcRouter />, document.getElementById('root'));
  } else {
    ReactDOM.render(<PrescriberRouter />, document.getElementById('root'));
  }
}
