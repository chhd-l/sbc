import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { customerEmailExist, customerSaveEmail } from './webapi';

import '../index.less';

interface IProps extends FormComponentProps {
  email: string;
}

const EmailEditForm: React.FC<IProps> = ({ email, form }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getFieldDecorator } = form;

  const handleSave = () => {
    form.validateFields(null, (err, values) => {
      if (!err) {
        setLoading(true);
        customerEmailExist(values.email).then(data => {
          console.log(data);
        })
      }
    })
  }

  return (
    <div>
      <div><span>{email}</span> <span className="iconfont iconEdit edit-icon-next-text" onClick={() => setVisible(true)}></span></div>
      <Modal
        title="Edit Email Address"
        visible={visible}
        width={640}
        okText="OK"
        cancelText="Cancel"
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="inline">
          <Form.Item label="New email address">
            {getFieldDecorator('email', {
              rules: [{ required: true, type: 'email', message: "Invalid email address" }]
            })(
              <Input style={{width: 300}} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Form.create<IProps>()(EmailEditForm);
