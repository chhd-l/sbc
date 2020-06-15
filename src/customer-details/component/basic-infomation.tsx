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
  DatePicker,
  Empty,
  Spin
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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
        postCode: '',
        city: '',
        country: '',
        address1: '',
        address2: '',
        preferredMethods: '',
        reference: '',
        selectedClinics: [],
        defaultClinicsString: '',
        defaultClinics: {
          clinicsId: 0,
          clinicsName: ''
        },
        cityObj: {}
      },
      countryArr: [],
      cityArr: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {},
      loading: true
    };
  }
  componentDidMount() {
    this.getDict();
    this.getBasicDetails();
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
          message.error('Unsuccessful');
        } else {
          let res2 = JSON.stringify(data.res);

          let resObj = JSON.parse(res2);
          let clinicsVOS = this.getSelectedClinic(resObj.clinicsVOS);
          let defaultClinicsString = '';
          if (resObj.defaultClinics && resObj.defaultClinics.clinicsId) {
            defaultClinicsString =
              resObj.defaultClinics.clinicsId +
              ',' +
              resObj.defaultClinics.clinicsName;
          }

          let basicForm = {
            firstName: resObj.firstName,
            lastName: resObj.lastName,
            birthDay: resObj.birthDay,
            email: resObj.email,
            contactPhone: resObj.contactPhone,
            postCode: resObj.postCode,
            city: resObj.city,
            country: resObj.country,
            address1: resObj.house,
            address2: resObj.housing,
            preferredMethods: resObj.contactMethod,
            reference: resObj.reference,
            selectedClinics: resObj.clinicsVOS,
            defaultClinicsString: defaultClinicsString,
            defaultClinics: resObj.defaultClinics
          };
          this.setState({
            currentBirthDay: resObj.birthDay,
            basicForm: basicForm,
            currentForm: resObj
          });
          setTimeout(() => {
            this.props.form.setFieldsValue({
              firstName: resObj.firstName,
              lastName: resObj.lastName,
              // birthDay: resObj.birthDay,
              email: resObj.email,
              contactPhone: resObj.contactPhone,
              postCode: resObj.postCode,
              city: resObj.city,
              country: resObj.country,
              address1: resObj.house,
              address2: resObj.housing,
              preferredMethods: resObj.contactMethod,
              reference: resObj.reference,
              selectedClinics: clinicsVOS,
              defaultClinicsString: defaultClinicsString
            });
            this.setState({
              loading: false
            });
          }, 1000);
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error('Unsuccessful');
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

    // (currentForm.firstName = basicForm.firstName),
    //   (currentForm.lastName = basicForm.lastName),
    //   (currentForm.consigneeName =
    //     basicForm.firstName + ' ' + basicForm.lastName),
    //   (currentForm.customerName =
    //     basicForm.firstName + ' ' + basicForm.lastName),

    //   (currentForm.birthDay = basicForm.birthDay),
    //   (currentForm.email = basicForm.email),
    //   (currentForm.contactPhone = basicForm.contactPhone),
    //   (currentForm.postCode = basicForm.postCode),
    //   (currentForm.city = basicForm.city),
    //   (currentForm.country = basicForm.country),
    //   (currentForm.house = basicForm.address1),
    //   (currentForm.housing = basicForm.address2),
    //   (currentForm.contactMethod = basicForm.preferredMethods),
    //   (currentForm.reference = basicForm.reference),
    //   (currentForm.clinicsVOS = basicForm.selectedClinics),
    //   (currentForm.customerId = basicForm.customerId),
    //   (currentForm.defaultClinics = basicForm.defaultClinics)

    let params = {
      birthDay: basicForm.birthDay,
      city: basicForm.city,
      cityId: 0,
      clinicsVOS: basicForm.selectedClinics,
      contactMethod: basicForm.preferredMethods,
      contactPhone: basicForm.contactPhone,
      country: basicForm.country,
      customerDetailId: currentForm.customerDetailId,
      defaultClinics: basicForm.defaultClinics,
      email: basicForm.email,
      firstName: basicForm.firstName,
      house: basicForm.address1,
      housing: basicForm.address2,
      lastName: basicForm.lastName,
      postCode: basicForm.postCode,
      reference: basicForm.reference
    };

    webapi
      .basicDetailsUpdate(params)
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
      <div>
        <Spin spinning={this.state.loading}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="First Name">
                  {getFieldDecorator('firstName', {
                    rules: [
                      { required: true, message: 'Please input First Name!' }
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
                <FormItem label="Birth Date">
                  {getFieldDecorator('birthDay', {
                    rules: [
                      { required: true, message: 'Please input Birth Date!' }
                    ],
                    initialValue: moment(
                      new Date(this.state.currentBirthDay),
                      'YYYY-MM-DD'
                    )
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
                <FormItem label="Phone Number">
                  {getFieldDecorator('contactPhone', {
                    rules: [
                      { required: true, message: 'Please input Phone Number!' }
                    ]
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
                  {getFieldDecorator('country', {
                    rules: [
                      { required: true, message: 'Please input Country!' }
                    ]
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
                      {countryArr
                        ? countryArr.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
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
                      {cityArr
                        ? cityArr.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              {item.name}
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
                      { required: true, message: 'Please input Address 1!' }
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
                  {getFieldDecorator(
                    'address2',
                    {}
                  )(
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
                      <Radio value="phone">Phone</Radio>
                      <Radio value="email">Email</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Reference">
                  {getFieldDecorator(
                    'reference',
                    {}
                  )(
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
                    'defaultClinicsString',
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
                      {this.state.basicForm.selectedClinics
                        ? this.state.basicForm.selectedClinics.map((item) => (
                            <Option
                              value={item.clinicsId.toString()}
                              key={item.clinicsId}
                            >
                              {item.clinicsId + ',' + item.clinicsName}
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
                    rules: [
                      { required: true, message: 'Please Select Prescriber!' }
                    ]
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
                            <Option
                              value={item.clinicsId.toString()}
                              key={item.clinicsId}
                            >
                              {item.clinicsId + ',' + item.clinicsName}
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
