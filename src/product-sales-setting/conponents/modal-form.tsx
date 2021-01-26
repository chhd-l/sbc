import React, { Component } from 'react';
import { Form, Input, Select, Modal, Button, Radio } from 'antd';

interface Props {
  visible: boolean;
  formData?: any;
  handleOk: Function;
  handleCancel: Function;
  form: any;
}

class ModalForm extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: props.formData
    };
  }

  handleOk = (e: any) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.handleOk(values);
      }
    });
  };

  handleCancel = (e: any) => {
    e.preventDefault();
    this.props.handleCancel();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Modal title="Add new frequency" visible={this.props.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form name="complex-form" labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
            <Form.Item label="Frequency name">
              {getFieldDecorator('frequency', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Display name" style={{ marginBottom: 0 }}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    }
                  ]
                })(<Input />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator('password1', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ModalForm);
