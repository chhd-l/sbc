/*import 'core-js/es'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable'*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { routeWithSubRoutes, history, noop } from 'qmkit';
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

moment.locale('zh-cn');

const B2BBoss = () => (
  <IntlProvider locale="es" messages={es_ES}>
    <ConfigProvider locale={enUS}>
      <Provider store={store}>
        <Router history={history}>
          <div className="father">
            <Switch>
              {routeWithSubRoutes(homeRoutes, noop)}
              <Route component={Main} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </ConfigProvider>
  </IntlProvider>
);

ReactDOM.render(<B2BBoss />, document.getElementById('root'));
