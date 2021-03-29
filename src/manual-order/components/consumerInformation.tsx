import React from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { getCustomerDetails } from '../webapi';
import debounce from 'lodash/debounce';
const { Option } = Select;
class ConsumerInformation extends React.Component<any, any> {
  state = {
    customer: {
      customerId: '',
      customerName: '',
      customerAccount: ''
    },
    customerList: [],
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
    this.props.getCustomerId({
      customerId,
      customerName: obj.customerName,
      customerAccount: obj.customerAccount
    });
    // this.setState({
    //   customerId,
    //   customerName: obj.customerName,
    //   customerAccount:obj.customerAccount
    // });
  };
  onSearch = async (value) => {
    this.setState({ customerList: [], fetching: true });
    if (value) {
      const { res } = await getCustomerDetails({ keywords: value, storeId: this.props.storeId });
      this.setState({
        customerList: res?.context ?? [],
        fetching: false
      });
    } else {
      this.setState({ customerList: [] });
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.customer) !== JSON.stringify(state.customer)) {
      return {
        customer: props.customer
      };
    }
    return null;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching } = this.state;
    const { customerName, customerAccount } = this.state.customer;
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
    const options = this.state.customerList.map((d, index) => (
      <Option key={d.customerDetailId} value={d.customerId}>
        {d.customerAccount}
      </Option>
    ));
    return (
      <div>
        <h3>Step1</h3>
        <h4>
          {this.props.stepName} <span className="ant-form-item-required"></span>
        </h4>
        <div className="selectLanguage">
          <Form {...formItemLayout}>
            <Form.Item label="Pet owner account">
              {getFieldDecorator('customerAccount', {
                initialValue: customerAccount,
                rules: [
                  {
                    required: true,
                    message: 'Please input your Pet owner account!'
                  }
                ]
              })(
                <Select showSearch getPopupContainer={(trigger: any) => trigger.parentNode} notFoundContent={fetching ? <Spin size="small" /> : null} placeholder="Please input your Pet owner account!" style={this.props.style} defaultActiveFirstOption={false} filterOption={false} onSearch={this.onSearch} onChange={this.onChange}>
                  {options}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Pet owner name">
              {getFieldDecorator('customerName', {
                initialValue: customerName
              })(<Input disabled />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default ConsumerInformation;
