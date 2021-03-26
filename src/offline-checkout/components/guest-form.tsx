import React from 'react';
import { Form, Input, Button, Modal } from 'antd';

class GuestForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  onConfirm = () => {
    const { onClose } = this.props;
    this.props.form.validateFields((err, fields) => {
      if(!err) {
        onClose(fields);
      }
    });
  };

  render() {
    const { visible, onClose } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal visible={visible} title="Consumer information" onCancel={() => onClose()} footer={null}>
        <Form labelCol={{sm: {span: 6}}} wrapperCol={{sm: {span: 16}}}>
          <Form.Item label="Consumer name">
            {getFieldDecorator('consumerName', {
              initialValue: '',
              rules: [{ required: true, message: 'Consumer name is required' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Consumer email">
            {getFieldDecorator('consumerEmail', {
              initialValue: '',
              rules: [{ required: true, message: 'Consumer name is required' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Consumer name">
            {getFieldDecorator('consumerPhone', {
              initialValue: ''
            })(<Input />)}
          </Form.Item>
        </Form>
        <div style={{textAlign: 'center', marginTop: 20}}>
          <Button type="primary" size="large">Next</Button>
        </div>
      </Modal>
    );
  }
}

export default Form.create<any>()(GuestForm);
