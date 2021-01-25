import React, { Component } from 'react';
import { Modal, Button, Form, Input, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { string } from 'prop-types';
import './../index.less';
const FormItem = Form.Item;

interface FormItemType {
  label: string;
  key: string;
  value: string;
  rules: Array<any>;
  placeholder?: string;
}

interface Iprop extends FormComponentProps {
  name: string;
  visible: boolean;
  loading: boolean;
  descName: string;
  dipName: Array<FormItemType>;
  status: boolean;
  onSubmit: Function;
  onCancel: Function;
  onChangeFormVisibility: (status: boolean) => void;
  onChangeFormLoading: (status: boolean) => void;
}

class CreateForm extends Component<Iprop> {
  constructor(props: Iprop) {
    super(props);
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { name, visible, loading, onChangeFormVisibility, descName, dipName, status } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    return (
      <Modal
        zIndex={1000}
        width="600px"
        title={name}
        visible={visible}
        confirmLoading={loading}
        maskClosable={false}
        onCancel={() => onChangeFormVisibility(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              onChangeFormVisibility(false);
            }}
          >
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
            Confirm
          </Button>
        ]}
      >
        <Form {...formItemLayout}>
          <FormItem key="descName" label="Description name">
            {getFieldDecorator('descName', {
              rules: [{ required: true, message: 'Description name is required' }],
              initialValue: descName
            })(<Input style={{ width: '80%' }} />)}
          </FormItem>
          {dipName.map((item: FormItemType, idx: number) => (
            <FormItem key={item.key} label={item.label} className={item.label === ' ' ? 'emit-lable-item' : ''}>
              {getFieldDecorator(item.key, {
                rules: item.rules,
                initialValue: item.value
              })(<Input style={{ width: '80%' }} placeholder={item.placeholder || ''} />)}
            </FormItem>
          ))}
          <div className="ant-form-item-required" style={{ color: '#f5222d' }}>
            The number display name is set in shop information
          </div>
          <FormItem key="status" label="Status">
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: status
            })(<Switch />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<Iprop>()(CreateForm);
