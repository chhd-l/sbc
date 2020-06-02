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
  DatePicker
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
    this.state = {
      basicForm: {
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        phoneNumber: '',
        postCode: '',
        city: '',
        country: '',
        address1: '',
        address2: '',
        preferredMethods: '',
        ref: '',
        selectedClinics: []
      },
      countryArr: [],
      cityArr: []
    };
  }
  componentDidMount() {
    this.queryClinicsDictionary('country');
    this.queryClinicsDictionary('city');
  }
  handleChange = (value) => {
    console.log(value);
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.basicForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        console.log(this.state.basicForm);
      }
    });
  };

  queryClinicsDictionary = async (type: String) => {
    const { res } = await webapi.queryClinicsDictionary({
      type: type
    });
    if (res.code === 'K-000000') {
      if (type === 'city') {
        this.setState({
          cityArr: res.context
        });
      }
      if (type === 'country') {
        this.setState({
          countryArr: res.context
        });
      }
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { countryArr, cityArr } = this.state;
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
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="First Name" hasFeedback validateStatus="success">
                {getFieldDecorator('firstName', {
                  rules: [
                    { required: true, message: 'Please input First Name!' }
                  ]
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'firstName',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last Name" hasFeedback validateStatus="success">
                {getFieldDecorator('lastName', {
                  rules: [
                    { required: true, message: 'Please input Last Name!' }
                  ]
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'lastName',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Birth Date" hasFeedback validateStatus="success">
                {getFieldDecorator('birthDate', {
                  rules: [
                    { required: true, message: 'Please input Birth Date!' }
                  ]
                })(
                  <DatePicker
                    onChange={(date, dateString) => {
                      debugger;
                      const value = dateString;
                      this.onFormChange({
                        field: 'birthDate',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email" hasFeedback validateStatus="success">
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Please input Email!' }]
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'email',
                        value
                      });
                    }}
                  />
                )}
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
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'phoneNumber',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Post Code" hasFeedback validateStatus="success">
                {getFieldDecorator('postCode', {
                  rules: [
                    { required: true, message: 'Please input Post Code!' }
                  ]
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'postCode',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Country" hasFeedback validateStatus="success">
                {getFieldDecorator('country', {
                  rules: [{ required: true, message: 'Please input Country!' }]
                })(
                  <Select
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'country',
                        value
                      });
                    }}
                  >
                    {countryArr.map((item) => (
                      <Option value={item.valueEn} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" hasFeedback validateStatus="success">
                {getFieldDecorator('city', {
                  rules: [{ required: true, message: 'Please input City!' }]
                })(
                  <Select
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'city',
                        value
                      });
                    }}
                  >
                    {cityArr.map((item) => (
                      <Option value={item.valueEn} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Address 1" hasFeedback validateStatus="success">
                {getFieldDecorator('address1', {
                  rules: [
                    { required: true, message: 'Please input Address 1!' }
                  ]
                })(
                  <Input
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'address1',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Address 2" hasFeedback validateStatus="success">
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'address2',
                      value
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                labelCol={{
                  span: 0
                }}
                wrapperCol={{
                  span: 24
                }}
              >
                <div style={{ display: 'inline-block', height: '40px' }}>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    *
                  </span>
                  <label style={{ minWidth: '200px', marginRight: '10px' }}>
                    Preferred methods of communication:
                  </label>
                </div>

                {getFieldDecorator('preferredMethods', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please Select Preferred methods of communication!'
                    }
                  ]
                })(
                  <Radio.Group
                    style={{ display: 'inline', height: '40px' }}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'preferredMethods',
                        value
                      });
                    }}
                  >
                    <Radio value="Phone">Phone</Radio>
                    <Radio value="Email">Email</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Reference" hasFeedback validateStatus="success">
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'ref',
                      value
                    });
                  }}
                />
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
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      this.onFormChange({
                        field: 'selectedClinics',
                        value
                      });
                    }}
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
      </div>
    );
  }
}
export default Form.create()(BasicInfomation);
