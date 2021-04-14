import React from 'react';
import { Form, Input, Button, Modal } from 'antd';

import { FormattedMessage, injectIntl } from 'react-intl';

class GuestForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  onConfirm = () => {
    const { onClose } = this.props;
    this.props.form.validateFields((err, fields) => {
      if(!err) {
        onClose(fields);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible, onClose } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal width={700} visible={visible} title={<FormattedMessage id="Order.offline.consumerInformation" />} onCancel={() => onClose()} footer={null}>
        <Form labelCol={{sm: {span: 6}}} wrapperCol={{sm: {span: 16}}}>
          <Form.Item label={<FormattedMessage id="Order.offline.consumerName" />}>
            {getFieldDecorator('customerName', {
              initialValue: '',
              rules: [{ required: true, message: (window as any).RCi18n({id:'Order.offline.consumerNameRequired'}) }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="Order.offline.consumerEmail" />}>
            {getFieldDecorator('email', {
              initialValue: '',
              rules: [{ type: 'email', required: true, message: (window as any).RCi18n({id:'Order.offline.consumerEmailRequired'}) }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="Order.offline.consumerPhone" />}>
            {getFieldDecorator('contactPhone', {
              initialValue: ''
            })(<Input />)}
          </Form.Item>
        </Form>
        <div style={{textAlign: 'center', marginTop: 20}}>
          <Button type="primary" onClick={this.onConfirm}><FormattedMessage id="Order.OK" /></Button>
        </div>
      </Modal>
    );
  }
}

export default Form.create<any>()(injectIntl(GuestForm));
