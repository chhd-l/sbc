import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { Const, history, util } from 'qmkit';
import { resetPassword } from '@/myvetreco-logins/reset-password/webapi';
import moment from 'moment';
import '../css/login-form.less';

const bgImg = require('../img/login--reset.jpg');
const digitRule = /[\d]+/;
const lowerRule = /[a-z]+/;
const upperRule = /[A-Z]+/;
const specialRule = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;

const getParamsFromSearchStr = (search) => {
  if (search) {
    let paramString = search.substring(1);
    let paramArr = paramString.split('&');
    return {
      [paramArr[0].split('=')[0]]: paramArr[0].split('=')[1],
      [paramArr[1].split('=')[0]]: paramArr[1].split('=')[1]
    };
  } else {
    return {};
  }
};

export default Form.create()(class LoginResetForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      passwordActive: true,
      confirmActive: true,
      loading: false,
      showPasswordTip: false,
      lengthCheck: false,
      lowerCheck: false,
      upperCheck: false,
      digitCheck: false,
      specialCheck: false
    };
  }

  handleInputFocus = (key: string) => {
    if (key === 'password') {
      this.setState({
        passwordActive: false,
        showPasswordTip: true
      });
    } else {
      this.setState({ confirmActive: false });
    }
  }

  handleInputBlur = (key: string) => {
    if (key === 'password') {
      this.setState({
        showPasswordTip: false,
        passwordActive: this.props.form.getFieldValue('password') === ''
      });
    } else if (key === 'confirmPassword' && this.props.form.getFieldValue('confirmPassword') === '') {
      this.setState({ confirmActive: true });
    }
  }

  handlePasswordChange = (e) => {
    const value = e.target.value;
    this.setState({
      lengthCheck: value.length >= 8,
      digitCheck: digitRule.test(value),
      lowerCheck: lowerRule.test(value),
      upperCheck: upperRule.test(value),
      specialCheck: specialRule.test(value)
    });
  }

  handleLogin = () => {
    this.props.form.validateFields(null, (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const base64 = new util.Base64();
        const params = Object.assign(getParamsFromSearchStr(this.props.location.search), {
          password: base64.urlEncode(values.password),
          confirmPassword: base64.urlEncode(values.confirmPassword)
        });
        resetPassword(params).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            history.push('/login-form');
          } else {
            this.setState({ loading: false });
          }
        }).catch(() => { this.setState({ loading: false }); });
      }
    });
  }

  validatePassword = (rule, value, callback) => {
    if (value.lenth < 8 || !digitRule.test(value) || !lowerRule.test(value) || !upperRule.test(value) || !specialRule.test(value)) {
      callback("Пароль не соответствует правилам безопасности или аналогичен вашему текущему паролю");
    } else {
      this.props.form.validateFields(["confirmPassword"], { force: true });
      callback();
    }
  }

  validateConfirmPassword = (rule, value, callback) => {
    if (value !== this.props.form.getFieldValue("password")) {
      callback("Пароли должны совпадать");
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showPasswordTip, lengthCheck, lowerCheck, upperCheck, digitCheck, specialCheck } = this.state;
    return (
      <div className="spec-login-form">
        <div className="logo" style={{marginTop: 40, marginBottom: 30}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 101.83" style={{width:164}}>
          <title>Royal Canin logo - primary</title>
          <g id="Crown">
            <g>
              <path className="cls-1" d="M81.22,42.83a2.16,2.16,0,0,1-1.87-1,2.41,2.41,0,0,1,.44-3.3c6.26-4.62,15.83-7.47,25.61-7.47h0c9.78,0,19.23,2.75,25.5,7.47a2.3,2.3,0,0,1,.44,3.3,2.4,2.4,0,0,1-3.3.44c-4.18-3.19-12.42-6.48-22.75-6.48h0c-10.33,0-18.57,3.41-22.75,6.48A2,2,0,0,1,81.22,42.83Zm2.09,4a1.53,1.53,0,0,0,1-.33c4.73-4,12.86-6.37,21-6.37s16,2.42,20.88,6.37a1.64,1.64,0,0,0,2.09-2.53c-5.39-4.4-14-7.14-23-7.14S87.7,39.43,82.21,43.93A1.69,1.69,0,0,0,82,46.24,1.74,1.74,0,0,0,83.31,46.79ZM70.78,12.94a5,5,0,0,0-2.75.77A5.88,5.88,0,0,0,65.5,17a5.75,5.75,0,0,0,.55,4.07,5.39,5.39,0,0,0,4.62,2.64h0a5,5,0,0,0,2.75-.77,5.88,5.88,0,0,0,2.53-3.3,5.75,5.75,0,0,0-.55-4.07A5.39,5.39,0,0,0,70.78,12.94Zm34.51,4.18a5.39,5.39,0,1,0,5.39,5.39A5.39,5.39,0,0,0,105.29,17.12Zm0-13.52A5.39,5.39,0,1,0,110.67,9,5.39,5.39,0,0,0,105.29,3.6ZM91,19a6.43,6.43,0,0,0-1.43.22,5.28,5.28,0,0,0-3.74,6.59,5.41,5.41,0,0,0,5.17,4h.11a5.52,5.52,0,0,0,1.32-.22A5.44,5.44,0,0,0,95.73,27a5.83,5.83,0,0,0,.55-4.07A5.64,5.64,0,0,0,91,19ZM77.59,24.59a5,5,0,0,0-2.75.77,5.88,5.88,0,0,0-2.53,3.3,5.75,5.75,0,0,0,.55,4.07,5.39,5.39,0,0,0,4.62,2.64h0a5,5,0,0,0,2.75-.77,5.88,5.88,0,0,0,2.53-3.3,5.75,5.75,0,0,0-.55-4.07A5.14,5.14,0,0,0,77.59,24.59Zm43.52-5.39a6.43,6.43,0,0,0-1.43-.22,5.37,5.37,0,0,0-1.43,10.55,6.43,6.43,0,0,0,1.43.22,5.37,5.37,0,0,0,1.43-10.55Zm3.52-13.08a6.43,6.43,0,0,0-1.43-.22,5.37,5.37,0,0,0-1.43,10.55,6.43,6.43,0,0,0,1.43.22,5.31,5.31,0,0,0,5.17-4A5.2,5.2,0,0,0,124.63,6.13Zm11.1,19.23a6.08,6.08,0,0,0-2.75-.77,5.26,5.26,0,0,0-4.62,2.64,4.8,4.8,0,0,0-.55,4.07,5.07,5.07,0,0,0,2.53,3.3,6.08,6.08,0,0,0,2.75.77,5.39,5.39,0,0,0,4.62-2.64,4.85,4.85,0,0,0,.55-4.07A4.83,4.83,0,0,0,135.73,25.36ZM145.18,17a5.07,5.07,0,0,0-2.53-3.3,6.08,6.08,0,0,0-2.75-.77,5.39,5.39,0,0,0-4.62,2.64,4.85,4.85,0,0,0-.55,4.07,5.07,5.07,0,0,0,2.53,3.3,6.08,6.08,0,0,0,2.75.77,5.26,5.26,0,0,0,4.62-2.64A5.75,5.75,0,0,0,145.18,17Zm-57.81-.22a6.43,6.43,0,0,0,1.43-.22A5.37,5.37,0,0,0,87.37,6a6.43,6.43,0,0,0-1.43.22,5.28,5.28,0,0,0-3.74,6.59,5.54,5.54,0,0,0,5.17,4ZM179.8,77A3.08,3.08,0,1,0,186,77V55.36a3.08,3.08,0,0,0-6.15,0Zm-89-3a.29.29,0,0,1-.33-.33V55.8a3.08,3.08,0,0,0-6.15,0V78.11a1.62,1.62,0,0,0,1.65,1.65H96.61a2.86,2.86,0,0,0,0-5.71Zm72.43-19.12h0a3.79,3.79,0,0,0-3.63-2,3.89,3.89,0,0,0-3.85,3.85V77.23a2.86,2.86,0,0,0,3,2.86,2.93,2.93,0,0,0,3-2.86V64.71a.24.24,0,0,1,.22-.22l.11.11,7.47,13.19a3.71,3.71,0,0,0,3.3,2,3.89,3.89,0,0,0,3.85-3.85V55a2.86,2.86,0,0,0-5.71,0V67.56l-.22.22-.11-.11Zm33.52,0h0a3.79,3.79,0,0,0-3.63-2,3.89,3.89,0,0,0-3.85,3.85V77.34a2.86,2.86,0,0,0,3,2.86,2.93,2.93,0,0,0,3-2.86V64.82a.24.24,0,0,1,.22-.22l.11.11L203,77.89a3.71,3.71,0,0,0,3.3,2A3.89,3.89,0,0,0,210.14,76V55.14a2.86,2.86,0,0,0-5.71,0V67.67l-.22.22-.11-.11Zm-142,6a.4.4,0,0,1-.33-.11l-6.7-7a2.81,2.81,0,0,0-2.09-.88,2.91,2.91,0,0,0-2.86,2.86,2.65,2.65,0,0,0,.77,1.87L51.65,67l.11,9.89a2.86,2.86,0,0,0,5.71,0L57.59,67l8.13-9.34a3.12,3.12,0,0,0,.77-1.87,2.91,2.91,0,0,0-2.86-2.86,3,3,0,0,0-2.09.88l-6.59,7C55,61,54.84,61,54.73,61ZM31.87,59.21a7.25,7.25,0,1,1-7.25,7.25A7.25,7.25,0,0,1,31.87,59.21Zm13.41,7.25A13.41,13.41,0,1,0,31.87,79.87,13.32,13.32,0,0,0,45.28,66.46Zm96.28,1.76h0c0,.22-.11.33-.22.33h-2.75v-4.4Zm-3.63-14.4a3.09,3.09,0,0,0-2.31-1.1c-1.65,0-3.08.88-3.08,2.53V76.79a3,3,0,0,0,3,3,3.05,3.05,0,0,0,3.08-3V74.38H146L149,78.55a3,3,0,0,0,2.31,1.21,2.84,2.84,0,0,0,2.86-2.86,3.32,3.32,0,0,0-.55-1.76ZM74.62,64.16v4.4H71.88a.24.24,0,0,1-.22-.22v-.11Zm-15.17,11a3,3,0,0,0-.55,1.76,2.84,2.84,0,0,0,2.86,2.86,2.72,2.72,0,0,0,2.31-1.21l3.08-4.18h7.36v2.42a3.05,3.05,0,0,0,3.08,3,3,3,0,0,0,3-3v-21a3.15,3.15,0,0,0-3.08-3.08,3.09,3.09,0,0,0-2.31,1.1Zm48.14-8.57A13.31,13.31,0,0,0,120.23,80c3.85,0,7.91-1.65,10.11-4.29a2.77,2.77,0,0,0,.66-1.87,2.85,2.85,0,0,0-4.18-2.53l-2.31,1.54a6.58,6.58,0,0,1-3.85,1.1,7.37,7.37,0,0,1,0-14.73,7.49,7.49,0,0,1,3.85,1.1l2.31,1.54A2.85,2.85,0,0,0,131,59.32a3,3,0,0,0-.66-1.87A11.9,11.9,0,0,0,121,53.28,13.23,13.23,0,0,0,107.6,66.57ZM8.68,59.1A3.06,3.06,0,0,1,11.87,62a3,3,0,0,1-3.19,2.86A3,3,0,0,1,5.5,62.07,3.08,3.08,0,0,1,8.68,59.1ZM.44,77A2.91,2.91,0,0,0,3.3,79.87,2.91,2.91,0,0,0,6.15,77l.11-7.14a.35.35,0,0,1,.33-.33H6.7l7,9.56a2.65,2.65,0,0,0,1.87.77,2.82,2.82,0,0,0,2.86-2.75,2.22,2.22,0,0,0-.33-1.21L13.74,69a7.72,7.72,0,0,0,3.85-6.81,8.77,8.77,0,0,0-8.68-9,8.66,8.66,0,0,0-6.59,2.31C.55,57.12,0,59.54,0,62.18Zm196.18,21.1V90.64h1.1v6.48h3.63v1Zm-5.06,0h1.1V90.64h-1.1ZM185.3,92.4l-1.21,3.3h2.31Zm2,5.71-.55-1.54h-3l-.55,1.54H182l2.75-7.47h.88l2.75,7.47Zm-9-6.37v6.37h-1.1V91.63h-2.09v-1h5.28v1l-2.09.11Zm-10.88,6.37V90.64h4.84v1h-3.63v2.2h3.08v1h-3.08v2.31h3.63v1Zm-4.84-3.74c0-1,0-1.76-.44-2.2a1.82,1.82,0,0,0-1.32-.55h-1.43v5.5h1.43a1.48,1.48,0,0,0,1.32-.55C162.55,96.25,162.55,95.37,162.55,94.38Zm1.1,0a4.21,4.21,0,0,1-.77,3.08,2.87,2.87,0,0,1-2,.66h-2.64V90.64h2.64a3.07,3.07,0,0,1,2,.66C163.76,92.18,163.65,93.28,163.65,94.38ZM149,95v3.08h-1.1V95l-2.2-4.4h1.21l1.54,3.3,1.54-3.3h1.21Zm-7.25-2.2a1.19,1.19,0,0,0-1.32-1.21h-1.65v2.31h1.65C141.34,94,141.78,93.61,141.78,92.84Zm.11,5.28-1.54-3.19h-1.43v3.19h-1.1V90.64h2.86a2.11,2.11,0,0,1,2.31,2.2,1.93,1.93,0,0,1-1.54,2l1.76,3.3Zm-12.53,0V90.64h4.84v1h-3.63v2.2h3.08v1h-3.08v2.31h3.63v1Zm-5.5,0H123l-2.42-7.47h1.21l1.76,5.5,1.76-5.5h1.21Zm-10.77,0V90.64h4.84v1H114.3v2.2h3.08v1H114.3v2.31h3.63v1Zm-9,0-3.52-5.28v5.28h-1.1V90.64h1L104,95.92V90.64h1.1v7.47Zm-9.67,0h1.1V90.64h-1.1ZM82,98.12V90.64h4.84v1H83.2v2.2h3.08v1H83.2v2.31h3.63v1Zm-8,0V90.64h1.1v6.48h3.63v1ZM69.13,96a1.07,1.07,0,0,0-1.21-1.1H66.16v2.31h1.76C68.69,97.13,69.13,96.69,69.13,96ZM69,92.73a1.07,1.07,0,0,0-1.21-1.1H66.16v2.2h1.65C68.58,93.83,69,93.5,69,92.73ZM70.23,96a2,2,0,0,1-2.31,2.09H64.84V90.64h3a2,2,0,0,1,2.31,2.09,1.65,1.65,0,0,1-1,1.54A2,2,0,0,1,70.23,96ZM59.9,98.12H61V90.64H59.9Zm-4.84-3.74c0-1,0-1.76-.44-2.2a1.82,1.82,0,0,0-1.32-.55H51.87v5.5H53.3a1.48,1.48,0,0,0,1.32-.55C55.06,96.25,55.06,95.37,55.06,94.38Zm1.1,0a4.21,4.21,0,0,1-.77,3.08,2.59,2.59,0,0,1-1.87.66H50.89V90.64h2.64a3.07,3.07,0,0,1,2,.66C56.27,92.18,56.16,93.28,56.16,94.38ZM42.53,98.12V90.64h4.84v1H43.74v2.2h3.08v1H43.74v2.31h3.63v1ZM37.7,92.84a1.19,1.19,0,0,0-1.32-1.21H34.73v2.31h1.65C37.26,94,37.7,93.61,37.7,92.84Zm.11,5.28-1.54-3.19H34.84v3.19h-1.1V90.64H36.6a2.11,2.11,0,0,1,2.31,2.2,1.93,1.93,0,0,1-1.54,2l1.76,3.3Zm-7.69-.77a2.81,2.81,0,0,1-2.09.88,3.16,3.16,0,0,1-2-.77c-.77-.77-.77-1.54-.77-3.08s0-2.31.77-3a2.92,2.92,0,0,1,4.07.11l-.77.77A1.57,1.57,0,0,0,28,91.63a1.68,1.68,0,0,0-1.1.44c-.33.44-.44.88-.44,2.31s.11,2,.44,2.31a1.27,1.27,0,0,0,1.1.44,1.44,1.44,0,0,0,1.32-.66Zm-9.56.77L17,92.84v5.28h-1.1V90.64h1l3.52,5.28V90.64h1.1v7.47Zm-9.67,0H12V90.64h-1.1Z"/>
              <path className="cls-1" d="M216.51,62.1c.33,0,.44-.11.44-.33a.4.4,0,0,0-.44-.44h-.66v.77Zm-.66,1.65a.4.4,0,0,1-.44.44c-.33,0-.33-.11-.33-.44V61.11c0-.22.11-.33.44-.33h1c.66,0,1.32.22,1.32,1s-.33.88-.88,1l.66,1V64c0,.22-.11.33-.44.33s-.33-.22-.44-.44l-.55-1H216v.88Zm.55,1A2.42,2.42,0,1,0,214,62.32,2.37,2.37,0,0,0,216.4,64.74Zm0-5.5a3.19,3.19,0,1,1-3.19,3.19A3.19,3.19,0,0,1,216.4,59.25Z"/>
            </g>
          </g>
        </svg>
        </div>
        <div style={{textAlign:'center'}}>
          <div>
            <div style={{marginBottom: 20, fontSize: 30}}>
              <span style={{color: 'var(--primary-color)'}}>Установить пароль</span>
            </div>
            <Form layout="vertical" style={{width: 320, margin: '0 auto', textAlign: 'initial'}}>
              <Form.Item>
                <div className={`form-item-label ${this.state.passwordActive ? 'placeholder' : ''}`}>Введите новый пароль</div>
                {showPasswordTip ? <div className="password-validation">
                  <p><i className="iconfont iconEnabled"></i>Пароль должен содержать как минимум:</p>
                  <p className={digitCheck ? "check" : ""}><i className="iconfont iconEnabled"></i>Не менее 1 цифры (0...9)</p>
                  <p className={upperCheck ? "check" : ""}><i className="iconfont iconEnabled"></i>Не менее 1 заглавной буквы (A...Z)</p>
                  <p className={lowerCheck ? "check" : ""}><i className="iconfont iconEnabled"></i>Не менее 1 строчной буквы (a...z)</p>
                  <p className={specialCheck ? "check" : ""}><i className="iconfont iconEnabled"></i>Не менее 1 специального символа</p>
                  <p className={lengthCheck ? "check" : ""}><i className="iconfont iconEnabled"></i>Не менее 8 символов</p>
                </div> : null}
                {getFieldDecorator('password', {
                  initialValue: '',
                  rules: [{ validator: this.validatePassword }]
                })(<Input.Password autoComplete="off" onChange={this.handlePasswordChange} onFocus={() => this.handleInputFocus('password')} onBlur={() => this.handleInputBlur('password')} />)}
              </Form.Item>
              <Form.Item>
                <div className={`form-item-label ${this.state.confirmActive ? 'placeholder' : ''}`}>Подтвердите новый пароль</div>
                {getFieldDecorator('confirmPassword', {
                  initialValue: '',
                  rules: [{ validator: this.validateConfirmPassword }]
                })(<Input.Password autoComplete="off" onFocus={() => this.handleInputFocus('confirmPassword')} onBlur={() => this.handleInputBlur('confirmPassword')} />)}
              </Form.Item>
            </Form>
            <div>
              <Button type="primary" className="login-button" loading={this.state.loading} onClick={this.handleLogin}>Сбросить пароль</Button>
            </div>
          </div>
          <div style={{marginTop: 30}}>
            <img src={bgImg} style={{width: 300}} />
          </div>
        </div>
        <div className="foot">
          <span>Copyright &copy; {moment().format('YYYY')} Royal Canin SAS</span>
        </div>
      </div>
    );
  }
});