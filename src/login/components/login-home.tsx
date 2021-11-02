import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect } from 'react';
import { login, cache, getRoutType, Const, util } from 'qmkit';
import { Row, Col, Spin } from 'antd';
const bg_selectRole = require('../img/bg-SelectRole.jpg');
const role_RC = require('../img/role-RC.png');
const role_Perscriber = require('../img/role-Perscriber.png');
let switchedRouter = false;
import { switchRouter } from '@/index';
import { FormattedMessage } from 'react-intl';

import MyvetrecoLoginForm from '../../myvetreco-logins/login';

let LoginHome = (props) => {
  let { authState, authService } = useOktaAuth();
  let toOkta = props.parent.location.search === '?toOkta=true';
  let loginpPercriberOkta = () => {
    sessionStorage.setItem(cache.OKTA_ROUTER_TYPE, 'prescriber');
    switchRouter();
    switchedRouter = true;
  };

  let loginpRcOkta = () => {
    sessionStorage.setItem(cache.OKTA_ROUTER_TYPE, 'staff');
    switchRouter();
    switchedRouter = true;
  };
  const getMarsFooter = ()=>{
    // 未登录不能区分国家，先不区分
    // let country =  (window as any)?.countryEnum[JSON.parse(sessionStorage?.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0]||''
    // let footerParamsMap ={
    //   'mx':'shop-royalcanin-mx',
    //   'de':'shop-royalcanin-de',
    // } 
    // let footerParams = footerParamsMap[country]||'store-royalcanin-com'
    // util.loadJS({url: `https://footer.mars.com/js/footer.js.aspx?${footerParams}`})
    util.loadJS({url: `https://footer.mars.com/js/footer.js.aspx?store-royalcanin-com`})
  }
  const getCookieBanner = ()=>{
    util.loadJS({
      url: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      dataSets: {
        domainScript: Const.ISPRODUCT?'18097cd9-5541-4f5f-98dc-f59b2b2d5730':'18097cd9-5541-4f5f-98dc-f59b2b2d5730-test',
        documentLanguage: 'true'
      }
    });
  }
  useEffect(()=>{
    console.info('.................................')
    getCookieBanner()
    getMarsFooter()
  },[])
  useEffect(() => {
    if (!authState.isAuthenticated) {
      if (switchedRouter) {
        let loginType = sessionStorage.getItem(cache.OKTA_ROUTER_TYPE);
        if (loginType === 'staff') {
          authService.login('/login?type=staff');
        } else if (loginType === 'prescriber') {
          authService.login('/login?type=prescriber');
        }
        return;
      }
      if (toOkta) {
        loginpPercriberOkta();
      }
    }

    if (authState.isAuthenticated) {
      let routerType = getRoutType(props.parent.location.search);
      login(routerType, authState.accessToken);
    }
  }, [authState, authService]);
  return (authState.isAuthenticated && sessionStorage.getItem(cache.OKTA_ROUTER_TYPE)) || toOkta ? (
    <div>
      <div style={styles.noBackgroundContainer}>
        <Spin spinning={true}></Spin>
      </div>
    </div>
  ) : Const.SITE_NAME === 'MYVETRECO' ? (<MyvetrecoLoginForm useOkta={true} onLogin={loginpPercriberOkta} />) : (
    <div>
      <div style={styles.container}>
        <Row style={{ top: '20px' }}>
          <Row style={styles.welcomeFont}>
            <FormattedMessage id="Public.WelcometoROYALCANIN" />
            <span style={styles.logoR}>
              <FormattedMessage id="Public.R" />
            </span>{' '}
            <FormattedMessage id="Public.storeportal" />
          </Row>
          <Row style={styles.selectFont}>
            <FormattedMessage id="Public.Pleaseselectyourrole" />:
          </Row>
          <Row style={{ marginTop: '40px' }}>
            <Col span={2}></Col>
            <Col span={9} style={styles.buttonContainer} onClick={loginpRcOkta}>
              <img style={styles.roleImg} src={role_RC} />
              <div style={styles.roleWord}>
                <FormattedMessage id="Public.RCStaff" />
              </div>
            </Col>
            <Col span={2}></Col>
            <Col span={9} style={styles.buttonContainer} onClick={loginpPercriberOkta}>
              <img style={styles.roleImg} src={role_Perscriber} />
              <div style={styles.roleWord}>
                <FormattedMessage id="Public.Prescriber" />
              </div>
            </Col>
            <Col span={2}></Col>
          </Row>
        </Row>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(' + bg_selectRole + ')',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  } as any,
  noBackgroundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  } as any,
  buttonContainer: {
    background: '#FFFFF',
    boxShadow: '0 4px 40px 0 rgba(190,190,190,0.35)',
    borderRadius: '12px',
    textAlign: 'center',
    padding: '35px 0',
    cursor: 'pointer'
  } as any,
  welcomeFont: {
    fontFamily: '"RC TYPE", Roboto, Avenir, Helvetica, Arial, sans-serif',
    fontSize: '40px',
    color: '#E1021A',
    letterSpacing: 0,
    marginTop: '30px'
  } as any,
  selectFont: {
    fontFamily: '"RC TYPE", Roboto, Avenir, Helvetica, Arial, sans-serif',
    fontSize: '30px',
    color: '#898989',
    letterSpacing: 0,
    textAlign: 'center',
    marginTop: '20px'
  } as any,
  roleImg: {
    width: '80px',
    height: '80px'
  } as any,
  roleWord: {
    fontFamily: '"RC TYPE", Roboto, Avenir, Helvetica, Arial, sans-serif',
    fontSize: '30px',
    color: '#898989',
    letterSpacing: 0,
    marginTop: '30px'
  } as any,
  logoR: {
    display: 'inline-block',
    width: '30px',
    height: '30px',
    borderRadius: '30px',
    border: '2px solid',
    fontSize: '18px',
    textAlign: 'center',
    fontWeight: '700',
    verticalAlign: 'middle',
    position: 'relative',
    top: '-3px'
  } as any
};
export default LoginHome;
