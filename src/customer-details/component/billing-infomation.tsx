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
  Empty,
  Spin
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { addressList } from '@/order-add-old/webapi';

const { TextArea } = Input;

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
      customerAccount: '',
      clinicsVOS: [],

      billingForm: {
        firstName: '',
        lastName: '',
        consigneeNumber: '',
        postCode: '',
        cityId: '',
        countryId: '',
        address1: '',
        address2: '',
        rfc: '',
        deliveryAddressId: ''
      },
      title: '',
      countryArr: [],
      cityArr: [],
      // customerId:this.props.match.params.id ? this.props.match.params.id : '',
      addressList: [],
      isDefault: false,
      clinicList: [],
      currentId: '',
      loading: true
    };
  }
  componentDidMount() {
    this.getDict();
    this.getAddressList();
    this.getClinicList();
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
      consigneeName: billingForm.firstName + ' ' + billingForm.lastName,
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
          this.getAddressList();
          message.success('Successful');
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  getSelectedClinic = (array) => {
    let clinics = [];
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        clinics.push(array[index].clinicsId);
      }
    }
    return clinics;
  };

  getAddressList = () => {
    webapi
      .getAddressListByType(this.props.customerId, 'billing')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let addressList = res.context.customerDeliveryAddressVOList;
          if (addressList.length > 0) {
            let billingForm = this.state.billingForm;
            if (this.state.currentId) {
              billingForm = addressList.find((item) => {
                return item.deliveryAddressId === this.state.currentId;
              });
            } else {
              billingForm = addressList[0];
            }

            let clinicsVOS = this.getSelectedClinic(res.context.clinicsVOS);
            this.props.form.setFieldsValue({
              customerAccount: res.context.customerAccount,
              clinicsVOS: clinicsVOS,
              firstName: billingForm.firstName,
              lastName: billingForm.lastName,
              consigneeNumber: billingForm.consigneeNumber,
              postCode: billingForm.postCode,
              cityId: billingForm.cityId,
              countryId: billingForm.countryId,
              address1: billingForm.address1,
              address2: billingForm.address2,
              rfc: billingForm.rfc
            });
            this.setState({
              currentId: billingForm.deliveryAddressId,
              clinicsVOS: res.context.clinicsVOS ? res.context.clinicsVOS : [],
              addressList: addressList,
              billingForm: billingForm,
              title: billingForm.consigneeName,
              isDefault: billingForm.isDefaltAddress === 1 ? true : false
            });
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
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
          message.success('Successful');
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
  };
  getClinicList = () => {
    webapi
      .fetchClinicList({
        pageNum: 0,
        pageSize: 1000
      })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.setState({
            loading: false,
            clinicList: res.context.content
          });
        } else {
          this.setState({
            loading: false
          });
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error('Unsuccessful');
      });
  };

  onClinicChange = (clinics) => {
    this.setState({
      clinicsVOS: clinics
    });
  };

  switchAddress = (id) => {
    const { addressList } = this.state;
    let billingForm = addressList.find((item) => {
      return item.deliveryAddressId === id;
    });

    this.props.form.setFieldsValue({
      firstName: billingForm.firstName,
      lastName: billingForm.lastName,
      consigneeNumber: billingForm.consigneeNumber,
      postCode: billingForm.postCode,
      cityId: billingForm.cityId,
      countryId: billingForm.countryId,
      address1: billingForm.address1,
      address2: billingForm.address2,
      rfc: billingForm.rfc
    });
    this.setState({
      currentId: id,
      billingForm: billingForm,
      title: billingForm.consigneeName,
      isDefault: billingForm.isDefaltAddress === 1 ? true : false
    });
  };

  render() {
    const { countryArr, cityArr, clinicList } = this.state;
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Spin spinning={this.state.loading}>
          <Col span={3}>
            <h3>All Address( {this.state.addressList.length} )</h3>
            <ul>
              {this.state.addressList.map((item) => (
                <li
                  key={item.deliveryAddressId}
                  style={{
                    cursor: 'pointer',
                    color:
                      item.deliveryAddressId === this.state.currentId
                        ? '#e2001a'
                        : ''
                  }}
                  onClick={() => this.switchAddress(item.deliveryAddressId)}
                >
                  {item.consigneeName}
                </li>
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
                <div
                  style={{
                    display:
                      this.props.customerType === 'Guest' ? 'none' : 'block'
                  }}
                >
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
                  <Col
                    span={12}
                    style={{
                      display:
                        this.props.customerType !== 'Guest' ? 'none' : 'block'
                    }}
                  >
                    <FormItem label="Consumer Account">
                      {getFieldDecorator('customerAccount', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input First Name!'
                          }
                        ]
                      })(<Input disabled={true} />)}
                    </FormItem>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      display:
                        this.props.customerType !== 'Guest' ? 'none' : 'block'
                    }}
                  >
                    <FormItem label="Selected Prescriber">
                      {getFieldDecorator('clinicsVOS', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Prescriber!'
                          }
                        ]
                      })(
                        <Select
                          mode="tags"
                          disabled={this.props.customerType === 'Guest'}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          onChange={(value, Option) => {
                            let clinics = [];
                            for (let i = 0; i < Option.length; i++) {
                              let clinic = {
                                clinicsId: Option[i].props.value,
                                clinicsName: Option[i].props.children
                              };
                              clinics.push(clinic);
                            }

                            this.onClinicChange(clinics);
                          }}
                        >
                          {/* {
                          clinicList.map((item) => (
                            <Option value={item.clinicsId} key={item.clinicsId}>{item.clinicsName}</Option>
                          ))} */}
                          {clinicList.map((item) => (
                            <Option
                              value={item.clinicsId.toString()}
                              key={item.clinicsId}
                            >
                              {item.clinicsId + ',' + item.clinicsName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="First Name">
                      {getFieldDecorator('firstName', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input First Name!'
                          }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="Last Name">
                      {getFieldDecorator('lastName', {
                        rules: [
                          { required: true, message: 'Please input Last Name!' }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="Phone Number">
                      {getFieldDecorator('consigneeNumber', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Phone Number!'
                          }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="Post Code">
                      {getFieldDecorator('postCode', {
                        rules: [
                          { required: true, message: 'Please input Post Code!' }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="Country">
                      {getFieldDecorator('countryId', {
                        rules: [
                          { required: true, message: 'Please input Country!' }
                        ]
                      })(
                        <Select
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="City">
                      {getFieldDecorator('cityId', {
                        rules: [
                          { required: true, message: 'Please input City!' }
                        ]
                      })(
                        <Select
                          disabled={this.props.customerType === 'Guest'}
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
                    <FormItem label="Address 1">
                      {getFieldDecorator('address1', {
                        rules: [
                          { required: true, message: 'Please input Address 1!' }
                        ]
                      })(
                        <TextArea
                          disabled={this.props.customerType === 'Guest'}
                          autoSize={{ minRows: 3, maxRows: 3 }}
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
                    <FormItem label="Address 2">
                      {getFieldDecorator(
                        'address2',
                        {}
                      )(
                        <TextArea
                          disabled={this.props.customerType === 'Guest'}
                          autoSize={{ minRows: 3, maxRows: 3 }}
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
                    <FormItem label="Reference">
                      {getFieldDecorator(
                        'rfc',
                        {}
                      )(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          marginRight: '20px',
                          display:
                            this.props.customerType === 'Guest' ? 'none' : null
                        }}
                      >
                        Save
                      </Button>

                      <Button>
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Spin>
      </Row>
    );
  }
}
export default Form.create()(BillingInfomation);
