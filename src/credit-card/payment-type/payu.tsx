import React, { Component } from 'react'
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
// import './js/token.min.js'
import '../js/secure-fields.min.js'
import { cache, Const, RCi18n } from 'qmkit';
import styleCss from '../js/style.js';
import { Col, Form, Input, Row, Button, message, Spin } from 'antd';
import { fetchAddPaymentInfo } from '../webapi';
interface IKey {
  app_id: string
  key: string
}
interface IProps {
  clientKey: IKey
  customerId: string
  storeId: number
  pspName: string
  form:any
  cardType:any
}
class PayuCreditCardForm extends Component<IProps> {
  cardNumber: any;
  expiry: any;
  cvv: any;

  constructor(props) {
    super(props);

  }
  static defaultProps = {

  }
  componentDidMount() {
    this.initFormPay()
  }
  state = {
    cardOwner: '',
    email: '',
    phone: '',
    loading: false
  }



  async initFormPay() {
    console.log((window as any).POS)
    const fonts = [
      {
        src: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
      }
    ]
    const formElements = new (window as any).POS.Fields(this.props.clientKey.key, {
      fonts
    })

    const placeholders = {
      cardNumber: RCi18n({ id: 'payment.cardNumber' }),
      expDate: 'MM/YY',
      cvv: 'CVV'
    }

    //创建卡号
    this.cardNumber = formElements.create('cardNumber', {
      style: styleCss,
      placeholders
    })
    this.cardNumber.mount('#card-number')
    this.cardNumber.on('change', (event) => {
      console.log(event)
    })
    // 创建日期
    this.expiry = formElements.create('creditCardExpiry', {
      style: styleCss,
      placeholders
    })
    this.expiry.mount('#exp-date')
    this.expiry.on('change', (event) => {
      console.log(event)
    })
    //创建 cvv
    this.cvv = formElements.create('cvv', {
      style: styleCss,
      placeholders
    })
    this.cvv.mount('#cvv')
    this.cvv.on('change', (event) => {
      console.log(event)
    })


  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {

        const additionalData = {
          holder_name: values.cardOwner// This field is mandatory

        }
        const result = await (window as any).POS.createToken(this.cardNumber, {
          additionalData,
          environment: Const.PAYMENT_ENVIRONMENT // Set the PaymentsOS environment you're connecting to
        })
        if (result.error) {
          message.error(result.error['cvv'] + ',' + result.error['pan'] + ',' + result.error['expiry'])

        } else {
          let _result = JSON.parse(result)
          console.log(_result)

          this.save({ ..._result, ...values })




        }




      }
    });
  }
  async save(params) {
    this.setState({ loading: true })
    let param = {
      binNumber: params.bin_number,
      customerId: this.props.customerId,
      email: params.email,
      isDefault: "0",
      paymentToken: params.token,
      paymentVendor: "VISA",
      phone: params.phone,
      pspName: this.props.pspName,
      storeId: this.props.storeId
    }
   const {res}= await fetchAddPaymentInfo(this.props.storeId, param);
    if(res.code==Const.SUCCESS_CODE){
      message.success(res.message);
      history.go(-1);
    }
    this.setState({ loading: false })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="checkout-page">
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>

          <Form layout="vertical" onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label={RCi18n({ id: 'payment.cardOwner' })} style={{ marginBottom: 10 }}>

              {getFieldDecorator('cardOwner', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name',
                  },
                ],
              })(<Input placeholder={RCi18n({ id: 'payment.cardOwner' })} style={{ height: 38 }} />)}





            </Form.Item>
            <Form.Item label={RCi18n({ id: 'payment.cardNumber' })} style={{ marginBottom: 10 }}>
              <div className="payment-form">
                <div id="card-number" className="input empty field"></div>
                <div id="exp-date" className="input empty field"></div>
                <div id="cvv" className="input empty field"></div>
              </div>
            </Form.Item>

            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={RCi18n({ id: 'payment.email' })} style={{ marginBottom: 10 }}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email',
                        message: RCi18n({ id: 'payment.email' }),
                      },
                      {
                        required: true,
                        message: RCi18n({ id: 'payment.email' })
                      },
                    ],
                  })(<Input placeholder={RCi18n({ id: 'payment.email' })} style={{ height: 38 }} />)}

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={RCi18n({ id: 'payment.phone' })} style={{ marginBottom: 10 }}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: RCi18n({ id: 'payment.phone' }) }],
                  })(<Input placeholder={RCi18n({ id: 'payment.phone' })} style={{ height: 38 }} />)}


                </Form.Item>
              </Col>
            </Row>

            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <Button type="primary" htmlType="submit"> Save</Button>
            </div>

          </Form>
        </Spin>
      </div>
    )
  }
}


export default Form.create<IProps>()(PayuCreditCardForm);