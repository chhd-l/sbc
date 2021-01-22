import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, Menu, Card, Checkbox, Empty, Spin, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Const } from 'qmkit';
import _ from 'lodash';

const { TextArea } = Input;

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
      currentId: '',
      loading: true,
      objectFetching: false,
      initCityName: ''
    };
  }
  componentDidMount() {
    this.getDict();
    this.getAddressList();
    // this.getClinicList();
  }

  getDict = () => {
    if (JSON.parse(sessionStorage.getItem('dict-country'))) {
      let countryArr = JSON.parse(sessionStorage.getItem('dict-country'));
      this.setState({
        countryArr: countryArr
      });
    } else {
      this.querySysDictionary('country');
    }
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
      consigneeName: deliveryForm.firstName + ' ' + deliveryForm.lastName,
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
          message.success('Operate successfully');
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
      .getAddressListByType(this.props.customerId, 'DELIVERY')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let addressList = res.context.customerDeliveryAddressVOList;
          this.setState({
            loading: false
          });
          if (addressList && addressList.length > 0) {
            let deliveryForm = this.state.deliveryForm;
            if (this.state.currentId) {
              deliveryForm = addressList.find((item) => {
                return item.deliveryAddressId === this.state.currentId;
              });
            } else {
              deliveryForm = addressList[0];
            }

            let clinicsVOS = this.getSelectedClinic(res.context.clinicsVOS);
            if (deliveryForm.cityId) {
              this.getCityNameById(deliveryForm.cityId);
            }

            this.setState(
              {
                currentId: deliveryForm.deliveryAddressId,
                clinicsVOS: res.context.clinicsVOS ? res.context.clinicsVOS : [],
                addressList: addressList,
                deliveryForm: deliveryForm,
                title: deliveryForm.consigneeName,
                isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
                // loading: false
              },
              () => {
                this.props.form.setFieldsValue({
                  customerAccount: res.context.customerAccount,
                  clinicsVOS: clinicsVOS,
                  firstName: deliveryForm.firstName,
                  lastName: deliveryForm.lastName,
                  consigneeNumber: deliveryForm.consigneeNumber,
                  postCode: deliveryForm.postCode,
                  // cityId: deliveryForm.cityId,
                  countryId: deliveryForm.countryId,
                  address1: deliveryForm.address1,
                  address2: deliveryForm.address2,
                  rfc: deliveryForm.rfc
                });
              }
            );
          } else {
            this.setState({
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
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
          message.success('Operate successfully');
          this.getAddressList();
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
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
    if (deliveryForm.cityId) {
      this.getCityNameById(deliveryForm.cityId);
    }

    this.setState(
      {
        currentId: id,
        deliveryForm: deliveryForm,
        title: deliveryForm.consigneeName,
        isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
      },
      () => {
        this.props.form.setFieldsValue({
          firstName: deliveryForm.firstName,
          lastName: deliveryForm.lastName,
          consigneeNumber: deliveryForm.consigneeNumber,
          postCode: deliveryForm.postCode,
          // cityId: deliveryForm.cityId,
          countryId: deliveryForm.countryId,
          address1: deliveryForm.address1,
          address2: deliveryForm.address2,
          rfc: deliveryForm.rfc
        });
      }
    );
  };
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s]{6,20}$/;
    if (!reg.test(form.getFieldValue('consigneeNumber'))) {
      callback('Please enter the correct phone');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('postCode'))) {
      callback('Please enter the correct Post Code');
    } else {
      callback();
    }
  };

  getCityList = (value) => {
    let params = {
      cityName: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi
      .queryCityListByName(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            cityArr: res.context.systemCityVO,
            objectFetching: false
          });
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  getCityNameById = (id) => {
    let params = {
      id: [id]
    };
    webapi
      .queryCityById(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (res.context && res.context.systemCityVO && res.context.systemCityVO[0] && res.context.systemCityVO[0].cityName) {
            this.setState({
              initCityName: res.context.systemCityVO[0].cityName
            });
            this.props.form.setFieldsValue({
              cityId: res.context.systemCityVO[0].cityName
            });
          }
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
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
    const { countryArr, cityArr, clinicList, objectFetching, initCityName } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
        <Row>
          <Col span={3}>
            <h3>All Address( {this.state.addressList.length} )</h3>
            <ul>
              {this.state.addressList
                ? this.state.addressList.map((item) => (
                    <li
                      key={item.deliveryAddressId}
                      onClick={() => this.switchAddress(item.deliveryAddressId)}
                      style={{
                        cursor: 'pointer',
                        color: item.deliveryAddressId === this.state.currentId ? '#e2001a' : ''
                      }}
                    >
                      {item.consigneeName}
                    </li>
                  ))
                : null}
            </ul>
          </Col>
          <Col span={20}>
            {this.state.addressList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
            <Card
              title={this.state.title}
              style={{
                display: this.state.addressList.length === 0 ? 'none' : 'block'
              }}
              extra={
                <div
                  style={{
                    display: this.props.customerType === 'Guest' ? 'none' : 'block'
                  }}
                >
                  <Checkbox checked={this.state.isDefault} onChange={() => this.clickDefault()}>
                    Set default delivery address
                  </Checkbox>
                </div>
              }
            >
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col
                    span={12}
                    style={{
                      display: this.props.customerType !== 'Guest' ? 'none' : 'block'
                    }}
                  >
                    <FormItem label="Consumer account">
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
                      display: this.props.customerType !== 'Guest' ? 'none' : 'block'
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
                          {clinicList
                            ? clinicList.map((item) => (
                                <Option value={item.prescriberId.toString()} key={item.prescriberId}>
                                  {item.prescriberId + ',' + item.prescriberName}
                                </Option>
                              ))
                            : null}
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
                          },

                          {
                            max: 50,
                            message: 'Exceed maximum length!'
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
                          {
                            required: true,
                            message: 'Please input Last Name!'
                          },
                          {
                            max: 50,
                            message: 'Exceed maximum length!'
                          }
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
                          },
                          { validator: this.comparePhone }
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
                          {
                            required: true,
                            message: 'Please input Post Code!'
                          },
                          { validator: this.compareZip }
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
                        rules: [{ required: true, message: 'Please input Country!' }]
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
                          {countryArr
                            ? countryArr.map((item) => (
                                <Option value={item.id} key={item.id}>
                                  {item.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="City">
                      {getFieldDecorator('cityId', {
                        rules: [{ required: true, message: 'Please input City!' }],
                        initialValue: initCityName
                      })(
                        <Select
                          showSearch
                          placeholder="Select a Order number"
                          notFoundContent={objectFetching ? <Spin size="small" /> : null}
                          onSearch={_.debounce(this.getCityList, 500)}
                          filterOption={(input, option) => option.props.children && option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'cityId',
                              value
                            });
                          }}
                        >
                          {cityArr
                            ? cityArr.map((item) => (
                                <Option value={item.id} key={item.id}>
                                  {item.cityName}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Address 1">
                      {getFieldDecorator('address1', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Address 1!'
                          },
                          {
                            max: 200,
                            message: 'Exceed maximum length!'
                          }
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
                      {getFieldDecorator('address2', {
                        rules: [
                          {
                            max: 200,
                            message: 'Exceed maximum length!'
                          }
                        ]
                      })(
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
                      {getFieldDecorator('rfc', {
                        rules: [
                          {
                            max: 200,
                            message: 'Exceed maximum length!'
                          }
                        ]
                      })(
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
                          display: this.props.customerType === 'Guest' ? 'none' : null
                        }}
                      >
                        Save
                      </Button>

                      {/* <Button
                        style={{
                          marginRight: '20px',
                          display:
                            this.props.customerType === 'Guest' ? 'none' : null
                        }}
                        onClick={() => this.delAddress()}
                      >
                        Delete
                      </Button> */}

                      <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.delAddress()} okText="Confirm" cancelText="Cancel">
                        <Button
                          style={{
                            marginRight: '20px',
                            display: this.props.customerType === 'Guest' ? 'none' : null
                          }}
                        >
                          <FormattedMessage id="delete" />
                        </Button>
                      </Popconfirm>

                      <Button
                        style={{
                          marginRight: '20px'
                        }}
                      >
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default Form.create()(DeliveryInfomation);
