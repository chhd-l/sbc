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
import { routeWithSubRoutes, history, util, noop, getRoutType, RCi18n } from 'qmkit';
import { homeRoutes } from './router';
import store from './redux/store';
import './index.less';
import Main from './main';
import { ConfigProvider, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/sv';
import { IntlProvider } from 'react-intl';
import { cache } from 'qmkit';
import { language, antLanguage, getDynamicLanguage } from '../web_modules/qmkit/lang';
import enUSLang from '../web_modules/qmkit/lang/files/en-US';
import configOkta from '../web_modules/qmkit/config-okta';

let localeLang = localStorage.getItem(cache.LANGUAGE)||'en-US';
(window as any).RCi18n = RCi18n;


const lastLang = JSON.parse(window.localStorage.getItem('PHRASE_LANGUAGE')) || enUSLang;

const useDynamicLanguage = () => {
  const [loading, setLoading] = useState(false);
  const [dynamicLanguage, setDynamicLanguage] = useState({...lastLang});

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
  if (loading) {
    return (
      <div style={{position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Spin />
      </div>
    );
  }

  return (
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
  );
};

const RcRouter = () => {
  const [loading, dynamicLanguage] = useDynamicLanguage();
  if (loading) {
    return (
      <div style={{position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Spin />
      </div>
    );
  }
  
  return (
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
  )
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
