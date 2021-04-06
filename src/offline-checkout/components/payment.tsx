import React from 'react';
import { Card, Row, Col, Modal, Button } from 'antd';

const cashImg = require('./../img/cash.png');
const cardImg = require('./../img/card.png');

export default class Payment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showConfirm: false,
      paymentMethod: ''
    };
  }

  onSelectPayment = (paymentMethod: string) => {
    this.setState({ showConfirm: true, paymentMethod });
  };

  onCancelPayment = () => {
    this.setState({ showConfirm: false });
  };

  render() {
    const { onCancel, onPay } = this.props;
    const { paymentMethod } = this.state;

    return (
      <div>
        <div style={{fontSize: 28, color: '#e2001a', margin: '50px 0', textAlign: 'center'}}>Payment type</div>
        <Row gutter={32}>
          <Col span={6} offset={6} onClick={() => this.onSelectPayment('CASH')}>
            <Card bordered={false} className="text-align-center c-box">
              <div style={{padding:'30px 0'}}><img src={cashImg} height="60" alt=""/></div>
              <span className="action-tag">Cash</span>
            </Card>
          </Col>
          <Col span={6} onClick={() => this.onSelectPayment('ADYEN_POS')}>
            <Card bordered={false} className="text-align-center c-box">
              <div style={{padding:'30px 0'}}><img src={cardImg} height="60" alt=""/></div>
              <span className="action-tag">Credit card</span>
            </Card>
          </Col>
        </Row>
        <Row gutter={[32, 12]}>
          <Col span={12} offset={6}>
            <Button type="link" size="large" icon="left" onClick={onCancel}>Back</Button>
          </Col>
        </Row>
        <Modal width={300} visible={this.state.showConfirm} centered={true} footer={null} onCancel={this.onCancelPayment}>
          <div style={{margin: '30px 0'}}>
            <Button type="primary" size="large" block onClick={() => onPay(paymentMethod)}>Confirm</Button>
          </div>
          <div style={{margin: '30px 0'}}>
            <Button type="default" size="large" block onClick={this.onCancelPayment}>Cancel</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

