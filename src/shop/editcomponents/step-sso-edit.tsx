import React from 'react';
import { Row, Col, Form, Input, Button, Icon, DatePicker, message, Popover } from 'antd';
import { QMUpload, noop, Const, ValidConst, QMMethod } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

export default class StepTwo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      ssoForm: {}
    };
  }
  componentDidMount() {
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.getStoreSooSetting();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        ssoForm: res.context
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.ssoForm;
    data[field] = value;
    this.setState({
      ssoForm: data
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="logIn" />}>
                {getFieldDecorator('logIn', {
                  initialValue: this.state.ssoForm.logIn
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'logIn',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="userinfoURL" />}>
                {getFieldDecorator('userInfoUrl', {
                  initialValue: this.state.ssoForm.userInfoUrl
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'userInfoUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="clientID" />}>
                {getFieldDecorator('clientId', {
                  initialValue: this.state.ssoForm.clientId
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'clientId',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="issuer" />}>
                {getFieldDecorator('issuer', {
                  initialValue: this.state.ssoForm.issuer
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'issuer',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="pedirectURL" />}>
                {getFieldDecorator('redirectUrl', {
                  initialValue: this.state.ssoForm.redirectUrl
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'redirectUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="registration" />}>
                {getFieldDecorator('registration', {
                  initialValue: this.state.ssoForm.registration
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'registration',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="registerPrefix" />}>
                {getFieldDecorator('registerPrefix', {
                  initialValue: this.state.ssoForm.registerPrefix
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'registerPrefix',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="registerCallback" />}>
                {getFieldDecorator('registerCallback', {
                  initialValue: this.state.ssoForm.registerCallback
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'registerCallback',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this._next}>
                  <FormattedMessage id="save" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  /**
   * 保存
   */
  _next = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.onSave();
      }
    });
  };

  onSave = async () => {
    const ssoForm = this.state.ssoForm;
    const { res } = await webapi.saveStoreCSooSetting({
      ...ssoForm
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
    }
  };
}
