import React from 'react';
import { Layout, message } from 'antd';
import { routeWithSubRoutes, MyHeader, MyLeftLevel1, MyLeftMenu, Fetch, util, history, Const, cache } from 'qmkit';
import { routes, auditDidNotPass } from './router';
import ErrorBoundary from '../web_modules/qmkit/errorBoundary';
import UUID from 'uuid-js';
import { FormattedMessage } from 'react-intl';
const { Content } = Layout;
export default class Main extends React.Component<any, any> {
  _menu: any;

  constructor(props) {
    super(props);
    this.state = {
      // 当前浏览器地址匹配的路由path
      matchedPath: '',
      hasError: false,
      uuid: ''
    };
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

  render() {
    // this.props.text.d
    return (
      <div>
        <Layout>
          {/*头部*/}
          <MyHeader />
          <div className="layout-header"></div>
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
                    © <FormattedMessage id="Home.RoyalCaninSAS2020" />
                    {/* © 2017-2019 南京万米信息技术有限公司 版本号：{
                    Const.COPY_VERSION
                  } */}
                  </div>
                </div>
              </Content>
            </ErrorBoundary>
          </Layout>
        </Layout>
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
