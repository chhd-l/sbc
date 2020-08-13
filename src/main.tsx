import React from 'react';
import { Layout } from 'antd';
import {
  routeWithSubRoutes,
  MyHeader,
  MyLeftLevel1,
  MyLeftMenu,
  Fetch,
  util,
  history,
  Const,
  cache
} from 'qmkit';
const { Content } = Layout;
import { routes, auditDidNotPass } from './router';

export default class Main extends React.Component<any, any> {
  _menu: any;

  constructor(props) {
    super(props);
    this.state = {
      // 当前浏览器地址匹配的路由path
      matchedPath: ''
    };
  }

  UNSAFE_componentWillMount() {
    if (this.state.matchedPath != '/login') {
      this.checkLogin(this.state.matchedPath);
    }
    Fetch('/baseConfig').then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        if ((resIco.res as any).defaultLocalDateTime) {
          sessionStorage.setItem(
            'defaultLocalDateTime',
            (resIco.res as any).defaultLocalDateTime
          );
        }
        const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = ico[0].url;
          linkEle.type = 'image/x-icon';
        }
      }
    });
    Fetch('/initConfig/getConfig', { method: 'POST' }).then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        if ((resIco.res as any).context) {
          sessionStorage.setItem(
            cache.SYSTEM_GET_CONFIG,
            (resIco.res as any).context.currency.valueEn
          ); //货币符号
          sessionStorage.setItem(
            cache.SYSTEM_GET_CONFIG_NAME,
            (resIco.res as any).context.currency.name
          ); //货币名称
          sessionStorage.setItem(
            cache.MAP_MODE,
            (resIco.res as any).context.storeVO.prescriberMap
          ); //货币名称
        }
      }
    });
  }

  handlePathMatched = (path) => {
    this.setState({
      matchedPath: path
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      // navigated!
      this.setState({
        matchedPath: nextProps.location.pathname
      });

      //这里统一做权限认证;
      this.checkLogin(nextProps.location.pathname);
    }
  }

  componentDidUpdate() {
    // 加一层判断，避免报错影响子组件渲染
    if (document.getElementById('page-content')) {
      document.getElementById('page-content').scrollTop = 0;
    }
  }

  render() {
    return (
      <div>
        <Layout>
          {/*头部*/}
          <MyHeader className="my-header" />
          <div className="layout-header"></div>
          <Layout className="ant-layout-has-sider">
            {/*左侧一级菜单*/}
            <MyLeftLevel1
              matchedPath={this.state.matchedPath}
              onFirstActiveChange={this._onFirstActiveChange}
            />
            {/*左侧二三级菜单*/}
            <MyLeftMenu
              matchedPath={this.state.matchedPath}
              ref={(menu) => (this._menu = menu)}
            />
            {/*右侧主操作区域*/}
            <Content>
              <div style={styles.wrapper} id="page-content">
                {routeWithSubRoutes(routes, this.handlePathMatched)}
                {routeWithSubRoutes(auditDidNotPass, this.handlePathMatched)}
                <div style={styles.copyright}>
                  © Royal Canin SAS 2020
                  {/* © 2017-2019 南京万米信息技术有限公司 版本号：{
                    Const.COPY_VERSION
                  } */}
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }

  checkLogin = (path) => {
    //这里统一做权限认证;
    if (!util.isLogin()) {
      history.push('/login?from=' + encodeURIComponent(path));
    } else {
      const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      const auditState = loginInfo.auditState; // 商家登录审核状态 -1:未开店(没有审核状态)  0:未审核  1:已审核  2:审核未通过
      if (auditState !== 1) {
        // 商家登录后未审核通过的正常跳转到{auditDidNotPass}对应的页面
        // history.push('/login?from=' + encodeURIComponent(path));
      }
    }
  };

  /**
   * 头部的一级菜单刷新后,初始化左侧菜单的展开菜单状态
   * @private
   */
  _onFirstActiveChange = () => {
    this._menu._openKeysChange(['0']);
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
