import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col
} from 'antd';

import * as webapi from './../webapi';
import { history } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class DictionaryForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dictionaryForm: {
        id: '',
        name: '',
        type: '',
        description: '',
        valueEn: '',
        priority: 0
      },
      dictionaryTypes: []
    };
    this.getDetail = this.getDetail.bind(this);

    if (this.props.id) {
      this.getDetail(this.props.id);
    }
    this.queryClinicsDictionary();
  }
  componentDidMount() {
    if (!this.props.id) {
      this.props.form.setFieldsValue({
        priority: 0
      });
    }
  }
  getDetail = async (id) => {
    const { res } = await webapi.getDictionaryDetails({
      id: id
    });
    if (res.code === 'K-000000') {
      let dictionaryForm = {
        id: res.context.id,
        name: res.context.name,
        type: res.context.type,
        description: res.context.description,
        valueEn: res.context.valueEn,
        priority: res.context.priority
      };
      this.setState({
        dictionaryForm: dictionaryForm
      });
      this.props.form.setFieldsValue({
        id: res.context.id,
        name: res.context.name,
        type: res.context.type,
        description: res.context.description,
        valueEn: res.context.valueEn,
        priority: res.context.priority
      });
    } else {
      message.error(res.message || 'get data faild');
    }
  };
  queryClinicsDictionary = async () => {
    const { res } = await webapi.getDictionaryTypes();
    if (res.code === 'K-000000') {
      this.setState({
        dictionaryTypes: res.context.typeList
      });
    } else {
      message.error(res.message);
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.props.pageType === 'create') {
          this.onCreate();
        }
        if (this.props.pageType === 'edit') {
          this.onUpdate();
        }
      }
    });
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.dictionaryForm;
    data[field] = value;
    this.setState({
      dictionaryForm: data
    });
  };
  onCreate = async () => {
    const dictionaryForm = this.state.dictionaryForm;
    const { res } = await webapi.addDictionary({
      ...dictionaryForm
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'create success');
      history.push('/dictionary');
    } else {
      message.error(res.message || 'create faild');
    }
  };
  onUpdate = async () => {
    let dictionaryForm = this.state.dictionaryForm;
    dictionaryForm.id = this.props.id;
    const { res } = await webapi.updateDictionary({
      ...dictionaryForm
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'update success');
      history.push('/dictionary');
    } else {
      message.error(res.message || 'update faild');
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { dictionaryTypes } = this.state;
    return (
      <Form {...layout} style={{ width: '600px' }} onSubmit={this.handleSubmit}>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: 'Please input Dictionary Name!' }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'name',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Type">
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: 'Please select Dictionary Type' }
            ]
          })(
            <Select
              onChange={(value) => {
                value = value === '' ? null : value;
                this.onFormChange({
                  field: 'type',
                  value
                });
              }}
            >
              {dictionaryTypes.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="Value">
          {getFieldDecorator('valueEn', {
            rules: [
              {
                required: true,
                message: 'Please input Value!'
              }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'valueEn',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Description">
          {getFieldDecorator(
            'description',
            {}
          )(
            <Input.TextArea
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'description',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Priority">
          {getFieldDecorator(
            'priority',
            {}
          )(
            <InputNumber
              min={0}
              onChange={(value) => {
                this.onFormChange({
                  field: 'priority',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          {this.props.pageType === 'edit' ? (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          )}
          <Button style={{ marginLeft: '20px' }}>
            <Link to="/dictionary">Back List</Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(DictionaryForm);
