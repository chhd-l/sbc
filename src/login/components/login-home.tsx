import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { login, cache } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
const bg_selectRole = require('../img/bg-SelectRole.jpg');
const role_RC = require('../img/role-RC.png');
const role_Perscriber = require('../img/role-Perscriber.png');

const LoginHome = (props) => {
  const { authState, authService } = useOktaAuth();
  const toOkta = props.parent.location.search === '?toOkta=true';
  const loginOkta = async () => authService.login('/');

  useEffect(() => {
    if (authState.isAuthenticated) {
      setTimeout(() => {
      }, 1000);
      login({}, authState.accessToken);
    } else {
      if (toOkta) {
        loginOkta();
      }
    }
  }, [authState, authService]);

  return authState.isAuthenticated || toOkta ? null : (
    <div>
      <div style={styles.container}>
        <Row style={{ top: '20px' }}>
          <Row style={styles.welcomeFont}>
            Welcome to ROYALCANIN<span style={styles.logoR}>R</span> store
            portal
          </Row>
          <Row style={styles.selectFont}>Please select your role:</Row>
          <Row style={{ marginTop: '40px' }}>
            <Col span={2}></Col>
            <Col
              span={9}
              style={styles.buttonContainer}
              onClick={props.clickLoginRc}
            >
              <img style={styles.roleImg} src={role_RC} />
              <div style={styles.roleWord}>RC Staff</div>
            </Col>
            <Col span={2}></Col>
            <Col span={9} style={styles.buttonContainer} onClick={loginOkta}>
              <img style={styles.roleImg} src={role_Perscriber} />
              <div style={styles.roleWord}>Presriber</div>
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
