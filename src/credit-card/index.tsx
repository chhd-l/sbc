import { AuthWrapper, BreadCrumb, cache, Const, history } from 'qmkit'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import AdyenCreditCardForm from './payment-type/adyen';
import PayuCreditCardForm from './payment-type/payu';
import CyberCreditCardForm from './payment-type/cyber';
import './index.less'
import { Breadcrumb, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { fetchGetPayPspList, fetchAddPaymentInfo } from './webapi';

export default class CreditCard extends Component<any> {
    state = {
        adyenCardParam: {},
        payPspItem: [],
        storeId: -1,
        customerId: '',
        customerAccount: '',
        pspName: '',
        fromSubscroption:false
    }

    componentDidMount() {
        this.paymentCardType()

    }
     getRequest(url) { 
        var theRequest = {},strs; 
           var str = url.substr(1); 
           strs = str.split("&"); 
           for(var i = 0; i < strs.length; i ++) { 
              theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
           } 
        return theRequest; 
     } 
    /**
     * 获取店铺支持银行卡
     */
    async paymentCardType() {
        const customerId = this.props.match.params.id || '';
        const customerAccount = this.props.match.params.account || ''
        const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')
        const { res } = await fetchGetPayPspList(storeId)
        let { payPspItemVOList, name } = res.context
        if (res.code === Const.SUCCESS_CODE) {
            let list = payPspItemVOList[0]?.payPspItemCardTypeVOList ?? []
            this.setState({
                payPspItem: list,
                storeId,
                customerId,
                customerAccount,
                pspName: name,
                
            })
        }
    }


    renderCreditForm() {
        const { customerId, storeId, pspName } = this.state;
        const {fromSubscroption}=this.getRequest(history.location.search) as any;
        let d = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
        let cardType=this.payCardType(d);
        let clientKey = Const.PAYMENT[d]
        switch (d) {
            case 'de':
            case 'fr':
                return <AdyenCreditCardForm fromSubscroption={fromSubscroption} clientKey={clientKey} cardType={cardType} pspName={pspName} storeId={storeId} customerId={customerId} />
            case 'mx':
            case 'ru':
            case 'tr':
                return <PayuCreditCardForm fromSubscroption={fromSubscroption} storeId={storeId} cardType={cardType} customerId={customerId} clientKey={clientKey} pspName={pspName} />
            default:
                return <CyberCreditCardForm country={clientKey} />
        }
    }

    payCardType(d) {
        switch (d) {
            case 'fr':
                return ['mc', 'visa', 'cartebancaire'];
            case 'ru':
                return ['mc', 'visa', 'amex', 'discover'];
            case 'us':
                return ['mc', 'visa', 'amex', 'discover'];
            case 'de':
                return ['mc', 'visa'];
            default:
                return ['mc', 'visa', 'amex'];
        }
    }

    render() {
        const { customerId, customerAccount, payPspItem } = this.state
        return (
            // <AuthWrapper functionName="f_create_credit_card">
            <div>
                <BreadCrumb thirdLevel={true}>
                    <Breadcrumb.Item><FormattedMessage id="payment.createPaymentMethod" /></Breadcrumb.Item>
                </BreadCrumb>
                <div className="payment-method-content">
                    {payPspItem.map(item => {
                        return <img src={item.imgUrl} key={item.id} style={{ width: 40, marginRight: 10 }} />
                    })}
                    <div style={{ marginTop: 10 }}>
                        {this.renderCreditForm()}
                    </div>
                </div>
            </div>
            // </AuthWrapper>
        )
    }
}


