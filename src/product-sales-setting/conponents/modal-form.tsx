import React, { Component } from 'react';
import { Form, Input, Select, Modal, Button, Radio } from 'antd';
import { cache } from 'qmkit';
import { translateAddBatch, addSysDictionary } from '../webapi';

interface Props {
  visible: boolean;
  formData?: any;
  handleOk: Function;
  handleCancel: Function;
  form: any;
  languageList: any;
}

class ModalForm extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: props.formData,
      loading: false
    };
  }

  handleOk = (e: any) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        this.handleSubmit(values);
      }
    });
  };
  handleSubmit = (values) => {
    const { languageList } = this.props;
    this.setState({
      loading: true
    });
    let data = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '');
    new Promise((resolve) => {
      let d = languageList.map((item) => {
        for (let it in values) {
          if (item.id == it) {
            return {
              name: values.name,
              languageId: it,
              translateName: values[it]
            };
          }
        }
      });
      resolve(d);
    }).then(async (translateList) => {
      await translateAddBatch({ translateList });
      await addSysDictionary({
        type: values.type,
        name: values.name,
        valueEn: values.valueEn,
        description: '',
        priority: 123,
        storeId: data.storeId
      });
      this.props.form.resetFields();
      this.props.handleOk();
      this.setState({
        loading: false
      });
    });
  };
  handleCancel = (e: any) => {
    e.preventDefault();
    this.props.handleCancel();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, languageList } = this.props;
    return (
      <div>
        <Modal
          title="Add new frequency"
          visible={visible}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              OK
            </Button>
          ]}
        >
          <Form name="complex-form" labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
            <Form.Item label="Frequency type">
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  frequency type!'
                  }
                ]
              })(
                <Select placeholder="Please input  frequency type!">
                  <Select.Option value="Frequency_month">Frequency Month</Select.Option>
                  <Select.Option value="Frequency_week">Frequency Week</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Frequency name">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  frequency name!'
                  }
                ]
              })(<Input placeholder="Please input  frequency name!" />)}
            </Form.Item>
            <Form.Item label="Frequency value">
              {getFieldDecorator('valueEn', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  frequency value!'
                  }
                ]
              })(<Input placeholder="Please input  frequency value!" />)}
            </Form.Item>
            <Form.Item label={<span className="ant-form-item-required">Display name</span>} style={{ marginBottom: 0 }}>
              {languageList &&
                languageList.map((item, i) => (
                  <Form.Item key={item.id}>
                    {getFieldDecorator(`${item.id}`, {
                      rules: [
                        {
                          required: i === 0 ? true : false,
                          message: `Please input ${item.name}  name!`
                        }
                      ]
                    })(<Input placeholder={item.name} />)}
                  </Form.Item>
                ))}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ModalForm);
