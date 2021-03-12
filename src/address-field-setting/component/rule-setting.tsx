import React from 'react';
import { Const } from 'qmkit';
import { Form, Modal, Input, Radio, Switch, Row, Col } from 'antd';
import { getAddressSetting } from '../webapi';

const FormItem = Form.Item;

class RuleSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      manual: false,
      auto: false,
      addressSettingList: [],
      addressSettingForm: {
        validationUrl: '',
        clientId: '',
        parentKey: '',
        companyCode: '',
        parentPassword: '',
        userKey: '',
        userPassword: '',
        accountNumber: '',
        meterNumber: '',
        clientReferenceId: ''
      }
    };
  }

  getAddressSettingList = () => {
    getAddressSetting().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          addressSettingList: data.res.context.addressApiSettings.filter((ad) => ad.isCustom === 0)
        });
      }
    });
  };

  onCancel = () => {
    this.props.onCloseModal();
  };

  render() {
    const { manual, auto, loading, addressSettingForm } = this.state;
    const {
      visible,
      form: { getFieldDecorator }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <Modal width={1200} visible={visible} title="Address rule setting" confirmLoading={loading} okText="Submit" cancelText="Cancel" onOk={this.onCancel} onCancel={this.onCancel}>
        <Row>
          <Col span={8}>Input manually</Col>
          <Col span={16}>
            <Switch checked={manual} />
          </Col>
          <Col span={8}>Input automatically</Col>
          <Col span={16}>
            <Switch checked={auto} />
          </Col>
        </Row>
        {auto && (
          <Radio.Group value="1">
            <Radio value="1">DaData.ru</Radio>
          </Radio.Group>
        )}
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem label="Validation url">
                {getFieldDecorator('validationUrl', {
                  rules: [{ required: true, message: 'Validation url is required' }],
                  initialValue: addressSettingForm.validationUrl
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Client id">
                {getFieldDecorator('clientId', {
                  rules: [{ required: true, message: 'Client id is required' }],
                  initialValue: addressSettingForm.clientId
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Parent key">
                {getFieldDecorator('parentKey', {
                  rules: [{ required: true, message: 'Parent key is required' }],
                  initialValue: addressSettingForm.parentKey
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Company code">
                {getFieldDecorator('companyCode', {
                  rules: [{ required: true, message: 'Company code is required' }],
                  initialValue: addressSettingForm.companyCode
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Parent password">
                {getFieldDecorator('parentPassword', {
                  rules: [{ required: true, message: 'Parent password is required' }],
                  initialValue: addressSettingForm.parentPassword
                })(<Input.Password />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="User key">
                {getFieldDecorator('userKey', {
                  rules: [{ required: true, message: 'User key is required' }],
                  initialValue: addressSettingForm.userKey
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="User password">
                {getFieldDecorator('userPassword', {
                  rules: [{ required: true, message: 'User password is required' }],
                  initialValue: addressSettingForm.userPassword
                })(<Input.Password />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Account number">
                {getFieldDecorator('accountNumber', {
                  rules: [{ required: true, message: 'Account number is required' }],
                  initialValue: addressSettingForm.accountNumber
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Meter number">
                {getFieldDecorator('meterNumber', {
                  rules: [{ required: true, message: 'Meter number is required' }],
                  initialValue: addressSettingForm.meterNumber
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Client reference id">
                {getFieldDecorator('clientReferenceId', {
                  rules: [{ required: true, message: 'Client reference id is required' }],
                  initialValue: addressSettingForm.clientReferenceId
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<any>()(RuleSetting);
