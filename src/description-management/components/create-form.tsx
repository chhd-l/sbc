import React, { Component } from 'react';
import { Modal, Button, Form, Input, Switch, message, Select } from 'antd';
import { Const } from 'qmkit';
import { FormComponentProps } from 'antd/lib/form/Form';
import { string } from 'prop-types';

const Option = Select.Option;

import { addDescriptionItem, updateDescriptionItem } from '../webapi';

import './../index.less';
import { add } from '@/groupon-add/webapi';
const FormItem = Form.Item;

interface FormItemType {
  languageId: number;
  languageName?: string;
  translateName: string;
  label?: string;
  rules?: Array<any>;
}

interface Iprop extends FormComponentProps {
  id: string;
  name: string;
  visible: boolean;
  loading: boolean;
  descriptionName: string;
  contentType: string;
  translateList: Array<FormItemType>;
  displayStatus: boolean;
  onSubmit: Function;
  onCancel: Function;
  onChangeFormVisibility: (status: boolean) => void;
  onChangeFormLoading: (status: boolean) => void;
}

interface Istate {
  id: string;
  descriptionName: string;
  contentType: string;
  translateList: Array<FormItemType>;
  displayStatus: boolean;
}

class CreateForm extends Component<Iprop, Istate> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      id: this.props.id || undefined,
      descriptionName: this.props.descriptionName,
      contentType: this.props.contentType,
      translateList: this.props.translateList.map((t) => ({ languageId: t.languageId, translateName: t.translateName })),
      displayStatus: this.props.displayStatus
    };
  }

  handleUpdateDescriptionName = (value: string) => {
    this.setState({
      descriptionName: value
    });
  };

  handleUpdateContentType = (type: string) => {
    this.setState({
      contentType: type
    });
  };

  handleUpdateDisplayStatue = (status: boolean) => {
    this.setState({
      displayStatus: status
    });
  };

  handleUpdateDisplayName = (languageId: number, value: string) => {
    this.setState({
      translateList: this.state.translateList.map((t) => {
        if (t.languageId === languageId) {
          t.translateName = value;
        }
        return t;
      })
    });
  };

  handleSubmit = () => {
    const { onChangeFormLoading, onSubmit } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const handleMethodFunc = this.state.id ? updateDescriptionItem : addDescriptionItem;
        onChangeFormLoading(true);
        handleMethodFunc(this.state)
          .then((data) => {
            const { res } = data;
            if (res.code === Const.SUCCESS_CODE) {
              onSubmit(res.message);
            } else {
              onChangeFormLoading(false);
              message.error(res.message || 'Add Data Failed');
            }
          })
          .catch((err) => {
            onChangeFormLoading(false);
            message.error(err || 'Add Data Failed');
          });
      }
    });
  };

  render() {
    const { name, visible, loading, onChangeFormVisibility, descriptionName, contentType, translateList, displayStatus } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const isRequired = this.state.translateList.filter((t) => t.translateName.trim() === '').length === this.state.translateList.length;

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
          <Button key="submit" type="primary" loading={loading} onClick={() => this.handleSubmit()}>
            Confirm
          </Button>
        ]}
      >
        <Form {...formItemLayout}>
          <FormItem key="descName" label="Description name">
            {getFieldDecorator('descName', {
              rules: [{ required: true, message: 'Description name is required' }],
              initialValue: descriptionName
            })(<Input onChange={(e) => this.handleUpdateDescriptionName(e.target.value)} style={{ width: '80%' }} />)}
          </FormItem>
          {translateList.map((item: FormItemType, idx: number) => (
            <FormItem key={item.languageId} label={item.label} required={idx === 0} className={idx === 0 ? '' : 'emit-lable-item'}>
              {getFieldDecorator(item.languageName, {
                rules: [{ required: idx === 0 && isRequired, message: 'Display name is required' }],
                initialValue: item.translateName
              })(<Input onChange={(e) => this.handleUpdateDisplayName(item.languageId, e.target.value)} style={{ width: '80%' }} placeholder={item.languageName || ''} />)}
            </FormItem>
          ))}
          <div className="ant-form-item-required" style={{ color: '#f5222d' }}>
            The number display name is set in shop information
          </div>
          <FormItem key="status" label="Status">
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: displayStatus
            })(<Switch onChange={this.handleUpdateDisplayStatue} />)}
          </FormItem>
          <FormItem key="descType" label="Description type">
            {getFieldDecorator('descType', {
              initialValue: contentType
            })(
              <Select onChange={this.handleUpdateContentType}>
                <Option key="1" value="text">
                  text
                </Option>
                <Option key="2" value="json">
                  json
                </Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<Iprop>()(CreateForm);
