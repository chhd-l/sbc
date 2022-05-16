import React from 'react';
import { Row, Col, Form, Input, Select, Spin, Radio } from 'antd';
import { getCustomerDetails } from '../webapi';
import debounce from 'lodash/debounce';
import { AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const { Option } = Select;
class ConsumerInformation extends React.Component<any, any> {
  state = {
    customer: {
      customerId: '',
      customerName: '',
      customerAccount: ''
    },
    customerList: [],
    fetching: false,
    showGuest:false,
    showEmail:false,
  };

  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch, 800);
  }
  componentDidMount() {
    let userGroupValue = sessionStorage.getItem('user-group-value');
    let petOwnerType = sessionStorage.getItem('pet-owner-type');
    if (userGroupValue == 'felinStore') {
      this.setState({
        showGuest: true
      })
      this.props.userGroupType('felinStore')
    } else {
      this.setState({
        showGuest: false
      })
    }
    if (petOwnerType == 'member') {
      this.setState({
        showEmail:true,
      })
    }else if(petOwnerType == 'guest') {
      this.setState({
        showEmail:false,
      })
      this.props.petOwnerType('guest')
    }
  }
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

  userChange = (e) => {
    let _value = e.target.value;
    sessionStorage.setItem('user-group-value',_value)
    if (_value == 'felinStore') {
      this.setState({
        showGuest:true
      })
      this.props.userGroupType('felinStore')
    }else {
      this.setState({
        showGuest:false
      })
    sessionStorage.removeItem('pet-owner-type')
    this.props.form.resetFields('petOwnerType')
      this.props.userGroupType('fgs')
    }
  }

  petOwnerTypeChange = (e) =>{
    let _value = e.target.value;
    sessionStorage.setItem('pet-owner-type',_value)
    if (_value == 'member') {
      this.setState({
        showEmail:true,
      })
      this.props.petOwnerType('')
    }else {
      this.setState({
        showEmail:false,
      })
      this.props.petOwnerType('guest')
    }
  }

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
    const { fetching,showGuest,showEmail } = this.state;
    const { customerName, customerAccount } = this.state.customer;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
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
        <h3><FormattedMessage id="Order.Step1" /></h3>
        <h4>
          <FormattedMessage id={`Order.${this.props.stepName}`} />
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="selectLanguage">
          <Form {...formItemLayout}>
            <Form.Item label={<FormattedMessage id="Order.userGroup" />}>
              {getFieldDecorator('userGroup', {
                initialValue: sessionStorage.getItem('user-group-value'),
                rules: [
                  {
                    required: true,
                  }
                ]
              })(
                <Radio.Group onChange={this.userChange}>
                  <AuthWrapper functionName='f_userGroup_fgs_order'>
                    <Radio value='fgs'><FormattedMessage id={'Order.fgs'} /></Radio>
                  </AuthWrapper>
                  <AuthWrapper functionName='f_userGroup_fenlinStore_order'>
                    <Radio value='felinStore'><FormattedMessage id={'Order.felinStore'} /></Radio>
                  </AuthWrapper>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Order.petOwnerType" />}>
              {getFieldDecorator('petOwnerType',{
                initialValue: sessionStorage.getItem('pet-owner-type'),
                  rules: [
                    {
                      required: true,
                    }
                  ]
              })(
                <Radio.Group onChange={this.petOwnerTypeChange}>
                  <Radio value='member'><FormattedMessage id={'PetOwner.Member'} /></Radio>
                  {showGuest?<Radio value='guest'><FormattedMessage id={'PetOwner.Guest'} /></Radio>:null}
                </Radio.Group>
              )}
            </Form.Item>
            {showEmail?<>
            <Form.Item label={<FormattedMessage id="Order.PetOwnerAccount" />}>
              {getFieldDecorator('customerAccount', {
                initialValue: customerAccount,
                rules: [
                  {
                    required: showEmail ,
                    message: <FormattedMessage id="Order.piypoa" />
                  }
                ]
              })(
                <Select showSearch getPopupContainer={(trigger: any) => trigger.parentNode} notFoundContent={fetching ? <Spin size="small" /> : null} placeholder="Please input your Pet owner account!" style={this.props.style} defaultActiveFirstOption={false} filterOption={false} onSearch={this.onSearch} onChange={this.onChange}>
                  {options}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Order.PetOwnerName" />}>
              {getFieldDecorator('customerName', {
                initialValue: customerName
              })(<Input disabled />)}
            </Form.Item>
            </>:null}
          </Form>
        </div>
      </div>
    );
  }
}

export default ConsumerInformation;
