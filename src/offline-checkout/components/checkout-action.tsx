import React from 'react';
import { Button, Divider, Row, Col } from 'antd';

export default class CheckoutAction extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div style={{fontSize: 22, lineHeight: '80px', fontWeight: 'bold'}}>
          <span style={{marginRight: 10}}>Subtotal:</span>
          <span style={{color: '#e2001a'}}>€67</span>
        </div>
        <Divider style={{margin: '0 0 15px'}} />
        <Row gutter={24}>
          <Col span={12}>
            <Button type="primary" size="large" block>Clean up</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" size="large" block>Checkout</Button>
          </Col>
        </Row>
      </>
    );
  }
}
