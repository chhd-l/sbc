import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, DatePicker, Empty, Spin, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, Headline } from 'qmkit';
import _ from 'lodash';

const { TextArea } = Input;

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
        customerAccount: '',
        createTime: '',
        firstName: '',
        lastName: '',
        birthDay: '',
        email: '',
        contactPhone: '',
        postalCode: '',
        cityId: '',
        countryId: '',
        address1: '',
        address2: '',
        preferredMethods: '',
        reference: '',
        selectedClinics: [],
        defaultClinicsId: '',
        defaultClinics: {
          clinicsId: 0,
          clinicsName: ''
        }
      },
      countryArr: [],
      cityArr: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {},
      loading: true,
      objectFetching: false,
      initCityName: '',
      initPreferChannel: []
    };
  }
  componentDidMount() {
    this.getDict();
    this.getBasicDetails();
    this.getClinicList();
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
        if (res.code === Const.SUCCESS_CODE) {
          // if (type === 'city') {
          //   this.setState({
          //     cityArr: res.context.sysDictionaryVOS
          //   });
          //   sessionStorage.setItem(
          //     'dict-city',
          //     JSON.stringify(res.context.sysDictionaryVOS)
          //   );
          // }
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          }
        }
      })
      .catch((err) => {});
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
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        let res = data.res;
        if (res.code && res.code === Const.SUCCESS_CODE) {
          let res2 = JSON.stringify(data.res);

          let resObj = JSON.parse(res2);
          let clinicsVOS = this.getSelectedClinic(resObj.clinicsVOS);
          let defaultClinicsId = '';
          if (resObj.defaultClinics && resObj.defaultClinics.clinicsId) {
            defaultClinicsId = resObj.defaultClinics.clinicsId;
          }

          let basicForm = {
            customerAccount: resObj.customerVO.customerAccount,
            createTime: resObj.createTime,
            firstName: resObj.firstName,
            lastName: resObj.lastName,
            birthDay: resObj.birthDay ? resObj.birthDay : this.state.currentBirthDay,
            email: resObj.email,
            contactPhone: resObj.contactPhone,
            postalCode: resObj.postalCode,
            cityId: resObj.cityId,
            countryId: resObj.countryId,
            address1: resObj.address1,
            address2: resObj.address2,
            communicationPhone: resObj.communicationPhone,
            communicationEmail: resObj.communicationEmail,
            reference: resObj.reference,
            selectedClinics: resObj.clinicsVOS,
            defaultClinicsId: defaultClinicsId,
            defaultClinics: resObj.defaultClinics,
            preferredMethods: []
          };
          if (basicForm.cityId) {
            this.getCityNameById(basicForm.cityId);
          }
          let initPreferChannel = [];
          if (+basicForm.communicationPhone) {
            initPreferChannel.push('Phone');
          }
          if (+basicForm.communicationEmail) {
            initPreferChannel.push('Email');
          }
          basicForm.preferredMethods = initPreferChannel;

          this.setState(
            {
              currentBirthDay: resObj.birthDay ? resObj.birthDay : this.state.currentBirthDay,
              basicForm: basicForm,
              currentForm: resObj,
              initPreferChannel: initPreferChannel
            },
            () => {
              this.props.form.setFieldsValue({
                firstName: resObj.firstName,
                lastName: resObj.lastName,
                email: resObj.email,
                contactPhone: resObj.contactPhone,
                postalCode: resObj.postalCode,
                // city: resObj.cityId,
                country: resObj.countryId,
                address1: resObj.address1,
                address2: resObj.address2,
                // preferredMethods: resObj.contactMethod,
                reference: resObj.reference,
                selectedClinics: clinicsVOS,
                defaultClinicsId: defaultClinicsId
              });
              this.setState({
                loading: false
              });
            }
          );
        }
      })
      .catch((err) => {
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
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveBasicInfomation();
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

    webapi
      .basicDetailsUpdate(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="PetOwner.OperateSuccessfully" />);
        }
      })
      .catch((err) => {});
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
      callback(<FormattedMessage id="PetOwner.theCorrectPhone" />);
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('postalCode'))) {
      callback(<FormattedMessage id="PetOwner.theCorrectPostCode" />);
    } else {
      callback();
    }
  };

  compareEmail = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
    if (!reg.test(form.getFieldValue('email'))) {
      callback(<FormattedMessage id="PetOwner.theCorrectEmail" />);
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
        }
      })
      .catch((err) => {});
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
          }
        }
      })
      .catch((err) => {});
  };

  render() {
    const { countryArr, cityArr, clinicList, objectFetching, initCityName, initPreferChannel } = this.state;
    const options = [
      {
        label: 'Phone',
        value: 'Phone'
      },
      {
        label: 'Email',
        value: 'Email'
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
          <Headline title={<FormattedMessage id="PetOwner.EditBasicInformation" />} />
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.ConsumerAccount" />}>
                  {getFieldDecorator('customerAccount', {
                    initialValue: this.state.basicForm.customerAccount
                  })(<Input disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.RegistrationDate" />}>
                  {getFieldDecorator('createTime', {
                    initialValue: moment(this.state.basicForm.createTime)
                  })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled={true} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.FirstName" />}>
                  {getFieldDecorator('firstName', {
                    rules: [
                      { required: true, message: <FormattedMessage id="PetOwner.PleaseInputFirstName" /> },
                      {
                        max: 50,
                        message: <FormattedMessage id="PetOwner.ExceedMaximumLength" />
                      }
                    ]
                  })(
                    <Input
                      style={{ width: '100%' }}
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
                <FormItem label={<FormattedMessage id="PetOwner.LastName" />}>
                  {getFieldDecorator('lastName', {
                    rules: [
                      { required: true, message: <FormattedMessage id="PetOwner.PleaseInputLastName" /> },
                      {
                        max: 50,
                        message: <FormattedMessage id="PetOwner.ExceedMaximumLength" />
                      }
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
                <FormItem label={<FormattedMessage id="PetOwner.BirthDate" />}>
                  {getFieldDecorator('birthDay', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseInputBirthDate" /> }],
                    initialValue: moment(new Date(this.state.currentBirthDay), 'YYYY-MM-DD')
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      disabledDate={(current) => {
                        return current && current > moment().endOf('day');
                      }}
                      onChange={(date, dateString) => {
                        const value = dateString;
                        this.onFormChange({
                          field: 'birthDay',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.Email" />}>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseInputEmail" /> }, { validator: this.compareEmail }, { max: 50, message: <FormattedMessage id="PetOwner.ExceedMaximumLength" /> }]
                  })(
                    <Input
                      disabled
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
                <FormItem label={<FormattedMessage id="PetOwner.PhoneNumber" />}>
                  {getFieldDecorator('contactPhone', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseInputPhoneNumber" /> }, { validator: this.comparePhone }]
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'contactPhone',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.PostalCode" />}>
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseInputPostCode" /> }, { validator: this.compareZip }]
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'postalCode',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.Country" />}>
                  {getFieldDecorator('country', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseInputCountry" /> }]
                  })(
                    <Select
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'countryId',
                          value: value ? value : ''
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
                <FormItem label={<FormattedMessage id="PetOwner.City" />}>
                  {getFieldDecorator('city', {
                    rules: [{ required: true, message: <FormattedMessage id="PetOwner.PleaseSelectCity" /> }],
                    initialValue: initCityName
                  })(
                    <Select
                      showSearch
                      placeholder="Select a Order number"
                      notFoundContent={objectFetching ? <Spin size="small" /> : null}
                      onSearch={_.debounce(this.getCityList, 500)}
                      filterOption={(input, option) => option.props.children && option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'cityId',
                          value: value ? value : ''
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
                <FormItem label={<FormattedMessage id="PetOwner.AddressReference" />}>
                  {getFieldDecorator('address1', {
                    rules: [
                      { required: true, message: <FormattedMessage id="PetOwner.PleaseInputAddress1" /> },
                      {
                        max: 200,
                        message: <FormattedMessage id="PetOwner.ExceedMaximumLength" />
                      }
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
                <FormItem label={<FormattedMessage id="PetOwner.Consent" />}>
                  {getFieldDecorator('consent', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(
                    <Radio>
                      <FormattedMessage id="PetOwner.EmailCommunication" />
                    </Radio>
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.PreferChannel" />}>
                  {getFieldDecorator('preferredMethods', {
                    rules: [
                      {
                        required: true,
                        message: <FormattedMessage id="PetOwner.SelectPreferredMethods" />
                      }
                    ],
                    initialValue: initPreferChannel
                  })(
                    <Checkbox.Group
                      options={options}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'preferredMethods',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={<FormattedMessage id="PetOwner.TagName" />}>
                  {getFieldDecorator('reference', {
                    rules: [
                      {
                        required: true,
                        message: <FormattedMessage id="PetOwner.TagNameIsRequired" />
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'reference',
                          value
                        });
                      }}
                    >
                      <Option value="1">
                        <FormattedMessage id="PetOwner.ActiveUser" />
                      </Option>
                      <Option value="2">
                        <FormattedMessage id="PetOwner.Student" />
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    <FormattedMessage id="PetOwner.Save" />
                  </Button>

                  <Button style={{ marginLeft: '20px' }}>
                    <Link to="/customer-list">
                      <FormattedMessage id="PetOwner.Cancel" />
                    </Link>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default Form.create<any>()(BasicInfomation);
