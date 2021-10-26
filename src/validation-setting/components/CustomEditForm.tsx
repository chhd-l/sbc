import React from 'react';
import { Form, Row, Col, Input, Modal } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { editAddressApiSetting } from '../webapi';
import { FormComponentProps } from 'antd/es/form';
import { ReactNode } from 'react-slick/node_modules/@types/react';

export type TEditItem = {
  key: string;
  label: string;
  type: 'string' | 'password';
  span: number;
  offset: number;
  required: boolean;
  requiredMessage: string;
  defaultValue: any;
};

interface CustomEditFormProps extends FormComponentProps {
  editItemList: Array<TEditItem>;
  item: any;
  visible: boolean;
  onCancel: Function;
  onSuccess: Function;
};

const FormItem = Form.Item;

class CustomEditForm extends React.Component<CustomEditFormProps, any> {
  constructor(props: CustomEditFormProps) {
    super(props);
    this.state = {
      loading: false
    };
  }

  renderEditItem = (editItem: TEditItem) => {
    if (editItem.type === 'string') {
      return <Input />;
    } else {
      return <Input.Password />;
    }
  };

  onSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({ loading: true });
        editAddressApiSetting({
          ...(this.props.item || {}),
          ...values,
          requestHeader: values.domain ? JSON.stringify({ Domain: values.domain }) : null
        }).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            this.props.onSuccess();
          } else {
            this.setState({ loading: false });
          }
        }).catch(() => {
          this.setState({ loading: false });
        });
      }
    });
  };

  render() {
    const { visible, editItemList, onCancel, form: { getFieldDecorator } } = this.props;
    const { loading } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <Modal
        visible={visible}
        width={800}
        title={RCi18n({id:"Setting.Edit"})}
        cancelText={RCi18n({id:"Setting.Cancel"})}
        okText={RCi18n({id:"Setting.Submit"})}
        confirmLoading={loading}
        onCancel={() => onCancel()}
        onOk={this.onSave}
      >
        <Form {...formItemLayout}>
          <Row>
          {editItemList.map((editItem, idx) => (
            <Col key={idx} span={editItem.span} offset={editItem.offset}>
              <FormItem label={editItem.label}>
                {getFieldDecorator(editItem.key, {
                  rules: [{ required: editItem.required, message: editItem.requiredMessage }],
                  initialValue: editItem.defaultValue
                })(this.renderEditItem(editItem))}
              </FormItem>
            </Col>
          ))}
          </Row>
        </Form>
      </Modal>
    );
  }

};

export default Form.create<CustomEditFormProps>()(CustomEditForm);
