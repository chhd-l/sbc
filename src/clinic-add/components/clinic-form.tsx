import React from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class ClinicForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...layout} style={{ width: '600px' }}>
        <FormItem label="Clinic Name">
          {getFieldDecorator('clinicName', {
            rules: [{ required: true, message: 'Please input clinic name!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Clinic Phone Number">
          {getFieldDecorator('clinicPhoneNumber', {
            rules: [
              { required: true, message: 'Please input clinic phone number!' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="Clinic City">
          <Select>
            <Option value="0">Mexico City</Option>
            <Option value="1">Monterrey</Option>
          </Select>
        </FormItem>
        <FormItem label="Clinic Zip">
          {getFieldDecorator('clinicZip', {
            rules: [{ required: true, message: 'Please input clinic zip!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Longitude">
          {getFieldDecorator('longitude', {
            rules: [{ required: true, message: 'Please input Longitude!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Latitude">
          {getFieldDecorator('latitude', {
            rules: [{ required: true, message: 'Please input Latitude!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Clinic Address">
          <Input.TextArea />
        </FormItem>
        <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
          <Button style={{ marginLeft: '20px' }}>
            <Link to="clinic">Back List</Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(ClinicForm);
