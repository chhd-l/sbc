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

export default class CreditCard extends Component {
    state = {
        adyenCardParam: {},
        payPspItem: [],
        storeId: '',
        customerId: '',
        customerAccount: '',
        pspName: ''
    }

    componentDidMount() {
        this.paymentCardType()

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
                pspName: name
            })
        }
    }


    renderCreditForm() {
        const { payPspItem ,customerId,storeId,pspName} = this.state;
        let d = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
 
        let secretKey = Const.PAYMENT[d]
        console.log(payPspItem,d,secretKey)
        switch (d) {
            case 'de':
            case 'fr':
                return <AdyenCreditCardForm  secretKey={secretKey} pspName={pspName} storeId={storeId} customerId={customerId}/>
            case 'mx':
            case 'ru':
            case 'tr':
                return <PayuCreditCardForm  pspName={pspName} storeId={storeId} customerId={customerId}  secretKey={secretKey}  />
            default:
                return <CyberCreditCardForm country={secretKey} />
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


