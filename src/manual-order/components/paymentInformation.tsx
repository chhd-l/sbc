import { Button, Icon } from 'antd';
import { cache, history } from 'qmkit';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class PaymentInformation extends React.Component<any, any> {
  state = {
    status: false,
  };
  constructor(props) {
    super(props);
  }

  renderStatus(status, customer,context) {
    if (status === 1) {
      return (
        <h2>
          <FormattedMessage id="Order.checkout" />
          <br />
          <FormattedMessage id="Order.open" />&nbsp;
          <span onClick={() => this.props.turnShowPage('other')} style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }}>
          <FormattedMessage id="Order.here" />
          </span>
        </h2>
      );
    } else if (status === 2) {
      return <h2><FormattedMessage id="Order.failure" /> {customer.customerAccount}</h2>;
    } else {
      return <h2>{['PAYING','PAID'].indexOf(context?.trade?.tradeState?.payState)>-1?<FormattedMessage id="Order.successfully" />:<FormattedMessage id="Order.failure" /> } {customer.customerAccount}
        <p style={{marginTop:10}}><FormattedMessage id="Order.number" />/<FormattedMessage id="Order.PaymentReference" />: <a> {context?.tid??''}</a></p>
        {/* 法国代客下单moto支付 */}
        <p style={{marginTop:10}}><FormattedMessage id="Order.Currency" />/<FormattedMessage id="Order.Amount" />: <a> {context?.trade?.supplier?.currency??''}{context?.trade?.tradePrice?.totalPrice??''}</a></p>
        <p style={{marginTop:10}}><FormattedMessage id="Order.ShopReference" />: <a> {context?.trade?.buyer?.id??''}</a></p>
        <p style={{marginTop:10}}><FormattedMessage id="Order.CountryCode" />: <a> {context?.trade?.consignee?.country??''}</a></p>
        {/* Save for recurring transactions (mandatory for subscriptions) */}
        <p style={{marginTop:10}}><FormattedMessage id="Order.transactions" /></p>
        {context?.subscribeId&&<p style={{marginTop:10}}><FormattedMessage id="Order.subscriptionNumber" />: <a>{context?.subscribeId??''}</a></p>}
      </h2>;
    }
  }
  // 打开一个跳转到adyen支付平台的窗口
  next(e){
    e.preventDefault();
    console.log('打开了adyen支付平台窗口');
    let winObj = window.open(
      `https://callcenter-test.adyen.com/callcenter/action/login.shtml`,
      'newwindow',
      'height=800, width=1200, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
    );
    let loop = setInterval(async () => {
      if (winObj.closed) {
        clearInterval(loop);
        console.log('adyen支付窗口关闭了');
        // const { res } = guest? await getGuestOrderResponse(storeId, guestId):await queryOrderStatus(customer.customerId, token);
        // if (res.code === Const.SUCCESS_CODE) {
        //   let d = {
        //     string: 1,
        //     boolean: 2,
        //     object: 3
        //   };
        //   let status = d[typeof res.context];
        //   this.setState({
        //     status,
        //     context: status === 3 ? res.context : null
        //   });
        // } else {
        //   this.setState({
        //     status: 2
        //   });
        // }
      }
    }, 500);
  }

  render() {
    const { stepName, noLanguageSelect, status, customer,context } = this.props;
    const isFgs = sessionStorage.getItem('user-group-value')?.toLowerCase() == 'fgs';
    return (
      <div>
        <h3>
          <FormattedMessage id={`Order.${noLanguageSelect ? 'Step2' : 'Step3'}`} />
        </h3>
        <h4>
          <FormattedMessage id={`Order.${stepName}`} />
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction" style={{textAlign:'center', paddingTop: 20 }}>
          <div>
          {this.renderStatus(status, customer,context)}
          {/* fgs下单时需要next按钮去到adyen支付平台，暂时用status来控制按钮，后面调试接口时根据参数替换掉 */}
          {isFgs && status===3  && (<Button disabled={status!==3} type="primary" onClick={(e) => this.next(e)} style={{ marginRight: 20 }}>
                <FormattedMessage id="Order.Next step" /> <Icon type="right" />
              </Button>)}
          {/* 如果是fgs下单，back按钮是否出现 */}
          {status !== 1 && (
            <Button
              style={{ marginTop: 20 }}
              type="primary"
              onClick={(e) => {
                history.push('/order-add');
              }}
            >
              <FormattedMessage id="Order.Back" />
            </Button>
          )}
          </div>
        </div>
      </div>
    );
  }
}
