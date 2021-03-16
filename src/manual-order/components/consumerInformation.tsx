import React from 'react';
import { Row, Col, Form, Input, Select } from 'antd';

const { Option } = Select;
import { getCustomerDetails } from '../webapi';
class ConsumerInformation extends React.Component<any, any> {
  state = {
    customerId: '',
    customerList: [],
    value: ''
  };

  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  onChange = (customerId) => {
    let obj = this.state.customerList.find((item) => item.customerId === customerId);
    if (!obj) return;
    this.props.getCustomerId(customerId);
    this.setState({
      value: obj.customerName
    });
  };
  onSearch = async (value) => {
    const { res } = await getCustomerDetails({ keywords: value });
    this.setState({
      customerList: res.context
    });
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
    const options = this.state.customerList.map((d) => <Option key={d.customerId}>{d.customerAccount}</Option>);
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
                <Select showSearch value={this.state.value} placeholder={this.props.placeholder} style={this.props.style} defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.onSearch} onChange={this.onChange} notFoundContent={null}>
                  {options}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Pet owner name">
              {getFieldDecorator('ownerName', {
                initialValue: this.state.value
              })(<Input disabled />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default ConsumerInformation;
