import React from 'react';
import { Row, Col, Card } from 'antd';

const guestImg = require('../img/guest.png');
const memberImg = require('../img/member.png');
const qrImg = require('../img/qrcode.png');

export default class MemberBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Row type="flex" justify="space-between" align="middle" style={{marginTop: 34}}>
        <Col span={4} style={{fontWeight: 'bold'}}>Consumer information</Col>
        <Col span={4}>
          <Card className="text-align-center" bodyStyle={{padding: '10px'}}>
            <div><img src={guestImg} width="35" height="40" alt=""/></div>
            <span className="action-tag small">Guest</span>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="text-align-center" bodyStyle={{padding: '10px'}}>
            <div><img src={memberImg} width="35" height="40" alt=""/></div>
            <span className="action-tag small">Member</span>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="text-align-center" bodyStyle={{padding: '10px'}}>
            <div><img src={qrImg} width="40" height="40" alt=""/></div>
            <span className="action-tag small">Recommendation</span>
          </Card>
        </Col>
      </Row>
    );
  }
}
