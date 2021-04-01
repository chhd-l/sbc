import React from 'react';
import { Button, Divider, Row, Col } from 'antd';

export default class CheckoutAction extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { list, onClear, onCheckout } = this.props;
    return (
      <>
        <div style={{fontSize: 22, lineHeight: '80px', fontWeight: 'bold'}}>
          <span style={{marginRight: 10}}>Subtotal:</span>
          <span style={{color: '#e2001a'}}>€{list.reduce((a, b) => a + Number((b.marketPrice * b.quantity * 100).toFixed(2)), 0)}</span>
        </div>
        <Divider style={{margin: '0 0 15px'}} />
        <Row gutter={24}>
          <Col span={12}>
            <Button type="primary" size="large" block onClick={onClear}>Clean up</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" size="large" block disabled={list.length === 0} onClick={onCheckout}>Checkout</Button>
          </Col>
        </Row>
      </>
    );
  }
}
