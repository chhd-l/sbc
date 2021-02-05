import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
const logo = require('../img/logo.png');
import { WrappedFormUtils } from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import { history, Const, login, cache } from 'qmkit';
import { TIMEOUT } from 'dns';

export default class LoginForm extends React.Component<any, any> {
  form;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const loginLogo = sessionStorage.getItem(cache.SITE_LOGO);

    return (
      <Form style={styles.loginForm}>
        <FormItem style={{ marginBottom: 15 }}>
          <div style={styles.header}>
            <img style={styles.logo} src={loginLogo ? loginLogo : logo} />
          </div>
          <strong style={styles.title}>Store portal</strong>
        </FormItem>
        <label style={styles.label}>Login Account</label>
        <FormItem style={{ marginTop: 10 }}>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: 'Account cannot be empty' }]
          })(<Input size="large" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Please input your login account" />)}
        </FormItem>
        <label style={styles.label}>Password</label>
        <FormItem style={{ marginTop: 10 }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Password cannot be empty' }]
          })(<Input size="large" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />)}
        </FormItem>
        <FormItem>
          {/*{getFieldDecorator('isRemember', {
          })(
            <Checkbox>记住账号</Checkbox>
          )}*/}
          {/* <a
            style={{ float: 'left' }}
            onClick={() => history.push('/company-register')}
          >
            免费注册
          </a> */}
          {/* <a
            style={{ float: 'right' }}
            onClick={() => history.push('/find-password')}
          >
            Forgot your password
          </a> */}
        </FormItem>
        <FormItem>
          <Button type="primary" size="large" htmlType="submit" style={styles.loginBtn} loading={this.state.loading} onClick={(e) => this._handleLogin(e)}>
            Login
          </Button>
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <div>
            <p style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}>{/* © 2017-2019 南京万米信息技术有限公司 */}© Royal Canin SAS 2020</p>
            {/* <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              版本号：{Const.COPY_VERSION}
            </p> */}
          </div>
        </FormItem>
      </Form>
    );
  }

  _handleLogin = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        login(values, '', (res) => {
          if (res.auditState === 1) {
            this.setState({
              loading: false
            });
          }
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };
}

const styles = {
  loginForm: {
    // width: 370,
    // minHeight: 325,
    width: 480,
    minHeight: 550,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
    // marginTop: -50,
    // marginLeft: -550
    marginTop: 0,
    marginLeft: 500,
    boxShadow: '0 2px 60px 0 rgba(167,167,167,0.28)'
  },
  loginBtn: {
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logo: {
    display: 'block',
    width: 'auto',
    // height: 42
    height: 60
  },
  title: {
    // fontSize: 18,
    fontSize: 25,
    color: '#333',
    lineHeight: 1,
    textAlign: 'center',
    display: 'block',

    marginBottom: 30
  },
  label: {
    fontFamily: 'DINPro-Medium',
    fontSize: '19px',
    color: '#B6B6B6',
    letterSpacing: 0
  }
} as any;
