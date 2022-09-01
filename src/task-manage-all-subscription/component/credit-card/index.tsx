import { cache, Const } from 'qmkit';
import React, { Component } from 'react';
import AdyenCreditCardForm from '@/credit-card/payment-type/adyen';
import PayuCreditCardForm from '@/credit-card/payment-type/payu';
import CyberCreditCardForm from '@/credit-card/payment-type/cyber';
import '@/credit-card/index.less';
import { fetchGetPayPspList, getOriginClientKeys } from '@/credit-card/webapi';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

export default class CreditCard extends Component<any> {
  props: {
    customerId: string;
    customerAccount: string;
    backToManageAllSub: Function;
  };
  constructor(props) {
    super(props);
  }
  state = {
    payPspItem: [],
    storeId: -1,
    customerId: '',
    payCode: '',
    customerAccount: '',
    clientKey: { pspItemCode: null }
  };

  async componentDidMount() {
    await this.paymentCardType();
  }
  /**
   * 获取店铺支持银行卡
   */
  async paymentCardType() {
    const customerId = this.props.customerId || '';
    const customerAccount = this.props.customerAccount || '';
    const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}');
    const { res } = await fetchGetPayPspList(storeId);
    let { payPspItemVOList } = res.context;
    if (res.code === Const.SUCCESS_CODE) {
      let payCode = payPspItemVOList[0].code;
      let list = payPspItemVOList[0]?.payPspItemCardTypeVOList ?? [];
      this.setState(
        {
          payCode,
          payPspItem: list,
          storeId,
          customerId,
          customerAccount
        },
        () => {
          this.getOriginClientKeys(payCode);
        }
      );
    }
  }
  getOriginClientKeys = (payCode) => {
    getOriginClientKeys().then(({ res }: any) => {
      const originClientKeysList = res.context.originClientKeysList;
      const item = originClientKeysList.find((item) => item.pspItemCode === payCode);
      if (!item) return;
      this.setState({
        clientKey: item || {}
      });
    });
  };

  renderCreditForm(payCode, clientKey) {
    const { customerId, storeId } = this.state;
    let d = (window as any).countryEnum[
      JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || '123457910'
    ];
    let cardType = this.payCardType(d);
    if (clientKey) {
      switch (payCode) {
        case 'adyen_credit_card':
          return (
            <AdyenCreditCardForm
              clientKey={clientKey}
              cardType={cardType}
              storeId={storeId}
              customerId={customerId}
              saveCardCallBack={() => {
                this.props.backToManageAllSub();
              }}
            />
          );
        case 'payu_ru':
        case 'payu_tu':
        case 'payu':
          return (
            <PayuCreditCardForm
              storeId={storeId}
              cardType={cardType}
              customerId={customerId}
              clientKey={clientKey}
              saveCardCallBack={() => {
                this.props.backToManageAllSub();
              }}
            />
          );
        default:
          return (
            <CyberCreditCardForm
              country={clientKey}
              saveCardCallBack={() => {
                this.props.backToManageAllSub();
              }}
            />
          );
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
    const { payCode, payPspItem, clientKey } = this.state;
    return (
      <div>
        <div className="payment-method-content">
          {payPspItem.map((item) => {
            return <img alt="" src={item.imgUrl} key={item.id} style={{ width: 40, marginRight: 10 }} />;
          })}
          {clientKey?.pspItemCode && (
            <div style={{ marginTop: 10 }}>{this.renderCreditForm(payCode, clientKey)}</div>
          )}
          <Button
            onClick={() => {
              this.props.backToManageAllSub();
            }}
            style={{ position: 'absolute', right: '100px', bottom: '140px' }}
          >
            <FormattedMessage id="PetOwner.Cancel" />
          </Button>
        </div>
      </div>
    );
  }
}
