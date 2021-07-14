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
    /**
     * 获取店铺支持银行卡
     */
    async paymentCardType() {
        const customerId = this.props.match.params.id || '';
        // const fromSubscroption=this.props.location.query.fromSubscroption;
        const customerAccount = this.props.match.params.account || ''
        const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')
        const { res } = await fetchGetPayPspList(storeId)
        console.log(this.props.location,'this.props.location')
        let { payPspItemVOList, name } = res.context
        if (res.code === Const.SUCCESS_CODE) {
            let list = payPspItemVOList[0]?.payPspItemCardTypeVOList ?? []
            this.setState({
                payPspItem: list,
                storeId,
                customerId,
                customerAccount,
                pspName: name,
                // fromSubscroption
            })
        }
    }


    renderCreditForm() {
        const { payPspItem, customerId, storeId, pspName,fromSubscroption } = this.state;
        console.log(fromSubscroption)
        let d = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
        let cardType=this.payCardType(d);
        let clientKey = Const.PAYMENT[d]
        console.log(payPspItem, d, clientKey)
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
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/customer-list">Pet owner</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/customer-list">Pet owner list</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/petowner-details/${customerId}/${customerAccount}`}>Pet owner detail</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Create payment method</Breadcrumb.Item>
                </Breadcrumb>
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


