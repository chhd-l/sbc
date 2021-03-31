import React from 'react';
import { Row, Col } from 'antd';
import { Const } from 'qmkit';
import Order from './components/order';
import Board from './components/board';
import ScanedInfo from './components/scaned-info';
import * as webapi from './webapi';
import './style.less';

export default class Checkout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: false,
      memberType: 'Guest',
      memberInfo: {},
      scanedInfoVisible: false,
      products: []
    };
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = () => {
    webapi.getProductList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          products: data.res.context.goodsInfoList || []
        });
      }
    });
  }

  onSelect = (memberInfo: any = {}, memberType: 'Member' | 'Guest' = 'Guest') => {
    this.setState({
      selected: true,
      memberType: memberType,
      memberInfo: memberInfo
    });
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="c-main-page">
        <a className="close" onClick={(e) => {e.preventDefault();onClose(false);}}><i className="iconfont iconbtn-cancelall" style={{fontSize: 30,color:'#333'}}></i></a>
        {this.state.selected ? <Order memberType={this.state.memberType} memberInfo={this.state.memberInfo} onSelectMember={this.onSelect} /> : <Board onSelect={this.onSelect} />}
        <ScanedInfo visible={this.state.scanedInfoVisible} />
      </div>
    );
  }
}
