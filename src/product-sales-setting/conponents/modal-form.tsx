import React, { Component } from 'react';
import { Form, Input, Select, Modal, Button, Radio } from 'antd';

interface Props {
  visible: boolean;
  formData?: any;
  handleOk: Function;
  handleCancel: Function;
  form: any;
  languageList: any;
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
    const { visible, languageList } = this.props;
    return (
      <div>
        <Modal title="Add new frequency" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form name="complex-form" labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
            <Form.Item label="Frequency type">
              {getFieldDecorator('frequencyType', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  frequency name!'
                  }
                ]
              })(
                <Select>
                  <Select.Option value="Frequency_month">Frequency Month</Select.Option>
                  <Select.Option value="Frequency_week">Frequency Week</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Frequency name">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  frequency name!'
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Display name" style={{ marginBottom: 0 }}>
              {languageList &&
                languageList.map((item) => (
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your display name!'
                        }
                      ]
                    })(<Input placeholder={item.name} />)}
                  </Form.Item>
                ))}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ModalForm);
