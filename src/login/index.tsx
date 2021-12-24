import React, { useEffect } from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import LoginHome from './components/login-home';
import AppStore from './store';
const bg = require('./img/bg-1.png');
const bg_login = require('./img/bg_login.png');
import { withOktaAuth } from '@okta/okta-react';
import { cache, history, Const, util } from 'qmkit';
import * as webapi from './webapi';

@StoreProvider(AppStore, { debug: __DEV__ })
export default withOktaAuth(class Login extends React.Component<any, any> {
  store: AppStore;

  constructor(props: any) {
    super(props);
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.oktaLogout) {
      if(this.props.authState.isAuthenticated) {
         let idToken = this.props.authState.idToken;
         let redirectUri = window.origin + '/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE);
         let issure = sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) ===  'staff' ? Const.REACT_APP_RC_ISSUER : Const.REACT_APP_PRESCRIBER_ISSUER;
         if (Const.SITE_NAME === 'MYVETRECO') {
           redirectUri = window.origin + '/logout';
           issure = Const.REACT_APP_PRESCRIBER_ISSUER;
         }
        if(sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) === 'staff') {
          this.props.authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE))
        } else {
          window.location.href = `${issure}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
        }
      } else {
        history.push('/logout')
      }
    };
  }

  componentDidMount() {
    this.store.init();
    this.getCookieBanner()
    this.getMarsFooter()
  }
  getCookieBanner = ()=>{
    util.loadJS({
      url: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      dataSets: {
        domainScript: Const.ISPRODUCT?'18097cd9-5541-4f5f-98dc-f59b2b2d5730':'18097cd9-5541-4f5f-98dc-f59b2b2d5730-test',
        documentLanguage: 'true'
      }
    });
  }
  componentWillUnmount(){
    document.getElementById('mars-footer-panel')?.remove() 
  }
  getMarsFooter = ()=>{
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
  
  render() {
    // const LoginFormDetail = Form.create({})(LoginForm);
    // return this.state.isRcLogin ? (
    //   <div style={styles.container}>{<LoginFormDetail />}</div>
    // ) : (
    //   <LoginHome parent={this.props} />
    // );
    return (this.props.location.state && this.props.location.state.oktaLogout) ? null
          : <LoginHome parent={this.props} />
  }
})
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(' + bg_login + ')',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  } as any
};
