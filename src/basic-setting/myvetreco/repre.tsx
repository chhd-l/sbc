import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import DebounceSelect from '../../myvetreco-logins/create-store/components/debounceSelect';
import { cityList } from '../webapi';
import { FormattedMessage } from 'react-intl';
import FileItem from './fileitem';

const FormItem = Form.Item;
const Option = Select.Option;

class Representative extends React.Component<any, any> {

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
          <Col span={24}>
            <div style={{fontWeight:500}}>Shareholder</div>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Shareholder type" required>
              {getFieldDecorator('typeOfShareholder', {
                initialValue: 1
              })(
              <Select>
                <Option value={0}>Owner</Option>
                <Option value={1}>Controller</Option>
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="First name" required>
              {getFieldDecorator('firstName', {
                rules: [{ required: true, message: 'Please input first name!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Last name" required>
              {getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please input last name!' }],
              })(
                <Input />
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
          <Col span={24}>
            <FormItem label="Job title" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div>Only needed if shareholder type is controller</div>}>
              {getFieldDecorator('jobTitle', {
                rules: [{ required: form.getFieldValue('typeOfShareholder') === 1, message: 'Please input job title' }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Supported document" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div></div>}>
              {getFieldDecorator('doc', {
                rules: [{ required: true, message: 'Please upload supported document!' }]
              })(
                <FileItem />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Representative);

