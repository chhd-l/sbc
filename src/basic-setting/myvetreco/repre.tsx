import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import DebounceSelect from '../../myvetreco-logins/create-store/components/debounceSelect';
import { cityList } from '../webapi';
import { FormattedMessage } from 'react-intl';
import FileItem from './fileitem';
import moment from 'moment';
import { SupportedDocumentUtil } from './main';

const FormItem = Form.Item;
const Option = Select.Option;

const fetchUserList = async (cityName) => {
  return cityList({cityName,storeId:123457915}).then(({res})=>{
    return res.context.systemCityVO
  })
}

class ShareHolder extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  validateJobTitle = () => {
    const { form } = this.props;
    setTimeout(() => {
      form.validateFields(['jobTitle'], { force: true });
    });
  };

  onChangePhoneNumber = (e) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          phoneNumber: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  validateForm = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          resolve({
            ...values,
            supportedDocument: SupportedDocumentUtil.mapFormDataToProps(values.supportedDocument)
          });
        } else {
          reject('2');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, form } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={24}>
            <div style={{fontWeight:500}}>Shareholder</div>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Shareholder type" required>
              {getFieldDecorator('shareholderType', {
                initialValue: "1"
              })(
              <Select onChange={this.validateJobTitle}>
                <Option value="0">Owner</Option>
                <Option value="1">Controller</Option>
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="First name">
              {getFieldDecorator('firstName', {
                rules: [{ required: true, message: 'Please input first name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Last name">
              {getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please input last name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Email">
              {getFieldDecorator('email', {
                rules:[
                  { required: true, message: 'Please input your Email!' },
                  { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Phone number">
              {getFieldDecorator('phoneNumber', {
                rules:[
                  { required: true, pattern: /^\+31[0-9]{9}$/, message: 'Please input the right format: +31xxxxxxxxx' }
                ],
                onChange: this.onChangePhoneNumber
              })(
                <Input maxLength={12} />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Job title" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'red'}}>Only needed if shareholder type is controller</div>}>
              {getFieldDecorator('jobTitle', {
                rules: [{ required: form.getFieldValue('shareholderType') === "1", message: 'Please input job title' }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Supported document" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'red'}}>
              <div>You can upload Passport, Visa or Driving License</div>
              <div>Allowed formats: JPEG, JPG, PNG, or PDF (max. 2 pages)</div>
              <div>Minimum allowed size: 1 KB for PDF, 100 KB for other formats</div>
              <div>Maximum allowed size: 4 MB</div>
            </div>}>
              {getFieldDecorator('supportedDocument', {
                rules: [{ required: true, type: 'array', message: 'Please upload supported document!' }],
                initialValue: []
              })(
                <FileItem />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

class Signatories extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      defaultOptions: []
    }
  }

  onChangePhoneNumber = (e) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          phoneNumber: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  setDefaultOptions = () => {
    const cityObj = this.props.form.getFieldValue('cityId');
    const defaultOptions = {
      id: cityObj.key,
      cityName: cityObj.label
    };
    this.setState({ defaultOptions });
  };

  validateForm = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          resolve({
            ...values,
            cityId: values.cityId.key,
            city: values.cityId.label,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
            supportedDocument: SupportedDocumentUtil.mapFormDataToProps(values.supportedDocument)
          });
        } else {
          reject('2');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, form } = this.props;
    const { defaultOptions } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={24}>
            <div style={{fontWeight:500}}>Signatories</div>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="First name">
              {getFieldDecorator('firstName', {
                rules: [{ required: true, message: 'Please input first name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Last name">
              {getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please input last name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Email">
              {getFieldDecorator('email', {
                rules:[
                  { required: true, message: 'Please input your Email!' },
                  { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Phone number">
              {getFieldDecorator('phoneNumber', {
                rules:[
                  { required: true, pattern: /^\+31[0-9]{9}$/, message: 'Please input the right format: +31xxxxxxxxx' }
                ],
                onChange: this.onChangePhoneNumber
              })(
                <Input maxLength={12} />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Job title" labelCol={{span: 4}} wrapperCol={{span: 12}}>
              {getFieldDecorator('jobTitle', {
                rules: [{ required: true, message: 'Please input job title' }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Address 1" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'red'}}>including street name and number</div>}>
              {getFieldDecorator('address1', {
                rules: [{ required: true, message: 'Please input address' }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Postcode">
              {getFieldDecorator('postCode', {
                rules: [{ required: true, pattern: /^[0-9]{4}\s[A-Za-z]{2}$/, message: 'Enter a valid postcode, example: 1234 AB' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="City" required>
              {getFieldDecorator('cityId', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value || !value.key) {
                        callback('Please select city');
                      }
                      callback();
                    }
                  }
                ],
                initialValue: {key:'',value:'',label:''}
              })(
                <DebounceSelect
                  size="default"
                  placeholder="Select city"
                  fetchOptions={fetchUserList}
                  defaultOptions={defaultOptions}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Province">
              {getFieldDecorator('province', {
                rules: [{ required: true, message: 'Please input province' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Date of birth">
              {getFieldDecorator('dateOfBirth', {
                rules: [{ required: true, message: 'Please select birthday' }],
              })(
                <DatePicker format="YYYY-MM-DD" disabledDate={current => current > moment().startOf('day')} />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Supported document" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'red'}}>
              <div>You can upload Passport, Visa or Driving License</div>
              <div>Allowed formats: JPEG, JPG, PNG, or PDF (max. 2 pages)</div>
              <div>Minimum allowed size: 1 KB for PDF, 100 KB for other formats</div>
              <div>Maximum allowed size: 4 MB</div>
            </div>}>
              {getFieldDecorator('supportedDocument', {
                rules: [{ required: true, type: 'array', message: 'Please upload supported document!' }]
              })(
                <FileItem />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export const ShareHolderForm = Form.create()(ShareHolder);
export const SignatoriesForm = Form.create()(Signatories);

