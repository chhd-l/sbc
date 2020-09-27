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
import { routeWithSubRoutes, history, noop, cache } from 'qmkit';
import { homeRoutes } from './router';
import 'regenerator-runtime/runtime';
import store from './redux/store';
import './index.less';
import Main from './main';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { IntlProvider } from 'react-intl';
import es_ES from '../web_modules/qmkit/es_ES';
import configOkta from '../web_modules/qmkit/config-okta';

moment.locale('zh-cn');

const PrescriberRouter = () => (
  <IntlProvider locale="es" messages={es_ES}>
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
  <IntlProvider locale="es" messages={es_ES}>
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

switchRouter(sessionStorage.getItem(cache.OKTA_ROUTER_TYPE))

export function switchRouter (type: string) {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  if(type === 'staff') {
    ReactDOM.render(<RcRouter />, document.getElementById('root'));
  } else {
    ReactDOM.render(<PrescriberRouter />, document.getElementById('root'));
  }
}
