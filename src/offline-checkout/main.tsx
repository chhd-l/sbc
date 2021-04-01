import React from 'react';
import { Icon } from 'antd';
import { Const } from 'qmkit';
import Order from './components/order';
import Board from './components/board';
import ScanedInfo from './components/scaned-info';
import Payment from './components/payment';
import Result from './components/result';
import * as webapi from './webapi';
import './style.less';

export default class Checkout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      step: 1,
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
    this.setState({ loading: true });
    webapi.getProductList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          products: data.res.context.goodsInfoList.map(goods => ({goodsId: goods.goodsId, goodsInfoName: goods.goodsInfoName, goodsInfoBarcode: goods.goodsInfoBarcode, goodsImg: goods.goods.goodsImg, marketPrice: goods.marketPrice}))
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  onSelect = (memberInfo: any = {}, memberType: 'Member' | 'Guest' = 'Guest') => {
    this.setState({
      step: 2,
      memberType: memberType,
      memberInfo: memberInfo
    });
  }

  onAddProduct = (product: any) => {
    const { list } = this.state;
    if (list.findIndex(p => p.goodsId === product.goodsId) === -1) {
      list.push({
        ...product,
        quantity: 1
      });
      this.setState({ list });
    }
  }

  onRemoveProduct = (product: any) => {
    const { list } = this.state;
    const pIdx = list.findIndex(p => p.goodsId === product.goodsId);
    if (pIdx > -1) {
      list.splice(pIdx, 1);
    }
    this.setState({ list });
  }

  onSetProductQty = (product: any, qty: number) => {
    const { list } = this.state;
    const targetProduct = list.find(p => p.goodsId === product.goodsId);
    if (targetProduct) {
      targetProduct.quantity = qty;
    }
    this.setState({ list });
  }

  onClearCart = () => {
    this.setState({ list: [] });
  }

  onCheckout = () => {
    this.switchStep(3);
  }

  switchStep = (step: number) => {
    this.setState({ step });
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className={`c-main-page ${this.state.loading ? 'loading' : ''}`}>
        <a className="close" onClick={(e) => {e.preventDefault();onClose(false);}}><Icon type="close" style={{fontSize: 20,color:'#666'}} /></a>
        {this.state.step === 1
          ? <Board onSelect={this.onSelect} />
          : this.state.step === 2 
            ? <Order
                memberType={this.state.memberType}
                memberInfo={this.state.memberInfo}
                onSelectMember={this.onSelect}
                products={this.state.products}
                list={this.state.list}
                onAddProduct={this.onAddProduct}
                onRemoveProduct={this.onRemoveProduct}
                onSetQuantity={this.onSetProductQty}
                onClear={this.onClearCart}
                onCheckout={this.onCheckout}
              />
            : this.state.step === 3 
              ? <Payment onCancel={() => this.switchStep(2)} /> 
              : <Result />}
        <ScanedInfo visible={this.state.scanedInfoVisible} />
      </div>
    );
  }
}
