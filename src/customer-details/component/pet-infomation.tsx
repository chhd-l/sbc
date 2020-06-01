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
  Radio,
  Menu,
  Card
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PetInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      petList: ['Rita', 'Rita2']
    };
  }
  handleChange = (value) => {
    console.log(value);
  };
  onOpenChange = (value) => {
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
      <Row>
        <Col span={3}>
          <h3>All Pet {this.state.petList.length}</h3>
          <ul>
            {this.state.petList.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </Col>
        <Col span={20}>
          <Card title="Pet 1" bordered={false} type="inner">
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem
                    label="Pet Category"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator('petCategory', {
                      rules: [
                        {
                          required: true,
                          message: 'Please selected Pet Category!'
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Pet Name"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator('petName', {
                      rules: [
                        { required: true, message: 'Please input Pet Name!' }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Gender" hasFeedback validateStatus="success">
                    {getFieldDecorator('gender', {
                      rules: [
                        { required: true, message: 'Please selected Gender!' }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Breed" hasFeedback validateStatus="success">
                    {getFieldDecorator('breed', {
                      rules: [
                        { required: true, message: 'Please selected Breed!' }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="Weight" hasFeedback validateStatus="success">
                    {getFieldDecorator('weight', {
                      rules: [
                        { required: true, message: 'Please input Weight!' }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Sterilized status">
                    {getFieldDecorator('preferredMethods', {
                      rules: [
                        {
                          required: true,
                          message: 'Please Select Sterilized status!'
                        }
                      ]
                    })(
                      <Radio.Group value={this.state.value}>
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Birthday"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator('birthday', {
                      rules: [
                        { required: true, message: 'Please input Birthday!' }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Special needs">
                    {getFieldDecorator('specialNeeds', {
                      rules: [
                        {
                          required: true,
                          message: 'Please Selected Special needs!'
                        }
                      ]
                    })(
                      <Select
                        mode="tags"
                        placeholder="Please select"
                        defaultValue={['1', '3']}
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
                <Col span={24}>
                  <FormItem>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>

                    <Button style={{ marginLeft: '20px' }}>
                      <Link to="/costomer-list">Cancle</Link>
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Form.create()(PetInfomation);
