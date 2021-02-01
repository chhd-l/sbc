import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Input, Select, Modal, Button, Radio } from 'antd';
import ModalForm from './conponents/modal-form';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;

class ProductSearchSetting extends Component<any, any> {
  state = { visible: false, disabled: true };
  onFinish = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleSubmit = () => {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.state;
    return (
      <div style={styles.container}>
        <BreadCrumb />

        <div style={styles.formContainer}>
          <Form name="complex" onSubmit={this.onFinish} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
            <Form.Item label={<span style={{ color: '#666' }}>Default purchase type</span>}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(
                <Radio.Group disabled={disabled}>
                  <Radio.Button value="One-off" style={{ width: 150, textAlign: 'center' }}>
                    One-off
                  </Radio.Button>
                  <Radio.Button value="Subscription" style={{ width: 150, textAlign: 'center' }}>
                    Subscription
                  </Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label={<span style={{ color: '#666' }}>Default subscription frequency</span>} style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                {getFieldDecorator('password6', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    }
                  ]
                })(
                  <Select disabled={disabled}>
                    <Option value="demo">Demo</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
                <Button type="danger" size="default" onClick={this.showModal} disabled={disabled}>
                  Add new frequency
                </Button>
              </Form.Item>
            </Form.Item>
            <div className="bar-button">
              <Button type="primary" onClick={this._edit}>
                {<FormattedMessage id={disabled ? 'Edit' : 'Save'} />}
              </Button>
            </div>
          </Form>
        </div>

        <ModalForm visible={this.state.visible} handleOk={this.handleSubmit} handleCancel={this.handleCancel} />
      </div>
    );
  }
  _edit = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled
    });
  };
}
export default Form.create()(ProductSearchSetting);
const styles = {
  container: {
    background: 'rgb(255, 255, 255)'
  },
  formContainer: {
    marginTop: '30px',
    marginLeft: 35
  }
} as any;
