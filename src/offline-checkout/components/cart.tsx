import React from 'react';
import { Row, Col, InputNumber, Icon, Button } from 'antd';

export default class Cart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  onPlus = (product) => {
    const { onSetQuantity } = this.props;
    onSetQuantity(product, product.quantity + 1);
  }

  onMinus = (product) => {
    const { onSetQuantity } = this.props;
    if (product.quantity > 1) {
      onSetQuantity(product, product.quantity - 1);
    }
  }

  render() {
    const { list, onRemoveProduct, onSetQuantity } = this.props;
    return (
      <>
        <div className="c-box-title">Shopping cart</div>
        <Row className="c-cart-header" type="flex" align="middle">
          <Col span={4}>Product</Col>
          <Col span={4}>Product name</Col>
          <Col span={4}>Price(10g)</Col>
          <Col span={6}>Weight</Col>
          <Col span={4}>Total price</Col>
          <Col span={2}></Col>
        </Row>
        <div className="c-cart-container">
          {list.map((cartItem, idx) => (
            <Row className="c-cart-item" key={idx} type="flex" align="middle">
              <Col span={4}><img src={cartItem.goodsImg} alt=""/></Col>
              <Col span={4}>{cartItem.goodsInfoName}</Col>
              <Col span={4}>€{cartItem.marketPrice}</Col>
              <Col span={6}>
                <div className="input-num-group">
                  <Icon type="minus-circle" onClick={() => this.onMinus(cartItem)} />
                  <InputNumber className="input-num" value={cartItem.quantity} onChange={(value) => onSetQuantity(cartItem, value)} min={0.01} step={1} precision={2} />
                  <span>kg</span>
                  <Icon type="plus-circle" onClick={() => this.onPlus(cartItem)} />
                </div>
              </Col>
              <Col span={4}>€{(cartItem.quantity * cartItem.marketPrice * 100).toFixed(2)}</Col>
              <Col span={2}>
                <Button type="link" size="large" onClick={() => onRemoveProduct(cartItem)}>
                  <i className="iconfont iconDelete"></i>
                </Button>
              </Col>
            </Row>
          ))}
        </div>
        <div className="c-box-footer" style={{textAlign: 'right', lineHeight: '40px', fontSize: 16, fontWeight: 'bold'}}>
          <span style={{marginRight: 20}}>No. of products: {list.length}</span>
          <span>Total weight: {list.map(p => p.quantity).reduce((a, b) => a + b, 0)}kg</span>
        </div>
      </>
    );
  }
}
