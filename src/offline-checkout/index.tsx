import React from 'react';
import { Breadcrumb } from 'antd';
import { AuthWrapper } from 'qmkit';
import Checkout from './main';
import { FormattedMessage } from 'react-intl';

export default class OfflineCheckOut extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false
    };
  }

  onShow = (show: boolean) => {
    this.setState({ show });
  }

  render() {
    return (
      <AuthWrapper functionName="f_offline_checkout">
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/order-list"><FormattedMessage id="Menu.Order" /></a>
            </Breadcrumb.Item>
            <Breadcrumb.Item><FormattedMessage id="Order.offline.checkout" /></Breadcrumb.Item>
          </Breadcrumb>
          <div className="container" style={{minHeight: 520, textAlign: 'center'}}>
            <a onClick={(e) => {e.preventDefault();this.onShow(true);}} style={{display: 'inline-block', marginTop: 80, marginBottom: 20, padding:'20px 40px',border:'1px solid #e8e8e8'}}>
              <i className="iconfont iconpos" style={{fontSize: 64}}></i>
            </a>
            <div style={{fontSize:16,fontWeight:'bold'}}><FormattedMessage id="Order.POS" /></div>
          </div>
          {this.state.show && <Checkout onClose={this.onShow} />}
        </div>
      </AuthWrapper>
    );
  }
}
