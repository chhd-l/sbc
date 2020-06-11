import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio,
  Menu,
  Card,
  Checkbox,
  Empty,
  Spin
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { addressList } from '@/order-add-old/webapi';
import axios from 'axios';

const { TextArea } = Input;

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BillingInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      clinicsVOS: [],
      cardForm: {
        customerId: 'ff8080817291d3ce017292a0f1df0000',
        cardNumber: '4772910000000008',
        cardType: 'CREDIT',
        cardMmyy: '12/23',
        cardCvv: '123',
        cardOwner: '12 12',
        email: '',
        vendor: 'VISA',
        phoneNumber: '',
        isDefault: 1
      },
      title: '',
      countryArr: [],
      cityArr: [],
      addressList: [],
      isDefault: false,
      clinicList: [],
      carrentCardNumber: '',
      loading: false,
      cardList: []
    };
  }
  componentDidMount() {
    this.getList();
  }
  getList() {
    webapi
      .getPaymentMethods({ customerId: this.props.customerId })
      .then((res) => {
        console.log(res);
        let data = res.res.context;
        let cardForm = data[0];
        this.props.form.setFieldsValue({
          cardNumber: cardForm.cardNumber,
          cardType: cardForm.cardType,
          cardMmyy: cardForm.cardMmyy,
          cardCvv: cardForm.cardCvv,
          cardOwner: cardForm.cardOwner,
          email: cardForm.email,
          vendor: cardForm.vendor,
          phoneNumber: cardForm.phoneNumber
        });
        this.setState({
          carrentCardNumber: data[0]['cardNumber'],
          cardList: data,
          cardForm: cardForm,
          title: data[0]['cardNumber'],
          isDefault: data[0].isDefault === 1 ? true : false
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveCard();
      }
    });
  };

  async saveCard() {
    console.log(this.state.cardForm, 'haha');

    const { cardForm } = this.state;
    this.setState({
      loading: true
    });
    try {
      let res = await axios.post(
        'https://api.paymentsos.com/tokens',
        {
          token_type: 'credit_card',
          card_number: cardForm.cardNumber,
          expiration_date: cardForm.cardMmyy.replace(/\//, '-'),
          holder_name: cardForm.cardOwner,
          credit_card_cvv: cardForm.cardCvv
        },
        {
          headers: {
            public_key:
              process.env.NODE_ENV === 'development'
                ? 'fd931719-5733-4b77-b146-2fd22f9ad2e3'
                : process.env.REACT_APP_PaymentKEY,
            'x-payments-os-env':
              process.env.NODE_ENV === 'development'
                ? 'test'
                : process.env.REACT_APP_PaymentENV,
            'Content-type': 'application/json',
            app_id: 'com.razorfish.dev_mexico',
            'api-version': '1.3.0'
          }
        }
      );
      console.log(res.data);
      let params = {
        cardCvv: cardForm.cardCvv,
        cardMmyy: cardForm.cardMmyy,
        cardNumber: cardForm.cardNumber,
        cardOwner: cardForm.cardOwner,
        cardType: res.data.card_type,
        customerId: this.props.customerId,
        email: cardForm.email,
        phoneNumber: cardForm.phoneNumber,
        vendor: res.data.vendor,
        id: cardForm.id ? cardForm.id : '',
        isDefault: this.state.isDefault ? 1 : 0
      };
      let addRes = await webapi.addOrUpdatePaymentMethod(params);
      this.getList();
      this.setState({
        loading: false
      });
    } catch (e) {
      let res = e.response;
      this.setState({
        loading: false
      });
      if (res) {
        console.log(
          res.data.more_info,
          'body/expiration_date should match pattern "^(0[1-9]|1[0-2])(/|-|.| )d{2,4}"'
        );
        if (
          res.data.more_info.indexOf(
            'body/credit_card_cvv should match pattern'
          ) !== -1
        ) {
          message.error('your card cvv is invalid');
        } else if (
          res.data.more_info.indexOf(
            'body/card_number should match pattern'
          ) !== -1
        ) {
          message.error('your card number is invalid');
        } else if (
          res.data.more_info.indexOf(
            'body/expiration_date should match pattern'
          ) !== -1
        ) {
          message.error('your card expiration_date is invalid');
        } else {
          message.error(res.data.description);
        }
        return;
      }
    }
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.cardForm;
    data[field] = value;
    this.setState({
      cardForm: data
    });
  };
  addCard() {
    let cardForm = {
      customerId: this.props.customerId,
      cardNumber: '',
      cardType: '',
      cardMmyy: '',
      cardCvv: '',
      cardOwner: '',
      email: '',
      vendor: '',
      phoneNumber: '',
      isDefault: 0
    };
    this.props.form.setFieldsValue({
      cardNumber: cardForm.cardNumber,
      cardType: cardForm.cardType,
      cardMmyy: cardForm.cardMmyy,
      cardCvv: cardForm.cardCvv,
      cardOwner: cardForm.cardOwner,
      email: cardForm.email,
      vendor: cardForm.vendor,
      phoneNumber: cardForm.phoneNumber
    });
    this.setState({
      cardForm: cardForm,
      title: 'Add',
      carrentCardNumber: ''
    });
  }
  delCard = () => {
    webapi
      .deleteCard({ id: this.state.cardForm.id })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Successful');
          this.getList();
        } else {
          message.error(res.message || 'Delete failed');
        }
      })
      .catch((err) => {
        message.error('Delete failed');
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
  };

  switchForm = (id) => {
    const { cardList } = this.state;
    let cardForm = cardList.find((item) => {
      return item.id === id;
    });
    this.props.form.setFieldsValue({
      cardNumber: cardForm.cardNumber,
      cardType: cardForm.cardType,
      cardMmyy: cardForm.cardMmyy,
      cardCvv: cardForm.cardCvv,
      cardOwner: cardForm.cardOwner,
      email: cardForm.email,
      vendor: cardForm.vendor,
      phoneNumber: cardForm.phoneNumber,
      rfc: cardForm.rfc
    });
    this.setState({
      carrentCardNumber: cardForm.cardNumber,
      cardForm: cardForm,
      title: cardForm.cardNumber,
      isDefault: cardForm.isDefault === 1 ? true : false
    });
  };

  render() {
    const { countryArr, cityArr, clinicList } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Spin spinning={this.state.loading}>
          <Col span={3}>
            <h3>All Methods( {this.state.cardList.length} )</h3>
            <ul>
              {this.state.cardList.map((item) => (
                <li
                  key={item.id}
                  style={{
                    cursor: 'pointer',
                    color:
                      item.cardNumber === this.state.carrentCardNumber
                        ? '#e2001a'
                        : ''
                  }}
                  onClick={() => this.switchForm(item.id)}
                >
                  **** {item.cardNumber.substr(item.cardNumber.length - 4)}
                </li>
              ))}
            </ul>
            <Button type="danger" onClick={() => this.addCard()}>
              Add
            </Button>
          </Col>
          <Col span={20}>
            {this.state.cardList.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : null}
            <Card
              title={this.state.title}
              style={{
                display: this.state.cardList.length === 0 ? 'none' : 'block'
              }}
              extra={
                <div
                  style={{
                    display:
                      this.props.customerType === 'Guest' ? 'none' : 'block'
                  }}
                >
                  <Checkbox
                    checked={this.state.isDefault}
                    onChange={() => this.clickDefault()}
                  >
                    Set default payment method
                  </Checkbox>
                  <Button
                    type="danger"
                    icon="close"
                    onClick={() => this.delCard()}
                  >
                    Delete
                  </Button>
                </div>
              }
            >
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="Card number">
                      {getFieldDecorator('cardNumber', {
                        rules: [
                          {
                            required: true,
                            message: 'your card number is invalid!'
                            // transform:value => {
                            //   console.log(value.replace(/\s*/g,""))
                            //   return value.replace(/\s*/g,"")
                            // }
                          }
                        ],
                        getValueFromEvent: (event) => {
                          return event.target.value.replace(/\s+/g, '');
                        }
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value.replace(
                              /\s*/g,
                              ''
                            );
                            console.log(value);
                            this.onFormChange({
                              field: 'cardNumber',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Card MMYY">
                      {getFieldDecorator('cardMmyy', {
                        rules: [
                          {
                            required: true,
                            message: 'your card expiration_date is invalid!'
                          }
                        ],
                        getValueFromEvent: (event) => {
                          console.log(event);
                          let value = event.target.value;
                          let beforeValue = value.substr(0, value.length - 1);
                          let inputValue = value.substr(value.length - 1, 1);
                          let data = this.state.cardForm;
                          console.log(beforeValue, inputValue, data);
                          if (
                            data['cardMmyy'] !== beforeValue &&
                            data['cardMmyy'].substr(
                              0,
                              data['cardMmyy'].length - 1
                            ) !== value
                          )
                            return value;
                          if (
                            isNaN(parseInt(inputValue)) &&
                            value.length > data['cardMmyy'].length
                          )
                            return value;
                          if (
                            data['cardMmyy'].length == 2 &&
                            value.length == 3
                          ) {
                            data['cardMmyy'] =
                              value.slice(0, 2) + '/' + value.slice(2);
                          } else if (
                            data['cardMmyy'].length == 4 &&
                            value.length == 3
                          ) {
                            data['cardMmyy'] = data['cardMmyy'].slice(0, 2);
                          } else {
                            data['cardMmyy'] = value;
                          }
                          return data['cardMmyy'];
                        }
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'cardMmyy',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Card cvv">
                      {getFieldDecorator('cardCvv', {
                        rules: [
                          {
                            required: true,
                            len: 3,
                            message: 'your card cvv is invalid!'
                          }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'cardCvv',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Card owner">
                      {getFieldDecorator('cardOwner', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Card owner!'
                          }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'cardOwner',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="email">
                      {getFieldDecorator('email', {
                        rules: [
                          { required: true, message: 'Please input email!' }
                        ]
                      })(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'email',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  {/* <Col span={12}>
                    <FormItem label="City">
                      {getFieldDecorator('cityId', {
                        rules: [
                          { required: true, message: 'Please input City!' }
                        ]
                      })(
                        <Select
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'cityId',
                              value
                            });
                          }}
                        >
                          {cityArr.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Address 1">
                      {getFieldDecorator('address1', {
                        rules: [
                          { required: true, message: 'Please input Address 1!' }
                        ]
                      })(
                        <TextArea
                          disabled={this.props.customerType === 'Guest'}
                          autoSize={{ minRows: 3, maxRows: 3 }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'address1',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Address 2">
                      {getFieldDecorator(
                        'address2',
                        {}
                      )(
                        <TextArea
                          disabled={this.props.customerType === 'Guest'}
                          autoSize={{ minRows: 3, maxRows: 3 }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'address2',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Reference">
                      {getFieldDecorator(
                        'rfc',
                        {}
                      )(
                        <Input
                          disabled={this.props.customerType === 'Guest'}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'rfc',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col> */}

                  <Col span={24}>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          marginRight: '20px',
                          display:
                            this.props.customerType === 'Guest'
                              ? 'none'
                              : 'block'
                        }}
                      >
                        Save
                      </Button>

                      <Button>
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Spin>
      </Row>
    );
  }
}
export default Form.create()(BillingInfomation);
