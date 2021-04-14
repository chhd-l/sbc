import React from 'react';
import { Icon, Modal } from 'antd';
import { Const } from 'qmkit';
import Order from './components/order';
import Board from './components/board';
import ScanedInfo from './components/scaned-info';
import Payment from './components/payment';
import Result from './components/result';
import * as webapi from './webapi';
import './style.less';

import { FormattedMessage, injectIntl } from 'react-intl';

class Checkout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      step: 1,
      memberType: 'Guest',
      memberInfo: {},
      scanedInfoVisible: false,
      scanedInfo: {},
      products: [],
      list: [],
      consents: [],
      selectedConsents: [],
      orderId: ''
    };
  }

  componentDidMount() {
    this.getAllProducts();
    webapi.getConsent().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          consents: (data.res.context.requiredList.map(ct => ({...ct, required: true}))).concat(data.res.context.optionalList.map(ct => ({...ct,required:false}))),
          selectedConsents: data.res.context.requiredList.map(ct => ct.id)
        });
      }
    });
  }

  getAllProducts = () => {
    this.setState({ loading: true });
    webapi.getProductList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          products: data.res.context.goodsInfoList.map(goods => ({
            goodsId: goods.goodsId,
            goodsInfoId: goods.goodsInfoId,
            goodsInfoNo: goods.goodsInfoNo,
            goodsInfoName: goods.goodsInfoName,
            goodsInfoBarcode: goods.goodsInfoBarcode,
            goodsImg: goods.goods.goodsImg,
            marketPrice: goods.marketPrice
          }))
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

  onScanMember = (code: string) => {
    this.setState({ loading: true });
    webapi.findAppointmentByAppointmentNo(code).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        const { products } = this.state;
        const { felinReco, settingVO } = data.res.context;
        let recoProducts = [];
        if (felinReco && felinReco.goodsIds) {
          const goodsInfoNos = JSON.parse(felinReco.goodsIds);
          goodsInfoNos.forEach(item => {
            const targetProduct = products.find(p => p.goodsInfoNo === item.goodsInfoNo);
            if (targetProduct) {
              recoProducts.push({ ...targetProduct, quantity: item.quantity / 100 });
            }
          });
        }
        this.setState({
          loading: false,
          scanedInfoVisible: true,
          scanedInfo: {
            memberType: settingVO.customerId ? 'Member' : 'Guest',
            customerId: settingVO.customerId,
            customerName: settingVO.consumerName,
            contactPhone: settingVO.consumerPhone,
            email: settingVO.consumerEmail,
            felinRecoId: felinReco ? felinReco.felinRecoId : '',
            status: settingVO.status,
            apptDate: settingVO.apptDate,
            apptTime: settingVO.apptTime,
            products: recoProducts
          }
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  onConfirmScanedInfo = () => {
    const { memberType, products, ...rest } = this.state.scanedInfo;
    this.setState({
      step: 2,
      scanedInfoVisible: false,
      memberType: memberType,
      memberInfo: {
        ...rest
      },
      list: products.length ? products : this.state.list
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
    if (this.state.memberInfo.customerName) {
      this.switchStep(3);
    } else {
      const alertTitle = (window as any).RCi18n({id:'Order.offline.noCustomerAlert'});
      const okText = (window as any).RCi18n({id:'Order.OK'});
      Modal.warning({ title: alertTitle, okText: okText, centered: true });
    }
  }

  switchStep = (step: number) => {
    this.setState({ step });
  }

  onConfirmCheckout = (paymentMethod: string) => {
    const { memberInfo: { customerId, customerName, contactPhone, email }, list } = this.state;
    const params = {
      customerId,
      customerName,
      contactPhone,
      email,
      orderPrice: +(list.reduce((a, b) => a + (b.marketPrice * 100 * b.quantity * 100), 0) / 100).toFixed(2),
      payPspItemEnum: paymentMethod,
      tradeItems: list.map(p => ({ skuId: p.goodsInfoId, num: p.quantity }))
    };
    this.setState({ loading: true });
    webapi.checkout(params).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        const context = data.res.context;
        if (context && context.trade && context.trade.tradeState && context.trade.tradeState.payState && context.trade.tradeState.payState === 'PAID') {
          this.setState({
            orderId: data.res.context.tid,
            step: 4,
            loading: false
          });
          this.submitCustomerConsent();
        } else if (context.tid) {
          this.setState({
            orderId: context.tid,
            loading: false
          }, this.showQueryModal);
          this.submitCustomerConsent();
        } else {
          this.setState({
            loading: false
          }, () => {
            const alertTitle = (window as any).RCi18n({id:'Order.offline.orderNotSuccess'});
            const alertContent = (window as any).RCi18n({id:'Order.offline.retryAlert'});
            const okText = (window as any).RCi18n({id:'Order.OK'});
            Modal.warning({ title: alertTitle, content: alertContent, okText: okText, centered: true });
          });
        }
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  showQueryModal = () => {
    const infoTitle = (window as any).RCi18n({id:'Order.offline.queryStateTitle'});
    const infoContent = (window as any).RCi18n({id:'Order.offline.queryStateContent'});
    const okText = (window as any).RCi18n({id:'Order.offline.yes'});
    const noText = (window as any).RCi18n({id:'Order.offline.no'});
    Modal.confirm({ title: infoTitle, content: infoContent, okText: okText, cancelText: noText, centered: true, onOk: this.queryOrderStatus, onCancel: () => {} });
  }

  queryOrderStatus = () => {
    const { orderId } = this.state;
    this.setState({ loading: true });
    webapi.queryStatus({
      tidList: [orderId]
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          step: 4,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        }, this.showQueryModal);
      }
    }).catch(() => {
      this.setState({
        loading: false
      }, this.showQueryModal);
    });
  };

  refillOrder = (refill: boolean) => {
    const { orderId } = this.state;
    const { onClose } = this.props;
    this.setState({ loading: true });
    webapi.refillOrder(orderId, refill).then(data => {
      if (data.res.code === Const.SUCCESS_CODE && onClose) {
        onClose(false);
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => {
      this.setState({ loading: false });
    });
  };

  onSelectConsent = (consents) => {
    this.setState({
      selectedConsents: consents
    });
  }

  submitCustomerConsent = () => {
    const { memberType, memberInfo, consents, selectedConsents } = this.state;
    if (memberType === 'Member') {
      webapi.setConsent(memberInfo.customerId, {
        requiredList: consents.filter(ct => ct.required).map(ct => ({id:ct.id,selectedFlag:true})),
        optionalList: consents.filter(ct => !ct.required).map(c => ({
          id: c.id,
          selectedFlag: selectedConsents.indexOf(c.id) > -1
        }))
      });
    }
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className={`c-main-page ${this.state.loading ? 'loading' : ''}`}>
        <a className="close" onClick={(e) => {e.preventDefault();onClose(false);}}><Icon type="close" style={{fontSize: 20,color:'#666'}} /></a>
        {this.state.step === 1
          ? <Board onSelect={this.onSelect} onScanEnd={this.onScanMember} />
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
                onScanEnd={this.onScanMember}
                consents={this.state.consents}
                selectedConsents={this.state.selectedConsents}
                onSelectConsent={this.onSelectConsent}
              />
            : this.state.step === 3 
              ? <Payment onCancel={() => this.switchStep(2)} onPay={this.onConfirmCheckout} /> 
              : <Result onRefill={this.refillOrder} onClose={() => onClose(false)} />}
        <ScanedInfo visible={this.state.scanedInfoVisible} scanedInfo={this.state.scanedInfo} onChoose={this.onConfirmScanedInfo} />
      </div>
    );
  }
}

export default injectIntl(Checkout);
