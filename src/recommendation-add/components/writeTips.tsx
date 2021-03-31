import { Checkbox, Form, Input } from 'antd';
import React from 'react';
export default class PaymentInformation extends React.Component<any, any> {
  state = {
    status: false
  };
  constructor(props) {
    super(props);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 2},
      },
      wrapperCol: {
        sm: { span: 5 },
      },
    };
    return (
      <div>
        <Form >
          <Form.Item label="What we suggest/ recommend for your cat">
            {getFieldDecorator('storeName1', {

            })(<Input placeholder="Input"/>)}

          </Form.Item>
          <Form.Item label="We recommend to you the following optimal nutrition">
            {getFieldDecorator('export2', {

            })(<Input placeholder="Input"/>)}

          </Form.Item>
          <Form.Item label="Paris (Y/N)" {...formItemLayout}>
            {getFieldDecorator('paris', {

            })(<Checkbox ></Checkbox>)}

          </Form.Item>
          <Form.Item label="Pick up (Y/N)"  {...formItemLayout}>
            {getFieldDecorator('pickup', {

            })(<Checkbox ></Checkbox>)}

          </Form.Item>
        </Form>
      </div>
    );
  }
}
