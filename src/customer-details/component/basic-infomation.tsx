import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, DatePicker, Empty, Spin, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const } from 'qmkit';

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
        if (res.code === 'K-000000') {
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
  getBasicDetails = () => {
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        let res = data.res;
        if (res.code && res.code !== 'K-000000') {
          message.error(res.message || 'Unsuccessful');
        } else {
          let res2 = JSON.stringify(data.res);

          let resObj = JSON.parse(res2);
          let clinicsVOS = this.getSelectedClinic(resObj.clinicsVOS);
          let defaultClinicsId = '';
          if (resObj.defaultClinics && resObj.defaultClinics.clinicsId) {
            defaultClinicsId = resObj.defaultClinics.clinicsId;
          }

          let basicForm = {
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
        message.error(err.message || 'Unsuccessful');
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
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
        if (res.code === 'K-000000') {
          this.setState({
            loading: false,
            clinicList: res.context
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
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s]{6,20}$/;
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
          if (res.context && res.context.systemCityVO && res.context.systemCityVO[0].cityName) {
            this.setState({
              initCityName: res.context.systemCityVO[0].cityName
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
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" />}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="First Name">
                  {getFieldDecorator('firstName', {
                    rules: [
                      { required: true, message: 'Please input First Name!' },
                      {
                        max: 50,
                        message: 'Exceed maximum length!'
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
                <FormItem label="Last Name">
                  {getFieldDecorator('lastName', {
                    rules: [
                      { required: true, message: 'Please input Last Name!' },
                      {
                        max: 50,
                        message: 'Exceed maximum length!'
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
                <FormItem label="Birth Date">
                  {getFieldDecorator('birthDay', {
                    rules: [{ required: true, message: 'Please input Birth Date!' }],
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
                <FormItem label="Email">
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input Email!' }, { validator: this.compareEmail }, { max: 50, message: 'Exceed maximum length!' }]
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
                <FormItem label="Phone Number">
                  {getFieldDecorator('contactPhone', {
                    rules: [{ required: true, message: 'Please input Phone Number!' }, { validator: this.comparePhone }]
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
                <FormItem label="Postal Code">
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: true, message: 'Please input Post Code!' }, { validator: this.compareZip }]
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
                <FormItem label="Country">
                  {getFieldDecorator('country', {
                    rules: [{ required: true, message: 'Please input Country!' }]
                  })(
                    <Select
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'countryID',
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
                <FormItem label="City">
                  {getFieldDecorator('city', {
                    rules: [{ required: true, message: 'Please select City!' }],
                    initialValue: initCityName
                  })(
                    <Select
                      showSearch
                      placeholder="Select a Order number"
                      notFoundContent={objectFetching ? <Spin size="small" /> : null}
                      onSearch={this.getCityList}
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
                <FormItem label="Address 1">
                  {getFieldDecorator('address1', {
                    rules: [
                      { required: true, message: 'Please input Address 1!' },
                      {
                        max: 200,
                        message: 'Exceed maximum length!'
                      }
                    ]
                  })(
                    <TextArea
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
                <FormItem label="Prefer channel">
                  {getFieldDecorator('preferredMethods', {
                    rules: [
                      {
                        required: true,
                        message: 'Please Select Preferred methods of communication!'
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
                <FormItem label="Reference">
                  {getFieldDecorator('reference', {
                    rules: [
                      {
                        max: 200,
                        message: 'Exceed maximum length!'
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'reference',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Default Prescriber">
                  {getFieldDecorator(
                    'defaultClinicsId',
                    {}
                  )(
                    <Select
                      showSearch
                      placeholder="Please select"
                      style={{ width: '100%' }}
                      onChange={(value, Option) => {
                        let tempArr = Option.props.children.split(',');
                        let clinic = {
                          clinicsId: tempArr[0],
                          clinicsName: tempArr[1]
                        };

                        this.onFormChange({
                          field: 'defaultClinics',
                          value: clinic
                        });
                      }}
                    >
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
                <FormItem label="Selected Prescriber">
                  {getFieldDecorator('selectedClinics', {
                    rules: [{ required: true, message: 'Please Select Prescriber!' }]
                  })(
                    <Select
                      mode="tags"
                      placeholder="Please select"
                      style={{ width: '100%' }}
                      onChange={(value, Option) => {
                        let clinics = [];
                        for (let i = 0; i < Option.length; i++) {
                          let tempArr = Option[i].props.children.split(',');
                          let clinic = {
                            clinicsId: tempArr[0],
                            clinicsName: tempArr[1]
                          };
                          clinics.push(clinic);
                        }

                        this.onFormChange({
                          field: 'selectedClinics',
                          value: clinics
                        });
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
              <Col span={24}>
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>

                  <Button style={{ marginLeft: '20px' }}>
                    <Link to="/customer-list">Cancel</Link>
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
export default Form.create()(BasicInfomation);
