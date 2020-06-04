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
  Empty
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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
        selectedClinics: []
      },
      countryArr: [],
      cityArr: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {}
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
        clinics.push(array[index].clinicsId);
      }
    }
    return clinics;
  };
  getBasicDetails = () => {
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        let res = data.res;
        debugger;
        if (res.code && res.code !== 'K-000000') {
          message.error(res.message || 'Get data failed');
        } else {
          let res2 = JSON.stringify(data.res);

          let resObj = JSON.parse(res2);
          let clinicsVOS = this.getSelectedClinic(resObj.clinicsVOS);
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
            selectedClinics: clinicsVOS
          });
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
            selectedClinics: resObj.clinicsVOS
          };
          this.setState({
            currentBirthDay: resObj.birthDay,
            basicForm: basicForm,
            currentForm: resObj
          });
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  };
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
        this.saveBasicInfomation();
      }
    });
  };

  saveBasicInfomation = () => {
    const { basicForm, currentForm } = this.state;

    (currentForm.firstName = basicForm.firstName),
      (currentForm.lastName = basicForm.lastName),
      (currentForm.birthDay = basicForm.birthDay),
      (currentForm.email = basicForm.email),
      (currentForm.contactPhone = basicForm.contactPhone),
      (currentForm.postCode = basicForm.postCode),
      (currentForm.city = basicForm.city),
      (currentForm.country = basicForm.country),
      (currentForm.house = basicForm.address1),
      (currentForm.housing = basicForm.address2),
      (currentForm.contactMethod = basicForm.preferredMethods),
      (currentForm.reference = basicForm.reference),
      (currentForm.clinicsVOS = basicForm.selectedClinics),
      (currentForm.customerId = basicForm.customerId),
      webapi
        .basicDetailsUpdate(currentForm)
        .then((data) => {
          const res = data.res;
          if (res.code === 'K-000000') {
            message.success(res.message || 'Update data success');
          } else {
            message.error(res.message || 'Update data failed');
          }
        })
        .catch((err) => {
          message.error('Update data failed');
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

  render() {
    const { countryArr, cityArr, clinicList } = this.state;
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
                {getFieldDecorator('birthDay', {
                  rules: [
                    { required: true, message: 'Please input Birth Date!' }
                  ],
                  initialValue: moment(this.state.currentBirthDay, 'YYYY-MM-DD')
                })(
                  <DatePicker
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
                    <Radio value="phone">Phone</Radio>
                    <Radio value="email">Email</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Reference" hasFeedback validateStatus="success">
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
              <FormItem label="Selected clinics">
                {getFieldDecorator('selectedClinics', {
                  rules: [{ required: true, message: 'Please Select clinics!' }]
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
                    {clinicList.map((item) => (
                      <Option value={item.clinicsId} key={item.clinicsId}>
                        {item.clinicsName}
                      </Option>
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
                  <Link to="/customer-list">Cancle</Link>
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
