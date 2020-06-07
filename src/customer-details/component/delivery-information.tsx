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
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};

class DeliveryInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      clinicsVOS: [],
      deliveryForm: {
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
      currentId: ''
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
    const { deliveryForm, clinicsVOS } = this.state;
    let params = {
      address1: deliveryForm.address1,
      address2: deliveryForm.address2,
      cityId: deliveryForm.cityId,
      consigneeName: deliveryForm.firstName + deliveryForm.lastName,
      consigneeNumber: deliveryForm.consigneeNumber,
      countryId: deliveryForm.countryId,
      customerId: deliveryForm.customerId,
      deliveryAddress: deliveryForm.address1 + deliveryForm.address2,
      deliveryAddressId: deliveryForm.deliveryAddressId,
      employeeId: deliveryForm.employeeId,
      firstName: deliveryForm.firstName,
      isDefaltAddress: this.state.isDefault ? 1 : 0,
      lastName: deliveryForm.lastName,
      postCode: deliveryForm.postCode,
      provinceId: deliveryForm.provinceId,
      rfc: deliveryForm.rfc,
      type: deliveryForm.type,
      clinicsVOS: clinicsVOS
    };
    webapi
      .updateAddress(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.getAddressList();
          message.success(res.message || 'Successful');
        } else {
          message.error(res.message || 'Update failed');
        }
      })
      .catch((err) => {
        message.error('Update failed');
      });
  };
  getSelectedClinic = (array) => {
    let clinics = [];
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        clinics.push(array[index].clinicsId.toString());
      }
    }
    return clinics;
  };

  getAddressList = () => {
    webapi
      .getAddressListByType(this.props.customerId, 'delivery')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let addressList = res.context.customerDeliveryAddressVOList;

          if (addressList.length > 0) {
            let deliveryForm = this.state.deliveryForm;
            if (this.state.currentId) {
              deliveryForm = addressList.find((item) => {
                return item.deliveryAddressId === this.state.currentId;
              });
            } else {
              deliveryForm = addressList[0];
            }

            let clinicsVOS = this.getSelectedClinic(res.context.clinicsVOS);
            this.props.form.setFieldsValue({
              customerAccount: res.context.customerAccount,
              clinicsVOS: clinicsVOS,
              firstName: deliveryForm.firstName,
              lastName: deliveryForm.lastName,
              consigneeNumber: deliveryForm.consigneeNumber,
              postCode: deliveryForm.postCode,
              cityId: deliveryForm.cityId,
              countryId: deliveryForm.countryId,
              address1: deliveryForm.address1,
              address2: deliveryForm.address2,
              rfc: deliveryForm.rfc
            });
            this.setState({
              currentId: deliveryForm.deliveryAddressId,
              clinicsVOS: res.context.clinicsVOS ? res.context.clinicsVOS : [],
              addressList: addressList,
              deliveryForm: deliveryForm,
              title: deliveryForm.consigneeName,
              isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
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
    let data = this.state.deliveryForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };

  delAddress = () => {
    webapi
      .delAddress(this.state.deliveryForm.deliveryAddressId)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Successful');
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
            clinicList: res.context.content
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  };
  onClinicChange = (clinics) => {
    this.setState({
      clinicsVOS: clinics
    });
  };
  switchAddress = (id) => {
    const { addressList } = this.state;
    let deliveryForm = addressList.find((item) => {
      return item.deliveryAddressId === id;
    });

    this.props.form.setFieldsValue({
      firstName: deliveryForm.firstName,
      lastName: deliveryForm.lastName,
      consigneeNumber: deliveryForm.consigneeNumber,
      postCode: deliveryForm.postCode,
      cityId: deliveryForm.cityId,
      countryId: deliveryForm.countryId,
      address1: deliveryForm.address1,
      address2: deliveryForm.address2,
      rfc: deliveryForm.rfc
    });
    this.setState({
      currentId: id,
      deliveryForm: deliveryForm,
      title: deliveryForm.consigneeName,
      isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
    });
  };

  render() {
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
    const { countryArr, cityArr, clinicList } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Col span={3}>
          <h3>All Address( {this.state.addressList.length} )</h3>
          <ul>
            {this.state.addressList.map((item) => (
              <li
                key={item.deliveryAddressId}
                onClick={() => this.switchAddress(item.deliveryAddressId)}
                style={{
                  cursor: 'pointer',
                  color:
                    item.deliveryAddressId === this.state.currentId
                      ? '#e2001a'
                      : ''
                }}
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
              <div>
                <Checkbox
                  checked={this.state.isDefault}
                  onChange={() => this.clickDefault()}
                >
                  Set default delivery address
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
                        { required: true, message: 'Please input First Name!' }
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
                  <FormItem label="Selected clinics">
                    {getFieldDecorator('clinicsVOS', {
                      rules: [
                        { required: true, message: 'Please Select clinics!' }
                      ]
                    })(
                      <Select
                        mode="tags"
                        placeholder="Please select"
                        style={{ width: '100%' }}
                        onChange={(value, Option) => {
                          let clinics = [];
                          for (let i = 0; i < Option.length; i++) {
                            let clinic = {
                              clinicsId: Option[i].key,
                              clinicsName: Option[i].props.value
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
                            {item.clinicsName}
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
                  <FormItem label="Last Name">
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
                  <FormItem label="Address 1">
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
                  <FormItem label="Address 2">
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
                  <FormItem label="Reference">
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
export default Form.create()(DeliveryInfomation);
