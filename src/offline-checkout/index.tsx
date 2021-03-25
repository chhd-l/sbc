import React from 'react';
import { Breadcrumb } from 'antd';
import Checkout from './main';

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
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>Check-out</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{minHeight: 520, textAlign: 'center'}}>
          <a onClick={(e) => {e.preventDefault();this.onShow(true);}} style={{display: 'inline-block', marginTop: 80, marginBottom: 20}}>
            <i className="iconfont iconpos" style={{fontSize: 64}}></i>
          </a>
          <div style={{fontSize:16,fontWeight:'bold'}}>POS</div>
        </div>
        {this.state.show && <Checkout onClose={this.onShow} />}
      </div>
    );
  }
}
