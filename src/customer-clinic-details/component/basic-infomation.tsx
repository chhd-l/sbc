import React from 'react';
import { Tabs, Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, DatePicker, Empty, Spin } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
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
        clinics.push(array[index].prescriberId.toString());
      }
    }
    return clinics;
  };
  getBasicDetails = () => {
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        let res = data.res;
        if (res.code && res.code !== Const.SUCCESS_CODE) {
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
      .catch((err) => {});
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
          if (res.code === Const.SUCCESS_CODE) {
            message.success('Operate successfully');
          } else {
          }
        })
        .catch((err) => {});
  };

  getClinicList = () => {
    webapi
      .fetchClinicList({
        pageNum: 0,
        pageSize: 1000
      })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            clinicList: res.context.content
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
                    rules: [{ required: true, message: 'Please input First Name!' }]
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
                    rules: [{ required: true, message: 'Please input Last Name!' }]
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
                    initialValue: moment(new Date(this.state.currentBirthDay), 'DD/MM/YYYY')
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
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
                    rules: [{ required: true, message: 'Please input Phone Number!' }]
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
                    rules: [{ required: true, message: 'Please input Post Code!' }]
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
                        <Option title={item.name} value={item.valueEn} key={item.id}>
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
                        <Option title={item.name} value={item.valueEn} key={item.id}>
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
                    rules: [{ required: true, message: 'Please input Address 1!' }]
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
                    <label style={{ minWidth: '200px', marginRight: '10px' }}>Preferred methods of communication:</label>
                  </div>

                  {getFieldDecorator('preferredMethods', {
                    rules: [
                      {
                        required: true,
                        message: 'Please Select Preferred methods of communication!'
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
                    'defaultClinics',
                    {}
                  )(
                    <Select showSearch placeholder="Please select" style={{ width: '100%' }}>
                      {clinicList.map((item) => (
                        <Option value={item.prescriberId.toString()} key={item.prescriberId}>
                          {item.prescriberId + ',' + item.prescriberName}
                        </Option>
                      ))}
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
                          let clinic = {
                            clinicsId: Option[i].props.value,
                            clinicsName: Option[i].props.children
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
                        <Option value={item.prescriberId.toString()} key={item.prescriberId}>
                          {item.prescriberId + ',' + item.prescriberName}
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
