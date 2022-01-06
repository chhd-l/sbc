import React from 'react';
import { QRScaner } from 'qmkit';
import { Card, Row, Col } from 'antd';

import { FormattedMessage } from 'react-intl';

const pcImg = require('./../img/pc.png');
const qrImg = require('./../img/qrcode.png');

export default class Board extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { onSelect, onScanEnd } = this.props;

    return (
      <div>
        <div style={{fontSize: 28, color: '#e2001a', margin: '50px 0', textAlign: 'center'}}><FormattedMessage id="Order.offline.felin" /></div>
        <Row gutter={32}>
          <Col span={24}>
            <Card bordered={false} className="text-align-center c-box" onClick={() => onSelect()} style={{width:350,margin:'0 auto'}}>
              <div><img src={pcImg} width="120" height="120" alt=""/></div>
              <span className="action-tag"><FormattedMessage id="Order.offline.directCheckout" /></span>
            </Card>
          </Col>
          {/* <Col span={6}>
            <QRScaner id="rscan" onScanEnd={onScanEnd}>
              <Card bordered={false} className="text-align-center c-box">
                <div><img src={qrImg} width="120" height="120" alt=""/></div>
                <span className="action-tag"><FormattedMessage id="Order.offline.recommendation" /></span>
              </Card>
            </QRScaner>
          </Col> */}
        </Row>
      </div>
    );
  }
}
