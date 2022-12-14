import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop, TimerButton, ValidConst } from 'qmkit';
import { Relax } from 'plume2';

const FormItem = Form.Item;
const pass_word = 'password';
// const TimingButton = TimerButton.Timer;
@Relax
export default class DetailForm extends React.Component<any, any> {
  form;

  props: {
    relaxProps?: {
      account: string;
      imageCode: string;
      telCode: string;
      password: string;
      checked: boolean;
      isShowPwd: boolean;
      showPass: Function;
      setTel: Function;
      setTelCode: Function;
      setPassword: Function;
      sendCode: Function;
      changeChecked: Function;
      register: Function;
      doingRegister: boolean;
    };
    form: any;
  };

  static relaxProps = {
    account: 'account',
    checked: 'checked',
    isShowPwd: 'isShowPwd',
    imageCode: 'imageCode',
    telCode: 'telCode',
    password: pass_word,
    showPass: noop,
    setTel: noop,
    setTelCode: noop,
    setPassword: noop,
    sendCode: noop,
    changeChecked: noop,
    register: noop,
    doingRegister: 'doingRegister'
  };

  constructor(props) {
    super(props);
  }

  /**
   *
   * @returns {any}
   */
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      account,
      setTel,
      setTelCode,
      setPassword,
      sendCode,
      checked,
      changeChecked,
      isShowPwd,
      showPass,
      telCode,
      password,
      doingRegister
    } = this.props.relaxProps;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
        offset: 0
      }
    };

    const styleColor = {
      style: {
        padding: 0,
        height: 40,
        width: '100%',
        fontSize: 16,
        lineHeight: '40px',
        borderRadius: 0,
        color: doingRegister ? '#939495' : '#fff',
        background: doingRegister ? '#e1e1e1' : '#262626',
        borderColor: doingRegister ? '#e1e1e1' : '#262626'
      }
    };

    return (
      <Form className="content-main content-register">
        <FormItem {...formItemLayout} label="?????????" validateStatus="error">
          {getFieldDecorator('account', {
            initialValue: account,
            rules: [
              { required: true, message: '?????????????????????' },
              {
                pattern: ValidConst.phone,
                message: '??????????????????????????????'
              }
            ],
            onChange: (e) => {
              setTel(e.target.value);
            }
          })(<Input placeholder="????????????????????????" size="large" style={{ width: 110 }} />)}
          <TimerButton
            style={{
              height: 30,
              minWidth: 90,
              padding: '0 5px',
              fontSize: 12,
              lineHeight: '30px',
              textAlign: 'center',
              background: '#ffd2dc',
              borderColor: '#ffd2dc',
              color: '#ff1f4e',
              borderRadius: 0,
              float: 'right'
            }}
            resetWhenError={true}
            shouldStartCountDown={() => this._sendCode()}
            sendText="???????????????"
            onPress={() => sendCode()}
          />
        </FormItem>

        <FormItem {...formItemLayout} label="?????????">
          {getFieldDecorator('telCode', {
            initialValue: telCode,
            rules: [
              { required: true, message: '????????????????????????' },
              {
                pattern: /^\d{6}$/,
                message: '?????????6?????????'
              }
            ],
            onChange: (e) => {
              setTelCode(e.target.value);
            }
          })(<Input placeholder="????????????????????????" size="large" />)}
        </FormItem>
        <FormItem
          style={{
            visibility: 'hidden',
            width: 0,
            height: 0,
            margin: 0,
            padding: 0
          }}
          label="?????????"
        >
          {getFieldDecorator('telCodeHidden', {
            initialValue: telCode
          })(<Input placeholder="????????????????????????" size="large" />)}
        </FormItem>
        <FormItem
          style={{
            visibility: 'hidden',
            width: 0,
            height: 0,
            margin: 0,
            padding: 0
          }}
          label="??????"
        >
          {getFieldDecorator(
            'passwordHidden',
            {}
          )(
            <Input
              suffix={
                <i
                  className={`qmIcon eyes icon-${isShowPwd ? 'eyes' : 'eyes1'}`}
                  style={{ fontSize: 20 }}
                  onClick={() => showPass()}
                />
              }
              type={isShowPwd ? 'text' : 'password'}
              name="code"
              placeholder="???????????????"
              size="large"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="??????">
          {getFieldDecorator('password', {
            initialValue: password,
            rules: [
              { required: true, message: '???????????????' },
              {
                pattern: /^[A-Za-z0-9]{6,16}$/,
                message: '????????????6-16??????????????????'
              }
            ],
            onChange: (e) => {
              setPassword(e.target.value);
            }
          })(
            <Input
              suffix={
                <i
                  className={`qmIcon eyes icon-${isShowPwd ? 'eyes' : 'eyes1'}`}
                  style={{ fontSize: 20 }}
                  onClick={() => showPass()}
                />
              }
              //onFocus={() => changeType()}
              type={isShowPwd ? 'text' : 'password'}
              name="code"
              placeholder="???????????????"
              size="large"
              autoComplete="new-password"
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Checkbox defaultChecked={checked} onChange={() => changeChecked()}>
            <div style={{ display: 'inline' }}>
              <span>?????????????????????</span>
              <a className="t-small" href="/supplier-agreement" target="_blank">
                ??????????????????
              </a>
            </div>
          </Checkbox>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" {...styleColor} disabled={doingRegister} onClick={this._register}>
            ????????????
          </Button>
        </FormItem>
      </Form>
    );
  }

  /**
   * ????????????
   * @param e
   * @private
   */
  _register = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //??????????????????
      if (!errs) {
        this.props.relaxProps.register(values);
      } else {
        this.setState({});
      }
    });
  };

  /**
   *
   * @returns {boolean}
   * @private
   */
  _sendCode = () => {
    const regex = ValidConst.phone;
    const mobile = this.props.relaxProps.account;
    if (mobile == '') {
      message.error('???????????????????????????');
      return false;
    } else if (!regex.test(mobile)) {
      message.error('????????????????????????');
      return false;
    } else {
      return true;
    }
  };
}
