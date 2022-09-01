import { AuthWrapper, BreadCrumb, cache, Const, history } from 'qmkit'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import AdyenCreditCardForm from './payment-type/adyen';
import PayuCreditCardForm from './payment-type/payu';
import CyberCreditCardForm from './payment-type/cyber';
import './index.less'
import { Breadcrumb, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { fetchGetPayPspList, fetchAddPaymentInfo, getOriginClientKeys } from './webapi';

export default class CreditCard extends Component<any> {
    state = {
        payPspItem: [],
        storeId: -1,
        customerId: '',
        payCode: '',
        customerAccount: '',
        clientKey: {},
        fromSubscroption: false
    }

    componentDidMount() {
        this.paymentCardType()

    }
    getRequest(url) {
        var theRequest = {}, strs;
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
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
        let { payPspItemVOList } = res.context
        if (res.code === Const.SUCCESS_CODE) {
            let payCode;
            let list;
            if (payPspItemVOList[0].code === 'adyen_ideal') {
                payCode = payPspItemVOList[1].code;
                list = payPspItemVOList[1]?.payPspItemCardTypeVOList ?? []
            } else {
                payCode = payPspItemVOList[0].code;
                list = payPspItemVOList[0]?.payPspItemCardTypeVOList ?? []
            }

            this.setState({
                payCode,
                payPspItem: list,
                storeId,
                customerId,
                customerAccount,
            }, () => {
                this.getOriginClientKeys(payCode)
            })
        }
    }
    getOriginClientKeys = (payCode) => {
        getOriginClientKeys().then(({ res }: any) => {
            const originClientKeysList = res.context.originClientKeysList;
            const item = originClientKeysList.find(item => item.pspItemCode === payCode);
            if (!item) return;
            this.setState({
                clientKey: item || {}
            })
        })
    }



    renderCreditForm(payCode, clientKey) {
        const { customerId, storeId } = this.state;
        const { fromSubscroption } = this.getRequest(history.location.search) as any;
        let d = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
        let cardType = this.payCardType(d);
        // console.log(clientKey, 'fromSubscroption')
        if (clientKey) {
            switch (payCode) {
                case 'adyen_credit_card':
                    return <AdyenCreditCardForm fromSubscroption={fromSubscroption} clientKey={clientKey} cardType={cardType} storeId={storeId} customerId={customerId} />
                case 'payu_ru':
                case 'payu_tu':
                case 'payu':
                    return <PayuCreditCardForm fromSubscroption={fromSubscroption} storeId={storeId} cardType={cardType} customerId={customerId} clientKey={clientKey} />
                default:
                    return <CyberCreditCardForm country={clientKey} />
            }
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
            case 'jp': 
                return ['mc', 'visa', 'amex','jcb','diners']
            default:
                return ['mc', 'visa', 'amex'];
        }
    }

    render() {
        const { customerId, customerAccount, payCode, payPspItem, clientKey } = this.state
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
                    {clientKey.pspItemCode && <div style={{ marginTop: 10 }}>
                        {this.renderCreditForm(payCode, clientKey)}
                    </div>}
                </div>
            </div>
            // </AuthWrapper>
        )
    }
}


