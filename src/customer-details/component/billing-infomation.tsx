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
  Card,
  Checkbox,
  Empty
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

class BillingInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      billingForm: {
        firstName: '',
        lastName: '',
        consigneeNumber: '',
        postCode: '',
        cityId: '',
        countryId: '',
        address1: '',
        address2: '',
        rfc: ''
      },
      title: '',
      countryArr: [],
      cityArr: [],
      // customerId:this.props.match.params.id ? this.props.match.params.id : '',
      addressList: [],
      isDefault: false
    };
  }
  componentDidMount() {
    this.getDict();
    this.getAddressList();
  }

  getDict = () => {
    let countryArr = JSON.parse(sessionStorage.getItem('dict-country'));
    let cityArr = JSON.parse(sessionStorage.getItem('dict-city'));
    this.setState({
      countryArr: countryArr,
      cityArr: cityArr
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveDeliveryAddress();
      }
    });
  };

  saveDeliveryAddress = () => {
    const { billingForm } = this.state;
    let params = {
      address1: billingForm.address1,
      address2: billingForm.address2,
      cityId: billingForm.cityId,
      consigneeName: billingForm.firstName + billingForm.lastName,
      consigneeNumber: billingForm.consigneeNumber,
      countryId: billingForm.countryId,
      customerId: billingForm.customerId,
      deliveryAddress: billingForm.address1 + billingForm.address2,
      deliveryAddressId: billingForm.deliveryAddressId,
      employeeId: billingForm.employeeId,
      firstName: billingForm.firstName,
      isDefaltAddress: this.state.isDefault ? 1 : 0,
      lastName: billingForm.lastName,
      postCode: billingForm.postCode,
      provinceId: billingForm.provinceId,
      rfc: billingForm.rfc,
      type: billingForm.type
    };
    webapi
      .updateAddress(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Update success');
        } else {
          message.error(res.message || 'Update failed');
        }
      })
      .catch((err) => {
        message.error('Update failed');
      });
  };

  getAddressList = () => {
    webapi
      .getAddressListByType(this.props.customerId, 'billing')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let addressList = res.context;
          if (addressList.length > 0) {
            let billingForm = addressList[0];

            this.props.form.setFieldsValue({
              firstName: addressList[0].firstName,
              lastName: addressList[0].lastName,
              consigneeNumber: addressList[0].consigneeNumber,
              postCode: addressList[0].postCode,
              cityId: addressList[0].cityId,
              countryId: addressList[0].countryId,
              address1: addressList[0].address1,
              address2: addressList[0].address2,
              rfc: addressList[0].rfc
            });
            this.setState({
              addressList: addressList,
              billingForm: billingForm,
              title: addressList[0].consigneeName,
              isDefault: addressList[0].isDefaltAddress === 1 ? true : false
            });
          }
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  };

  onFormChange = ({ field, value }) => {
    let data = this.state.billingForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };

  delAddress = () => {
    webapi
      .delAddress(this.state.billingForm.deliveryAddressId)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Delete success');
        } else {
          message.error(res.message || 'Delete failed');
        }
      })
      .catch((err) => {
        message.error('Delete failed');
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
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
      <Row>
        <Col span={3}>
          <h3>All Address( {this.state.addressList.length} )</h3>
          <ul>
            {this.state.addressList.map((item) => (
              <li key={item.id}>{item.consigneeName}</li>
            ))}
          </ul>
        </Col>
        <Col span={20}>
          {this.state.addressList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
          <Card
            title={this.state.title}
            style={{
              display: this.state.addressList.length === 0 ? 'none' : 'block'
            }}
            extra={
              <div>
                <Checkbox
                  checked={this.state.isDefault}
                  onChange={() => this.clickDefault()}
                >
                  Set default billing address
                </Checkbox>
                <Button
                  type="danger"
                  icon="close"
                  onClick={() => this.delAddress()}
                >
                  Delete
                </Button>
              </div>
            }
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem
                    label="First Name"
                    hasFeedback
                    validateStatus="success"
                  >
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
                  <FormItem
                    label="Last Name"
                    hasFeedback
                    validateStatus="success"
                  >
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
                  <FormItem
                    label="Phone Number"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator('consigneeNumber', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Phone Number!'
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'consigneeNumber',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Post Code"
                    hasFeedback
                    validateStatus="success"
                  >
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
                  <FormItem
                    label="Country"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator('countryId', {
                      rules: [
                        { required: true, message: 'Please input Country!' }
                      ]
                    })(
                      <Select
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'countryId',
                            value
                          });
                        }}
                      >
                        {countryArr.map((item) => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="City" hasFeedback validateStatus="success">
                    {getFieldDecorator('cityId', {
                      rules: [{ required: true, message: 'Please input City!' }]
                    })(
                      <Select
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'cityId',
                            value
                          });
                        }}
                      >
                        {cityArr.map((item) => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Address 1"
                    hasFeedback
                    validateStatus="success"
                  >
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
                  <FormItem
                    label="Address 2"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator(
                      'address2',
                      {}
                    )(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'address2',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Reference"
                    hasFeedback
                    validateStatus="success"
                  >
                    {getFieldDecorator(
                      'rfc',
                      {}
                    )(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'rfc',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={24}>
                  <FormItem>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>

                    <Button style={{ marginLeft: '20px' }}>
                      <Link to="/customer-list">Cancle</Link>
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
export default Form.create()(BillingInfomation);
