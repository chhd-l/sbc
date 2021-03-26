import React from 'react';
import { Row, Col, Card } from 'antd';
import GuestForm from './guest-form';
import CustomerList from '../../appointment-list/components/customer-list';

const guestImg = require('../img/guest.png');
const memberImg = require('../img/member.png');
const qrImg = require('../img/qrcode.png');

export default class MemberBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      memberType: 'Guest',
      guestFormVisible: false,
      memberFormVisible: false,
      memberInfo: {}
    };
  }

  onOpenGuestForm = () => {
    this.setState({ guestFormVisible: true });
  };

  onConfirmGuestInfo = (guestInfo: any = {}) => {
    this.setState({
      memberType: 'Guest',
      guestFormVisible: false,
      memberInfo: {
        ...this.state.memberInfo,
        ...guestInfo
      }
    });
  };

  onOpenMemberForm = () => {
    this.setState({ memberFormVisible: true });
  };

  onConfirmMemberInfo = (memberInfo: any = {}) => {
    this.setState({
      memberType: 'Member',
      memberFormVisible: false,
      memberInfo: {
        ...this.state.memberInfo,
        ...memberInfo
      }
    });
  };

  onReset = () => {
    this.setState({
      memberInfo: {}
    });
  };

  render() {
    return (
      <>
        {this.state.memberInfo.customerName && <a onClick={(e) => {e.preventDefault();this.onReset();}} className="member-reset-link">Reset</a>}
        {!this.state.memberInfo.customerName ? <Row type="flex" justify="space-between" align="middle" style={{marginTop: 34}}>
          <Col span={4} style={{fontWeight: 'bold'}}>Consumer information</Col>
          <Col span={4}>
            <Card className="text-align-center" bodyStyle={{padding: '10px'}} onClick={() => this.onOpenGuestForm()}>
              <div><img src={guestImg} width="35" height="40" alt=""/></div>
              <span className="action-tag small">Guest</span>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="text-align-center" bodyStyle={{padding: '10px'}} onClick={() => this.onOpenMemberForm()}>
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
        </Row> : <Row gutter={24} style={{marginTop: 20}}>
          <Col span={12}>Consumer type: {this.state.memberType}</Col>
          <Col span={12}>Email: {this.state.memberInfo.email}</Col>
          <Col span={12}>Consumer name: {this.state.memberInfo.customerName}</Col>
          <Col span={12}>Phone: {this.state.memberInfo.contactPhone}</Col>
        </Row>}
        <GuestForm visible={this.state.guestFormVisible} onClose={this.onConfirmGuestInfo} />
        <CustomerList visible={this.state.memberFormVisible} onConfirm={this.onConfirmMemberInfo} onClose={this.onConfirmMemberInfo} />
      </>
    );
  }
}
