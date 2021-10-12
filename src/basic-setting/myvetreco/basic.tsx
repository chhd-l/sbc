import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import DebounceSelect from '../../myvetreco-logins/create-store/components/debounceSelect';
import { cityList } from '../webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class BasicInformation extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      defaultOptions: []
    }
  }

  fetchUserList = async (cityName) => {
    return cityList({cityName,storeId:123457915}).then(({res})=>{
      return res.context.systemCityVO
    })
  }

  onChangePhoneNumber = (e) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          contactPhone: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  render() {
    const { form: { getFieldDecorator }, form } = this.props;
    const { defaultOptions } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Type of business" required>
              {getFieldDecorator('typeOfBusiness', {
                initialValue: 1
              })(
              <Select disabled>
                <Option value={1}>Business</Option>
                <Option value={0}>Individual</Option>
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Legal company name" required>
              {getFieldDecorator('legalCompanyName', {
                rules: [{ required: true, message: 'Please input Legal company name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Chamber of Commerce number" required>
              {getFieldDecorator('commerceNumber', {
                rules:[{ required: true, message: 'Please input Chamber of Commerce number!' }],
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Store name" required>
              {getFieldDecorator('storeName', {
                rules: [{ required: true, message: 'Please input Store name!' }],
                onChange: (e) => {
                  let value = e.target.value.replace(/[^\w]/ig,'').substring(0,50).toLowerCase();
                  form.setFieldsValue({domainName:'https://'+value+'.myvetreco.co'});
                }
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Store domain" required>
              {getFieldDecorator('domainName', {
                initialValue: ''
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Store address 1" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div>including street name and number</div>}>
              {getFieldDecorator('addressDetail', {
                rules: [{ required: true, message: 'Please input address' }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Postcode" required>
              {getFieldDecorator('postcode', {
                rules: [{ required: true, pattern: /^[0-9]{4}\s[A-Za-z]{2}$/, message: 'Enter a valid postcode, example: 1234 AB' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="City">
              {getFieldDecorator('cityId', {
                initialValue: {key:'',label:''}
              })(
                <DebounceSelect
                  placeholder="Select city"
                  fetchOptions={this.fetchUserList}
                  defaultOptions={defaultOptions}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Email">
              {getFieldDecorator('contactEmail', {
                rules:[
                  { required: true, message: 'Please input your Email!' },
                  { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Phone number">
              {getFieldDecorator('contactPhone', {
                rules:[
                  { required: true, pattern: /^\+31[0-9]{9}$/, message: 'Please input the right format: +31xxxxxxxxx' }
                ],
                onChange: this.onChangePhoneNumber
              })(
                <Input maxLength={12} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(BasicInformation);
