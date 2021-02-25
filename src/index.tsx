// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import 'babel-polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { Provider } from 'react-redux';
import { routeWithSubRoutes, history, noop, cache, getRoutType } from 'qmkit';
import { homeRoutes } from './router';
import store from './redux/store';
import './index.less';
import Main from './main';
import { ConfigProvider } from 'antd';
//import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { IntlProvider } from 'react-intl';
import es_ES from '../web_modules/qmkit/es_ES';
import es_RUS from '../web_modules/qmkit/es_RUS';
import configOkta from '../web_modules/qmkit/config-okta';
moment.locale('zh-cn');

let language = es_ES;
if(sessionStorage.getItem(cache.LANGUAGE) == 'English') {
  language = es_ES
}else if (sessionStorage.getItem(cache.LANGUAGE) == 'Russian') {
  language = es_RUS
}

const PrescriberRouter = () => (
  <IntlProvider locale="es" messages={language}>
    <ConfigProvider locale={enUS}>
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

const RcRouter = () => (
  <IntlProvider locale="es" messages={language}>
    <ConfigProvider locale={enUS}>
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
);

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
