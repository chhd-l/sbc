import React, { Component } from 'react'
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
// import './js/token.min.js'
import '../js/secure-fields.min.js'
import { cache, Const, RCi18n } from 'qmkit';
import styleCss from '../js/style.js';
import { Col, Form, Input, Row, Button, message } from 'antd';
import { fetchAddPaymentInfo } from '../webapi';
interface IKey {
  app_id: string
  key: string
}
class PayuCreditCardForm extends Component {


  cardNumber: any;
  expiry: any;
  cvv: any;
  props: {
    secretKey: IKey
    cardPaymentData: Function
    customerId:string
    storeId:number,
    pspName:string
  }
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.initFormPay()
  }
  state = {
    cardOwner: '',
    email: '',
    phone: ''
  }



  async initFormPay() {
    console.log((window as any).POS)
    const fonts = [
      {
        src: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
      }
    ]
    const formElements = new (window as any).POS.Fields(this.props.secretKey.key, {
      fonts
    })

    const placeholders = {
      cardNumber: 'Номер карты',
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
          holder_name:values.cardOwner// This field is mandatory

        }
        const result = await (window as any).POS.createToken(this.cardNumber, {
          additionalData,
          environment: process.env.NODE_ENV === 'development' ? "test" : 'live', // Set the PaymentsOS environment you're connecting to
        })
        if(result.error){
          message.error(result.error['cvv']+','+result.error['pan']+','+result.error['expiry'])
          
        }else{
        let _result=JSON.parse(result)
        console.log(_result)

          this.save({..._result,...values})




        }
        
        
       
   
      }
    });
  }
async save(params) {
   
        let param = {
          binNumber: params.bin_number,
          customerId: this.props.customerId,
          email: params.email,
          isDefault: "0",
          paymentToken: params.token,
          paymentVendor: "VISA",
          phone: params.phone,
          pspName: "PAYU",
          storeId:this.props.storeId
        }
        await fetchAddPaymentInfo(this.props.storeId, param);
    }
 
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="checkout-page">
        <Form layout="vertical" onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label={RCi18n({id:'payment.cardOwner'})} style={{ marginBottom: 10 }}>

            {getFieldDecorator('cardOwner', {
              rules: [
                {
                  required: true,
                  message: 'Please input your name',
                },
              ],
            })(<Input placeholder={RCi18n({id:'payment.cardOwner'})} style={{ height: 38 }} />)}





          </Form.Item>
          <Form.Item label={RCi18n({id:'payment.cardNumber'})} style={{ marginBottom: 10 }}>
            <div className="payment-form">
              <div id="card-number" className="input empty field"></div>
              <div id="exp-date" className="input empty field"></div>
              <div id="cvv" className="input empty field"></div>
            </div>
          </Form.Item>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label={RCi18n({id:'payment.email'})} style={{ marginBottom: 10 }}>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: RCi18n({id:'payment.email'}),
                    },
                    {
                      required: true,
                      message: RCi18n({id:'payment.email'})
                    },
                  ],
                })(<Input placeholder={RCi18n({id:'payment.email'})} style={{ height: 38 }} />)}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={RCi18n({id:'payment.phone'})} style={{ marginBottom: 10 }}>
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: RCi18n({id:'payment.phone'}) }],
                })(<Input placeholder={RCi18n({id:'payment.phone'})}  style={{ height: 38 }} />)}


              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <Button type="primary" htmlType="submit"> Save</Button>
          </div>
         
        </Form>

      </div>
    )
  }
}

export default Form.create({ name: 'PAYU' })(PayuCreditCardForm);