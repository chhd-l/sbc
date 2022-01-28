import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { updateLandingPage } from '../webapi';
import { FormComponentProps, FormItemProps } from 'antd/es/form';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  id: string;
  title?: string;
  description?: string;
  callback?: Function;
}

const formItemLayout: FormItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
};

const EditModal: React.FC<IProps> = (props: IProps) => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const { getFieldDecorator } = props.form;
  const update = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        updateLandingPage({ id: props.id, ...values }).then(data => {
          setLoading(false);
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(data.res.message);
            setVisible(false);
            props.callback && props.callback();
          }
        }).catch(() => setLoading(false));
      }
    });
  };
  return (
    <React.Fragment>
      <Button type="primary" onClick={() => setVisible(true)}>{RCi18n({id:"Marketing.Edit"})}</Button>
      <Modal
        width={880}
        title={RCi18n({id:"Marketing.LandingPageContent"})}
        visible={visible}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
        onOk={update}
        okText={RCi18n({id:"Setting.Save"})}
        cancelText={RCi18n({id:"Setting.Cancel"})}
      >
        <Form>
          <FormItem label={RCi18n({id:"Setting.Title"})} {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: props.title,
              rules: [{ required: true, message: RCi18n({id: "PetOwner.ThisFieldIsRequired"}) }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label={RCi18n({id:"Setting.Description"})} {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: props.description,
              rules: [{ required: true, message: RCi18n({id: "PetOwner.ThisFieldIsRequired"}) }]
            })(
              <Input.TextArea rows={3} />
            )}
          </FormItem>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Form.create<IProps>()(EditModal);
