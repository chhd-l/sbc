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
    this.state = {
      clinicForm: {
        clinicName: '',
        clinicPhone: '',
        clinicCity: '',
        clinicZip: '',
        longitude: '',
        latitude: '',
        clinicAddress: ''
      }
    };
  }
  onFormChange = ({ field, value }) => {
    let data = this.state.clinicForm;
    data[field] = value;
    this.setState({
      clinicForm: data
    });
  };
  onCreate = () => {
    console.log(this.state.clinicForm);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...layout} style={{ width: '600px' }}>
        <FormItem label="Clinic Name">
          {getFieldDecorator('clinicName', {
            rules: [{ required: true, message: 'Please input clinic name!' }]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'clinicName',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Clinic Phone Number">
          {getFieldDecorator('clinicPhoneNumber', {
            rules: [
              { required: true, message: 'Please input clinic phone number!' }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'clinicPhone',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Clinic City">
          <Select
            onChange={(value) => {
              value = value === '' ? null : value;
              this.onFormChange({
                field: 'clinicCity',
                value
              });
            }}
          >
            <Option value="0">Mexico City</Option>
            <Option value="1">Monterrey</Option>
          </Select>
        </FormItem>
        <FormItem label="Clinic Zip">
          {getFieldDecorator('clinicZip', {
            rules: [{ required: true, message: 'Please input clinic zip!' }]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'clinicZip',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Longitude">
          {getFieldDecorator('longitude', {
            rules: [{ required: true, message: 'Please input Longitude!' }]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'longitude',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Latitude">
          {getFieldDecorator('latitude', {
            rules: [{ required: true, message: 'Please input Latitude!' }]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'latitude',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Clinic Address">
          <Input.TextArea
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onFormChange({
                field: 'clinicAddress',
                value
              });
            }}
          />
        </FormItem>
        <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              this.onCreate();
            }}
          >
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
