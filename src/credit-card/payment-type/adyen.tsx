import React, { Component } from 'react'
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import { fetchAddPaymentInfo } from '../webapi';
import { Button, message, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import {  Const, history, RCi18n } from 'qmkit';
import translations from '../js/translations';
interface IKey {
  appId: string
  environment: string
  locale: string
  openPlatformSecret: string
  pspItemCode: string
  pspName: string
  publicKey: string
}
interface IAdyenCardParam {
  "storeId": number
  "customerId": string
  "encryptedCardNumber": string,//adyen
  "encryptedExpiryMonth": string,//adyen
  "encryptedExpiryYear": string,//adyen
  "encryptedSecurityCode": string,//adyen
  "holderName": string,//adyen
  "pspName": string
  isDefault?:number

}
export default class AdyenCreditCardForm extends Component {
  card:any
  props: {
    clientKey:IKey
    showPayButton?: boolean
    showBrandIcon?: boolean
    hasHolderName?: boolean
    holderNameRequired?: boolean
    taxNumber?: number
    customerId: string
    storeId: number
    cardType:any
    fromSubscroption?:any
    saveCardCallBack?:Function //兼容subscription 使用credit-card采用组件方式而不是路由
  }
  constructor(props) {
    super(props);
  }
  state = {
    adyenCardParam: {},
    loading:false
  }
  static defaultProps = {
    showPayButton: false,
    showBrandIcon: false,
    hasHolderName: true,
    holderNameRequired: false,
    taxNumber: 20
  }

  componentDidMount() {
    this.initFormPay()
  }


  /**
   * 初始化adyen drop-in ui
   */
  initFormPay() {
    const { hasHolderName, taxNumber, holderNameRequired, showPayButton, showBrandIcon ,cardType,clientKey,fromSubscroption} = this.props;
    const configuration: any = {
      locale: clientKey.locale,
      environment: clientKey.environment,
      clientKey: clientKey?.openPlatformSecret??'',//"pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ",
      paymentMethodsResponse: this.paymentMethodsResponse,
      onChange: this.handleOnChange,
      onAdditionalDetails: this.handleOnAdditionalDetails,
      onSubmit: this.handlerSubmit,
      translations
    };
    const checkout = new AdyenCheckout(configuration);
    this.card = checkout.create('card', {
      //: ["visa", "amex"],
      brands:cardType,
      enableStoreDetails:!fromSubscroption,
      hasHolderName,
      holderNameRequired,
      showPayButton,
      showBrandIcon,
      taxNumber,

    }).mount('#component-container');

  }
  /**
   * 当购物者提供所需的付款详细信息时调用
   * @param state
   */
  handlerSubmit = (state) => {
    if (state.isValid) {
    }
  }
  /**
   * 当购物者提供所需的付款详细信息时调用
   * @param state 表单状态
   * @param component  组组件
   */
  handleOnChange = (state, component) => {
    if (state.isValid) {
      console.log(state.data.paymentMethod)
      this.setState({
        adyenCardParam: state.data.paymentMethod
      })
    }
  }
  /**
   * 用于本机 3D Secure 2 和本机 QR 码支付方式
   * @param state
   * @param component
   */
  handleOnAdditionalDetails = (state, component) => {
    // Provides the data that you need to pass in the `/payments/details` call.
    // Provides the active component instance that called this event.
    console.log(state.data, component)
  }
  /**
   * 根据他们的国家/地区、设备和付款金额获取可用付款方式的列表
   * @param res
   */
  paymentMethodsResponse = (res) => {
    console.log(res)
  }
  async save() {
   const isDefault= this.card.data.storePaymentMethod
    const { adyenCardParam } = this.state;
    const { customerId, storeId } = this.props
    const { encryptedCardNumber, encryptedExpiryMonth, encryptedExpiryYear, encryptedSecurityCode, holderName } = adyenCardParam as any
    let params: IAdyenCardParam = {
      storeId,
      customerId,
      encryptedCardNumber,
      encryptedExpiryMonth,
      encryptedExpiryYear,
      encryptedSecurityCode,
      holderName,
      pspName:this.props.clientKey.pspName,
      isDefault:isDefault?1:0
    }
    this.setState({loading:true})
   const{res}= await fetchAddPaymentInfo(storeId, params);
   if(res.code==Const.SUCCESS_CODE){
     message.success(res.message);
     if(this.props.saveCardCallBack){
       //兼容subscription 使用credit-card采用组件方式而不是路由
       this.props.saveCardCallBack()
     }else{
       history.go(-1);
     }
   }
    this.setState({loading:false})
  }
  render() {

    return (
      <Spin spinning={this.state.loading}>
        <div id="component-container" ></div>
        {!this.props.fromSubscroption&&<div> <span className="ant-form-item-required red">{RCi18n({ id: 'payment.isDefaultTip' })}</span></div>}
        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => this.save()}> <FormattedMessage id="save" /></Button>
        </div>
      </Spin>
    )
  }
}
