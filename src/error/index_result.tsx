// import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect } from 'react';
import { login, cache, history } from 'qmkit';
import { Row, Col, Button } from 'antd';
const bg_selectRole = require('./img/error.png');
// const role_RC = require('./img/role-RC.png');
// const role_Perscriber = require('./img/role-Perscriber.png');
// let switchedRouter = false;
// import { switchRouter } from '@/index';
let ErrorPage = (props) => {
  let errorInfo = props?.errorObj?.hasError ?? false ? props.errorObj : {};

  return (
    <div style={styles.container}>
      <Row style={{ top: '15%' }}>
        <Col span={24}>
          <Row style={styles.welcomeFont}>
            <Col span={24}>{errorInfo.fetchStatus}</Col>
          </Row>

          <Row style={styles.selectFont}>
            <Col span={24}>{errorInfo.error.toString()}</Col>
            <Col span={24} style={{ background: '#f3f3f3', marginTop: '10px' }}>
              info:{errorInfo.msg}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    backgroundImage: 'url(' + bg_selectRole + ')',
    // backgroundSize: 'cover',
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
