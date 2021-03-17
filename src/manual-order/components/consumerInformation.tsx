import React from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { getCustomerDetails } from '../webapi';
import debounce from 'lodash/debounce';
const { Option } = Select;
class ConsumerInformation extends React.Component<any, any> {
  state = {
    customerId: '',
    customerList: [],
    value: '',
    fetching: false
  };

  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch, 800);
  }
  componentDidMount() {}
  onChange = (customerId) => {
    let obj = this.state.customerList.find((item) => item.customerId === customerId);
    if (!obj) return;
    this.props.getCustomerId(customerId);
    // this.setState({
    //   value: obj.customerName
    // });
    this.props.form.setFieldsValue({
      ownerName: obj.customerName
    });
  };
  onSearch = async (value) => {
    this.setState({ customerList: [], fetching: true });
    if (value) {
      const { res } = await getCustomerDetails({ keywords: value });
      this.setState({
        customerList: res.context,
        fetching: false
      });
    } else {
      this.setState({ customerList: [] });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching } = this.state;
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
                <Select showSearch notFoundContent={fetching ? <Spin size="small" /> : null} placeholder={this.props.placeholder} style={this.props.style} defaultActiveFirstOption={false} filterOption={false} onSearch={this.onSearch} onChange={this.onChange}>
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
