import React, { Component } from 'react'
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
export default class CyberCreditCardForm extends Component {
  props:{
    country:string
    saveCardCallBack?:Function //兼容subscription 使用credit-card采用组件方式而不是路由
  }
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.initFormPay()
  }



  initFormPay() {
    const configuration = {
      locale: "en_US",
      environment: "test",
      clientKey: "YOUR_CLIENT_KEY",
      onChange: this.handleOnChange
    };
    const checkout = new AdyenCheckout(configuration);
    const customCard = checkout.create('securedfields', {
      // Optional configuration
      type: 'card',
      brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
      styles: {
          error: {
              color: 'red'
          },
          validated: {
              color: 'green'
          },
          placeholder: {
              color: '#d8d8d8'
          }
      },
      // Only for Web Components before 4.0.0.
      // For Web Components 4.0.0 and above, configure aria-label attributes in translation files
      ariaLabels: {
          lang: 'en-GB',
          encryptedCardNumber: {
              label: 'Credit or debit card number field'
          }
      },
      // Events
      onChange: function() {},
      onValid : function() {},
      onLoad: function() {},
      onConfigSuccess: function() {},
      onFieldValid : function() {},
      onBrand: function() {},
      onError: function() {},
      onFocus: function() {},
      onBinValue: function(bin) {}
  }).mount('#customCard-container');
  }

  handleOnChange(state, component) {
    console.log(state.isValid, state.data, component)

  }

  render() {
    return (
      <div>
       <div id="customCard-container"></div>
      </div>
    )
  }
}
