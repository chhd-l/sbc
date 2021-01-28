import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect } from 'react';
import { login, cache, history } from 'qmkit';
import { Row, Col, Button } from 'antd';
const bg_selectRole = require('./img/bg-SelectRole.jpg');

let ErrorPage = (props) => {
  let loginpPercriberOkta = () => {
    history.push('login', { oktaLogout: false });
  };

  let loginpRcOkta = () => {
    history.go(-2);
  };
  let defaultData = JSON.stringify({
    fetchStatus: 404,
    msg: 'Please check route or click button ',
    error: 'Not Find Page'
  });
  let errorInfo = JSON.parse(sessionStorage.getItem(cache.ERROR_INFO) || defaultData);

  return (
    <div>
      <div style={styles.container}>
        <Row style={{ top: '25%' }}>
          <Row style={styles.welcomeFont}>{errorInfo.fetchStatus}</Row>

          <Row style={styles.selectFont}>
            <Col>info:{errorInfo.msg}</Col>
            <Col>error:{errorInfo.error}</Col>
          </Row>
          <Row style={styles.selectFont}>
            <Col span={12}>
              <Button type="primary" onClick={loginpPercriberOkta}>
                Back to login
              </Button>
            </Col>
            <Col span={12}>
              <Button onClick={loginpRcOkta}>Back to previous page</Button>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    // alignItems: 'center',
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
    textAlign: 'center',
    marginTop: '50px'
  } as any,
  selectFont: {
    fontFamily: '"RC TYPE", Roboto, Avenir, Helvetica, Arial, sans-serif',
    fontSize: '20px',
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
export default ErrorPage;
