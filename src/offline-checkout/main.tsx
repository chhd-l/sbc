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
      products: [],
      list: []
    };
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = () => {
    webapi.getProductList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          products: data.res.context.goodsInfoList.map(goods => ({goodsId: goods.goodsId, goodsInfoName: goods.goodsInfoName, goodsInfoBarcode: goods.goodsInfoBarcode, goodsImg: goods.goods.goodsImg, marketPrice: goods.marketPrice}))
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

  onAddProduct = (product: any) => {
    const { list } = this.state;
    if (list.findIndex(p => p.goodsId === product.goodsId) === -1) {
      list.push(product);
      this.setState({ list });
    }
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="c-main-page">
        <a className="close" onClick={(e) => {e.preventDefault();onClose(false);}}><i className="iconfont iconbtn-cancelall" style={{fontSize: 30,color:'#333'}}></i></a>
        {this.state.selected
          ? <Order
              memberType={this.state.memberType}
              memberInfo={this.state.memberInfo}
              onSelectMember={this.onSelect}
              products={this.state.products}
              list={this.state.list}
              onAddProduct={this.onAddProduct}
            />
          : <Board onSelect={this.onSelect} />}
        <ScanedInfo visible={this.state.scanedInfoVisible} />
      </div>
    );
  }
}
