import React, { Component } from 'react'
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import { fetchAddPaymentInfo } from '../webapi';
import { Button, message, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import {  Const, history } from 'qmkit';

interface IKey {
  app_id: string
  key: string
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

}
export default class AdyenCreditCardForm extends Component {
  props: {
    secretKey:any
    showPayButton?: boolean
    showBrandIcon?: boolean
    hasHolderName?: boolean
    holderNameRequired?: boolean
    taxNumber?: number
    customerId: string
    pspName: string
    storeId: number
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
    const language = sessionStorage.getItem('language')
    const { hasHolderName, taxNumber, holderNameRequired, showPayButton, showBrandIcon } = this.props;
    const configuration: any = {
      locale: language,
      environment: Const.PAYMENT_ENVIRONMENT,
      clientKey: this.props.secretKey.key,//"pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ",
      paymentMethodsResponse: this.paymentMethodsResponse,
      onChange: this.handleOnChange,
      onAdditionalDetails: this.handleOnAdditionalDetails,
      onSubmit: this.handlerSubmit
    };
    const checkout = new AdyenCheckout(configuration);

    const card = checkout.create('card', {
      //: ["visa", "amex"],
      hasHolderName,
      holderNameRequired,
      showPayButton,
      showBrandIcon,
      taxNumber,
      data: {
        holderName: ''
      }
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
    state.data // Provides the data that you need to pass in the `/payments/details` call.
    component // Provides the active component instance that called this event.
  }
  /**
   * 根据他们的国家/地区、设备和付款金额获取可用付款方式的列表
   * @param res 
   */
  paymentMethodsResponse = (res) => {
    console.log(res)
  }
  async save() {
    const { adyenCardParam } = this.state;
    const { customerId, pspName, storeId } = this.props
    const { encryptedCardNumber, encryptedExpiryMonth, encryptedExpiryYear, encryptedSecurityCode, holderName } = adyenCardParam as any
    let params: IAdyenCardParam = {
      storeId,
      customerId,
      encryptedCardNumber,
      encryptedExpiryMonth,
      encryptedExpiryYear,
      encryptedSecurityCode,
      holderName,
      pspName
    }
    this.setState({loading:true})
   const{res}= await fetchAddPaymentInfo(storeId, params);
   if(res.code==Const.SUCCESS_CODE){
     message.success(res.message);
     history.go(-1);
   }
    this.setState({loading:false})
  }
  render() {

    return (
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <div id="component-container" ></div>

        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <Button type="primary" onClick={() => this.save()}> <FormattedMessage id="save" /></Button>
        </div>
      </Spin>
    )
  }
}