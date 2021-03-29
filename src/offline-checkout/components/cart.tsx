import React from 'react';
import { Row, Col, InputNumber, Icon } from 'antd';

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
        <div className="c-cart-container">
          <Row className="c-cart-item">
            <Col span={4}><img src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202008030949305851.png" alt=""/></Col>
            <Col span={4}>Puppy LATA</Col>
            <Col span={4}>€32</Col>
            <Col span={4}>
              <div className="input-num-group">
                <Icon type="minus-circle" />
                <InputNumber className="input-num" min={0.01} step={1} precision={2} />
                <span>kg</span>
                <Icon type="plus-circle" />
              </div>
            </Col>
            <Col span={4}>€54</Col>
            <Col span={4}><i className="iconfont iconDelete"></i></Col>
          </Row>
        </div>
        <div className="c-box-footer" style={{textAlign: 'right', lineHeight: '40px', fontSize: 16, fontWeight: 'bold'}}>
          <span style={{marginRight: 20}}>No. of products: 4</span>
          <span>total weight: 10kg</span>
        </div>
      </>
    );
  }
}
