import React from 'react';
import { Row, Col } from 'antd';

export default class Cart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="c-box-title">Shopping cart</div>
        <Row className="c-cart-header">
          <Col span={4}>Product</Col>
          <Col span={4}>Product name</Col>
          <Col span={4}>Price</Col>
          <Col span={4}>Weight</Col>
          <Col span={4}>Total price</Col>
          <Col span={4}>Operation</Col>
        </Row>
        <div className="c-cart-container"></div>
        <div className="c-box-footer" style={{textAlign: 'right', lineHeight: '40px', fontSize: 16, fontWeight: 'bold'}}>
          <span style={{marginRight: 20}}>No. of products: 4</span>
          <span>total weight: 10kg</span>
        </div>
      </>
    );
  }
}
