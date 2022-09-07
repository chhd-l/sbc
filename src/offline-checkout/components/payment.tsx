import React from 'react';
import { Card, Row, Col, Modal, Button } from 'antd';

import { FormattedMessage } from 'react-intl';

const cashImg = require('./../img/cash.png');
const cardImg = require('./../img/card.png');

export default class Payment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showConfirm: false,
      paymentMethod: '',
      posTypeEnum: null,
    };
  }

  onSelectPayment = (paymentMethod: string, posTypeEnum?: string) => {
    this.setState({ showConfirm: true, paymentMethod, posTypeEnum });
  };

  onCancelPayment = () => {
    this.setState({ showConfirm: false });
  };

  onConfirmPayment = () => {
    const { onPay } = this.props;
    const { paymentMethod, posTypeEnum } = this.state;
    if (onPay) {
      onPay(paymentMethod, posTypeEnum);
      this.setState({ showConfirm: false });
    }
  };

  render() {
    const { onCancel, onPay } = this.props;
    const { paymentMethod } = this.state;

    return (
      <div>
        <div style={{ fontSize: 28, color: '#e2001a', margin: '50px 0', textAlign: 'center' }}><FormattedMessage id="Order.offline.paymentType" /></div>
        <Row gutter={32}>
          <Col span={6} offset={3} onClick={() => this.onSelectPayment('CASH')}>
            <Card bordered={false} className="text-align-center c-box">
              <div style={{ padding: '30px 0' }}><img src={cashImg} height="60" alt="" /></div>
              <span className="action-tag"><FormattedMessage id="Order.offline.cash" /></span>
            </Card>
          </Col>
          <Col span={6} onClick={() => this.onSelectPayment('ADYEN_POS')}>
            <Card bordered={false} className="text-align-center c-box">
              <div style={{ padding: '30px 0' }}><img src={cardImg} height="60" alt="" /></div>
              <span className="action-tag"><FormattedMessage id="Order.offline.creditCard" /></span>
            </Card>
          </Col>
          <Col span={6} onClick={() => this.onSelectPayment('ADYEN_POS', 'ONJ Credit card')}>
            <Card bordered={false} className="text-align-center c-box">
              <div style={{ padding: '30px 0' }}><img src={cardImg} height="60" alt="" /></div>
              <span className="action-tag"><FormattedMessage id="Order.offline.ONJcreditCard" /></span>
            </Card>
          </Col>
        </Row>
        <Row gutter={[32, 12]}>
          <Col span={12} offset={6}>
            <Button type="link" size="large" icon="left" onClick={onCancel}><FormattedMessage id="Order.Back" /></Button>
          </Col>
        </Row>
        <Modal width={300} visible={this.state.showConfirm} centered={true} footer={null} onCancel={this.onCancelPayment}>
          <div style={{ margin: '30px 0' }}>
            <Button type="primary" size="large" block onClick={this.onConfirmPayment}><FormattedMessage id="Order.btnConfirm" /></Button>
          </div>
          <div style={{ margin: '30px 0' }}>
            <Button type="default" size="large" block onClick={this.onCancelPayment}><FormattedMessage id="Order.btnCancel" /></Button>
          </div>
        </Modal>
      </div>
    );
  }
}

