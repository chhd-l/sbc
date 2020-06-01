import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BasicInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  handleChange = (value) => {
    console.log(value);
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form {...formItemLayout}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="First Name" hasFeedback validateStatus="success">
                {getFieldDecorator('firstName', {
                  rules: [
                    { required: true, message: 'Please input First Name!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last Name" hasFeedback validateStatus="success">
                {getFieldDecorator('lastName', {
                  rules: [
                    { required: true, message: 'Please input Last Name!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Birth Date" hasFeedback validateStatus="success">
                {getFieldDecorator('birthDate', {
                  rules: [
                    { required: true, message: 'Please input Birth Date!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email" hasFeedback validateStatus="success">
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Please input Email!' }]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Phone Number"
                hasFeedback
                validateStatus="success"
              >
                {getFieldDecorator('phoneNumber', {
                  rules: [
                    { required: true, message: 'Please input Phone Number!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Post Code" hasFeedback validateStatus="success">
                {getFieldDecorator('postCode', {
                  rules: [
                    { required: true, message: 'Please input Post Code!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" hasFeedback validateStatus="success">
                {getFieldDecorator('city', {
                  rules: [{ required: true, message: 'Please input City!' }]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Country" hasFeedback validateStatus="success">
                {getFieldDecorator('country', {
                  rules: [{ required: true, message: 'Please input Country!' }]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Address 1" hasFeedback validateStatus="success">
                {getFieldDecorator('address1', {
                  rules: [
                    { required: true, message: 'Please input Address 1!' }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Address 2" hasFeedback validateStatus="success">
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Preferred methods of communication">
                {getFieldDecorator('preferredMethods', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please Select Preferred methods of communication!'
                    }
                  ]
                })(
                  <Radio.Group value={this.state.value}>
                    <Radio value="Phone">Phone</Radio>
                    <Radio value="Email">Email</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Reference" hasFeedback validateStatus="success">
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Selected clinics">
                {getFieldDecorator('selectedClinics', {
                  rules: [{ required: true, message: 'Please Select clinics!' }]
                })(
                  <Select
                    mode="tags"
                    placeholder="Please select"
                    defaultValue={['a10', 'c12']}
                    onChange={this.handleChange}
                    style={{ width: '100%' }}
                  >
                    {[1, 2, 3, 4].map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(BasicInfomation);
