import React from 'react';
import { Row, Col, Form, Input, Select } from 'antd';

const { Option } = Select;
import { getCustomerDetails } from '../webapi';
class ConsumerInformation extends React.Component<any, any> {
  state = {
    customerList: []
  };

  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  _searchPetsName = (e) => {
    console.log(e.target.value);
  };
  onChange = (value) => {
    console.log(`selected ${value}`);
  };
  onSearch = async (value) => {
    console.log(`onSearch ${value}`);
    const { res } = await getCustomerDetails();
    console.log(res);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      }
    };
    return (
      <div>
        <h3>Step1</h3>
        <h4>
          {this.props.stepName} <span className="ant-form-item-required"></span>
        </h4>
        <div className="selectLanguage">
          <Form {...formItemLayout}>
            <Form.Item label="Pet owner account">
              {getFieldDecorator('ownerAccount', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your Pet owner account!'
                  }
                ]
              })(
                <Select showSearch placeholder="Select a person" optionFilterProp="children" onChange={this.onChange} onSearch={this.onSearch} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Pet owner name">
              {getFieldDecorator('ownerName', {
                initialValue: ''
              })(<Input disabled />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedConsumerInformation = Form.create()(ConsumerInformation);
export default WrappedConsumerInformation;
