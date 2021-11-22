import React from 'react';
import {Layout, message, Spin, Icon} from 'antd';
import { routeWithSubRoutes, MyHeader, MyLeftLevel1, MyLeftMenu, Fetch, util, history, Const, cache, LoadingForRC, LoadingForMyvetreco } from 'qmkit';
import { routes, auditDidNotPass } from './router';
import { LogoLoadingIcon } from 'biz';
import ErrorBoundary from '../web_modules/qmkit/errorBoundary';
import UUID from 'uuid-js';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
const { Content } = Layout;

Spin.setDefaultIndicator(Const.SITE_NAME === 'MYVETRECO' ? <LoadingForMyvetreco /> : <LoadingForRC />);

export default class Main extends React.Component<any, any> {
  _menu: any;

  constructor(props) {
    super(props);
    this.state = {
      // 当前浏览器地址匹配的路由path
      matchedPath: '',
      hasError: false,
      uuid: '',
      loading: false,
    };
    (window as any).countryEnum = {
      123456858: 'mx',
      123457907: 'ru',
      123457908: 'de',
      123457909: 'fr',
      123457910: 'us',
      123457911: 'tr',
      123457916: 'uk'
    };
    (window as any).goodsCount = {
      123456858: 20,
      123457907: 20,
      123457908: 20,
      123457909: 20,
      123457910: 20,
      123457911: 10,
      123457916: 20
    };
    (window as any).rchistory = history;
  }

  UNSAFE_componentWillMount() {
    if (this.props.location.pathname != '/implicit/callback') {
      Fetch('/baseConfig')
        .then((resIco: any) => {
          if (resIco.res.code == Const.SUCCESS_CODE) {
            if ((resIco.res as any).defaultLocalDateTime) {
              sessionStorage.setItem('defaultLocalDateTime', (resIco.res as any).defaultLocalDateTime);
            }
            // const ico = (resIco.res.context as any).pcIco ? JSON.parse((resIco.res.context as any).pcIco) : null;
            // if (ico) {
            //   const linkEle = document.getElementById('icoLink') as any;
            //   linkEle.href = ico[0].url;
            //   linkEle.type = 'image/x-icon';
            // }
          }
        })
        .catch((err) => {});
      /*if (util.isLogin()) {
        Fetch('/initConfig/getConfig', { method: 'POST' }).then((resIco: any) => {
          if (resIco.res.code == Const.SUCCESS_CODE) {
            if ((resIco.res as any).context) {
              sessionStorage.setItem(cache.SYSTEM_GET_CONFIG, (resIco.res as any).context.currency.valueEn); //货币符号
              sessionStorage.setItem(cache.SYSTEM_GET_CONFIG_NAME, (resIco.res as any).context.currency.name); //货币名称
              sessionStorage.setItem(cache.MAP_MODE, (resIco.res as any).context.storeVO.prescriberMap); //货币名称
              sessionStorage.setItem(cache.CURRENT_YEAR, (resIco.res as any).context.currentDate); //年
              sessionStorage.setItem(cache.SYSTEM_GET_WEIGHT, (resIco.res as any).context.weight.valueEn); //weight
            }
          }
        });
      }*/
    }
  }

  handlePathMatched = (path) => {
   let recommendation_params= JSON.parse(sessionStorage.getItem('recommendation_params')||'[]')

   if(recommendation_params.length===2){
    recommendation_params.shift()
   }
   recommendation_params.push(path)
   sessionStorage.setItem('recommendation_params',JSON.stringify(recommendation_params))
    this.setState({
      matchedPath: path
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location && this.props.location.pathname != '/implicit/callback') {
      // navigated!
      this.setState({
        matchedPath: nextProps.location.pathname
      });
    }
  }

  componentDidUpdate() {
    // 加一层判断，避免报错影响子组件渲染
    if (document.getElementById('page-content')) {
      document.getElementById('page-content').scrollTop = 0;
    }
  }

  openMainLoading = () => {
    this.setState({
      loading: true
    })
  }

  closeMainLoading = () => {
    this.setState({
      loading: false
    })
  }

  render() {
    let { loading } = this.state;
    //const mainLoadingIcon = <LogoLoadingIcon style={{ fontSize: 24 }} spin />;
    // this.props.text.d
    return (
      <div>
        <Spin
            spinning={loading}
        >
          <Layout>
            {/*头部*/}
            <MyHeader openMainLoading={this.openMainLoading} closeMainLoading={this.closeMainLoading} />
            <div className="layout-header"/>
            <Layout className="ant-layout-has-sider">
              {/*左侧一级菜单*/}
              <MyLeftLevel1 matchedPath={this.state.matchedPath} onFirstActiveChange={this._onFirstActiveChange} />
              {/*左侧二三级菜单*/}
              <MyLeftMenu matchedPath={this.state.matchedPath} onSecondActiveChange={this._onSecondActiveChange} ref={(menu) => (this._menu = menu)} />
              {/*右侧主操作区域*/}
              <ErrorBoundary uuid={this.state.uuid}>
                <Content>
                  <div className="main-content" id="page-content">
                    {routeWithSubRoutes(routes, this.handlePathMatched)}
                    {routeWithSubRoutes(auditDidNotPass, this.handlePathMatched)}
                    <div style={styles.copyright}>
                      &copy; {Const.SITE_NAME === 'MYVETRECO' ? 'MyVetReco' : `Royal Canin SAS ${moment().format('YYYY')}`}
                    </div>
                  </div>
                </Content>
              </ErrorBoundary>
            </Layout>
          </Layout>
        </Spin>
      </div>
    );
  }

  /**
   * 头部的一级菜单刷新后,初始化左侧菜单的展开菜单状态
   * @private
   */
  _onFirstActiveChange = () => {
    const uuid = UUID.create().toString();
    this.setState({
      hasError: false,
      uuid
    });
    this._menu._openKeysChange(['0']);
  };
  _onSecondActiveChange = () => {
    const uuid = UUID.create().toString();
    this.setState({
      hasError: false,
      uuid
    });
  };
}

const styles = {
  wrapper: {
    backgroundColor: '#f5f5f5',
    height: 'calc(100vh - 64px)',
    position: 'relative',
    overflowY: 'auto'
  },
  copyright: {
    height: 48,
    lineHeight: '60px',
    textAlign: 'center',
    color: '#999'
  }
} as any;
