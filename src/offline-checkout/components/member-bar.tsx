import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { QRScaner } from 'qmkit';
import GuestForm from './guest-form';
import CustomerList from '../../appointment-list/components/customer-list';

import { FormattedMessage } from 'react-intl';

const guestImg = require('../img/guest.png');
const memberImg = require('../img/member.png');
const qrImg = require('../img/qrcode.png');

export default class MemberBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      guestFormVisible: false,
      memberFormVisible: false
    };
  }

  onOpenGuestForm = () => {
    this.setState({ guestFormVisible: true });
  };

  onConfirmGuestInfo = (guestInfo: any = {}) => {
    this.setState({
      guestFormVisible: false
    });
    this.props.onChange({ ...this.props.memberInfo, ...guestInfo }, 'Guest');
  };

  onOpenMemberForm = () => {
    this.setState({ memberFormVisible: true });
  };

  onConfirmMemberInfo = (memberInfo: any = {}) => {
    this.setState({
      memberFormVisible: false
    });
    this.props.onChange({ ...this.props.memberInfo, ...memberInfo }, 'Member');
  };

  onReset = () => {
    this.props.onChange({});
  };

  render() {
    const { memberType, memberInfo, onScanEnd } = this.props;
    return (
      <>
        {memberInfo.customerName && <Button type="link" onClick={() => this.onReset()} className="member-reset-link"><FormattedMessage id="Order.offline.Reset" /></Button>}
        {!memberInfo.customerName ? <Row type="flex" justify="space-between" align="middle" style={{marginTop: 34}}>
          <Col span={4} style={{fontWeight: 'bold'}}><FormattedMessage id="Order.offline.consumerInformation" /></Col>
          <Col span={4}>
            <Card className="text-align-center" bodyStyle={{padding: '10px'}} onClick={() => this.onOpenGuestForm()}>
              <div><img src={guestImg} width="35" height="40" alt=""/></div>
              <span className="action-tag small"><FormattedMessage id="Order.offline.Guest" /></span>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="text-align-center" bodyStyle={{padding: '10px'}} onClick={() => this.onOpenMemberForm()}>
              <div><img src={memberImg} width="35" height="40" alt=""/></div>
              <span className="action-tag small"><FormattedMessage id="Order.offline.Member" /></span>
            </Card>
          </Col>
          <Col span={4}>
            <QRScaner id="innerscaner" onScanEnd={onScanEnd}>
              <Card className="text-align-center" bodyStyle={{padding: '10px'}}>
                <div><img src={qrImg} width="40" height="40" alt=""/></div>
                <span className="action-tag small"><FormattedMessage id="Order.offline.recommendation" /></span>
              </Card>
            </QRScaner>
          </Col>
        </Row> : <Row gutter={24} style={{marginTop: 34, fontWeight: 'bold'}}>
          <Col span={12}><FormattedMessage id="Order.offline.petOwnerType" />: <FormattedMessage id={`Order.offline.${memberType}`} /></Col>
          <Col span={12}><FormattedMessage id="Order.Email" />: {memberInfo.email}</Col>
          <Col span={12}><FormattedMessage id="Order.offline.consumerName" />: {memberInfo.customerName}</Col>
          <Col span={12}><FormattedMessage id="Order.offline.consumerPhone" />: {memberInfo.contactPhone}</Col>
        </Row>}
        <GuestForm visible={this.state.guestFormVisible} onClose={this.onConfirmGuestInfo} />
        <CustomerList visible={this.state.memberFormVisible} onConfirm={this.onConfirmMemberInfo} onClose={this.onConfirmMemberInfo} />
      </>
    );
  }
}
