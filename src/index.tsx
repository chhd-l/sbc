// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import 'babel-polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Security} from '@okta/okta-react';
import { Provider } from 'react-redux';
import { routeWithSubRoutes, history, noop, getRoutType,RCi18n } from 'qmkit';
import { homeRoutes } from './router';
import store from './redux/store';
import './index.less';
import Main from './main';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/fr';
import 'moment/locale/es';
import { IntlProvider } from 'react-intl';
import {language,antLanguage} from '../web_modules/qmkit/lang';
import configOkta from '../web_modules/qmkit/config-okta';
moment.locale('zh-cn');

 (window as any).RCi18n=RCi18n;

const PrescriberRouter = () => (
  <IntlProvider locale="es" messages={language}>
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

const RcRouter = () => (
  <IntlProvider locale="es" messages={language}>
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
