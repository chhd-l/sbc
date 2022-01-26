import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { FormComponentProps, FormItemProps } from 'antd/es/form';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  title?: string;
  description?: string;
}

const formItemLayout: FormItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
};

const EditModal: React.FC<IProps> = (props: IProps) => {
  const [visible, setVisible] = React.useState(false);
  const { getFieldDecorator } = props.form;
  return (
    <React.Fragment>
      <Button type="primary" onClick={() => setVisible(true)}>Edit</Button>
      <Modal
        width={880}
        title="Landing page content"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form>
          <FormItem label="Title" {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: props.title,
              rules: [{ required: true, message: 'This field is required' }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Description" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: props.description,
              rules: [{ required: true, message: 'This field is required' }]
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
