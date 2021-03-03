import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, DatePicker, Empty, Spin, Checkbox, AutoComplete } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, Headline, history } from 'qmkit';
import _ from 'lodash';
import { getCountryList, getCityList } from './webapi';

const { TextArea } = Input;

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BasicEdit extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customer: {},
      countryList: [],
      cityList: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {},
      loading: false,
      objectFetching: false,
      initCityName: '',
      initPreferChannel: []
    };
  }
  componentDidMount() {
    this.getBasicDetails();
    this.getDict();
    this.getClinicList();
  }

  getDict = async () => {
    const countryList = await getCountryList();
    const cityList = await getCityList();
    this.setState({
      countryList: countryList,
      cityList: cityList
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
  getBasicDetails = () => {
    this.setState({ loading: true });
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            customer: {
              ...res.context,
              customerAccount: this.props.customerAccount
            }
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
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
    const { customer } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        //this.saveBasicInfomation();
        this.setState({ loading: true });
        const params = {
          ...fieldsValue,
          customerDetailId: customer.customerDetailId,
          communicationEmail: fieldsValue['preferredMethods'].indexOf('communicationEmail') > -1 ? 1 : 0,
          communicationPhone: fieldsValue['preferredMethods'].indexOf('communicationPhone') > -1 ? 1 : 0
        };
        webapi
          .basicDetailsUpdate(params)
          .then((data) => {
            const res = data.res;
            if (res.code === Const.SUCCESS_CODE) {
              message.success('Operate successfully');
              history.go(-1);
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  saveBasicInfomation = () => {
    const { basicForm, currentForm } = this.state;
    let params = {
      birthDay: basicForm.birthDay ? basicForm.birthDay : this.state.currentBirthDay,
      cityId: basicForm.cityId ? basicForm.cityId : currentForm.cityId,
      clinicsVOS: basicForm.selectedClinics,
      // contactMethod: basicForm.preferredMethods,
      contactPhone: basicForm.contactPhone,
      countryId: basicForm.countryId ? basicForm.countryId : currentForm.countryId,
      customerDetailId: currentForm.customerDetailId,
      defaultClinics: basicForm.defaultClinics,
      email: basicForm.email,
      firstName: basicForm.firstName,
      address1: basicForm.address1,
      address2: basicForm.address2,
      lastName: basicForm.lastName,
      postalCode: basicForm.postalCode,
      reference: basicForm.reference,
      communicationPhone: JSON.stringify(basicForm.preferredMethods).indexOf('Phone') > -1 ? 1 : 0,
      communicationEmail: JSON.stringify(basicForm.preferredMethods).indexOf('Email') > -1 ? 1 : 0
    };

    webapi.basicDetailsUpdate(params).then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('Operate successfully');
      }
    });
  };

  getClinicList = () => {
    webapi
      .fetchClinicList({
        enabled: true,
        storeId: 123456858
      })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            clinicList: res.context
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s\(\)]{6,20}$/;
    if (!reg.test(form.getFieldValue('contactPhone'))) {
      callback('Please enter the correct phone');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('postalCode'))) {
      callback('Please enter the correct Post Code');
    } else {
      callback();
    }
  };

  compareEmail = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
    if (!reg.test(form.getFieldValue('email'))) {
      callback('Please enter the correct email');
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
    webapi.queryCityListByName(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          cityArr: res.context.systemCityVO,
          objectFetching: false
        });
      }
    });
  };
  getCityNameById = (id) => {
    let params = {
      id: [id]
    };
    webapi.queryCityById(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        if (res.context && res.context.systemCityVO && res.context.systemCityVO[0] && res.context.systemCityVO[0].cityName) {
          this.setState({
            initCityName: res.context.systemCityVO[0].cityName
          });
        }
      }
    });
  };

  render() {
    const { customer, countryList, cityList, clinicList, objectFetching, initCityName, initPreferChannel } = this.state;
    const options = [
      {
        label: 'Phone',
        value: 'communicationPhone'
      },
      {
        label: 'Email',
        value: 'communicationEmail'
      }
    ];
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
      <div>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container">
            <Headline title="Edit basic information" />
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem label="Pet owner account">
                    {getFieldDecorator('customerAccount', {
                      initialValue: customer.customerAccount
                    })(<Input disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Registration date">
                    {getFieldDecorator('createTime', {
                      initialValue: moment(customer.createTime)
                    })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem label="First name">
                    {getFieldDecorator('firstName', {
                      initialValue: customer.firstName,
                      rules: [
                        { required: true, message: 'Please input First Name!' },
                        {
                          max: 50,
                          message: 'Exceed maximum length!'
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Last name">
                    {getFieldDecorator('lastName', {
                      initialValue: customer.lastName,
                      rules: [
                        { required: true, message: 'Please input Last Name!' },
                        {
                          max: 50,
                          message: 'Exceed maximum length!'
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Birth Date">
                    {getFieldDecorator('birthDay', {
                      rules: [{ required: true, message: 'Please input Birth Date!' }],
                      initialValue: customer.birthDay ? moment(customer.birthDay) : null
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) => {
                          return current && current > moment().endOf('day');
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Email">
                    {getFieldDecorator('email', {
                      initialValue: customer.email,
                      rules: [{ required: true, message: 'Please input Email!' }, { validator: this.compareEmail }, { max: 50, message: 'Exceed maximum length!' }]
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Phone number">
                    {getFieldDecorator('contactPhone', {
                      initialValue: customer.contactPhone,
                      rules: [{ required: true, message: 'Please input Phone Number!' }, { validator: this.comparePhone }]
                    })(<Input />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="Postal code">
                    {getFieldDecorator('postalCode', {
                      initialValue: customer.postalCode,
                      rules: [{ required: true, message: 'Please input Post Code!' }, { validator: this.compareZip }]
                    })(<Input />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="Country">
                    {getFieldDecorator('countryId', {
                      initialValue: customer.country,
                      rules: [{ required: true, message: 'Please input Country!' }]
                    })(
                      <Select optionFilterProp="children">
                        {countryList.map((item) => (
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
                    {getFieldDecorator('city', {
                      rules: [{ required: true, message: 'Please select City!' }],
                      initialValue: customer.city
                    })(<AutoComplete dataSource={cityList.map((city) => city.name)} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Address reference">
                    {getFieldDecorator('address1', {
                      initialValue: customer.address1,
                      rules: [
                        { required: true, message: 'Please input Address 1!' },
                        {
                          max: 200,
                          message: 'Exceed maximum length!'
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Consent">
                    {getFieldDecorator('consent', {
                      valuePropName: 'checked',
                      initialValue: true
                    })(<Radio>Email communication</Radio>)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="Prefer channel">
                    {getFieldDecorator('preferredMethods', {
                      rules: [
                        {
                          required: true,
                          message: 'Please Select Preferred methods of communication!'
                        }
                      ],
                      initialValue: ['communicationPhone', 'communicationEmail'].reduce((prev, curr) => {
                        if (+customer[curr]) {
                          prev.push(curr);
                        }
                        return prev;
                      }, [])
                    })(<Checkbox.Group options={options} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="bar-button">
            <Button type="primary" onClick={this.handleSubmit}>
              Save
            </Button>

            <Button
              style={{ marginLeft: '20px' }}
              onClick={() => {
                history.go(-1);
              }}
            >
              Cancel
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}
export default Form.create<any>()(BasicEdit);
