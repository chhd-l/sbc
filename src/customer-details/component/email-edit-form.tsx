import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { customerEmailExist, customerSaveEmail } from './webapi';
import { FormattedMessage } from 'react-intl';
import { RCi18n, Const } from 'qmkit';

interface IProps extends FormComponentProps {
  customerId: string;
  email: string;
  disableEdit: boolean;
}

const EmailEditForm: React.FC<IProps> = ({ customerId, email, disableEdit, form }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(disableEdit);

  const { getFieldDecorator } = form;

  const handleOpen = () => {
    if (!disabled && !disableEdit) {
      setVisible(true);
      form.resetFields();
    }
  }

  const handleSave = () => {
    form.validateFields(null, (err, values) => {
      if (!err) {
        setLoading(true);
        customerEmailExist(values.email).then(data => {
          if (data.res.context) {
            form.setFields({
              email: { value: values.email, errors: [new Error(RCi18n({id:'PetOwner.EmailAddressExisted'}))] }
            })
            setLoading(false);
          } else {
            customerSaveEmail(customerId, values.email).then(saveResp => {
              if (saveResp.res.code === Const.SUCCESS_CODE && saveResp.res.context) {
                message.success(RCi18n({id:'PetOwner.EmailEditSuccessAlert'}));
                setDisabled(true);
                setVisible(false);
              } else {
                message.error(RCi18n({id:'Product.OperationFailed'}));
              }
            }).finally(() => {
              setLoading(false);
            })
          }
        })
      }
    })
  }

  return (
    <div>
      <div>
        <span>{email}</span>
        <span
          data-testid="icon"
          className={`iconfont iconEdit edit-icon-next-text ${disabled || disableEdit ? 'disabled' : ''}`}
          onClick={handleOpen}
          style={{visibility:'hidden'}}
        />
      </div>
      <Modal
        title={<FormattedMessage id="PetOwner.EditEmailAddress" />}
        visible={visible}
        width={640}
        okText={<FormattedMessage id="Setting.OK" />}
        cancelText={<FormattedMessage id="Setting.Cancel" />}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
      >
        <Form layout="inline">
          <Form.Item label={<FormattedMessage id="PetOwner.NewEmailAddress" />}>
            {getFieldDecorator('email', {
              rules: [{ required: true, type: 'email', message: <FormattedMessage id="PetOwner.InvalidEmailAlert" /> }]
            })(
              <Input data-testid="email-input" style={{width: 300}} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Form.create<IProps>()(EmailEditForm);
