import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import styled from 'styled-components';
import PaymentModel from './components/payment-modal';
import MethodTips from './components/methodTips';

import './style.less';

export default class PaymentSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentVisible: false,
      switchVisible: false,
      enabled: true,
      paymentForm: {}, //edit
      paymentList: []
    };
    this.closeModel = this.closeModel.bind(this);
  }
  componentDidMount() {
    this.getPaymentSetting();
  }
  getPaymentSetting = async () => {
    const { res } = await webapi.getPaymentSetting();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        paymentList: res.context.payGatewayVOList
      });
    }
  };

  closeModel = () => {
    this.setState({
      paymentVisible: false
    });
  };

  onSwitchChange = () => {
    console.log(111111111111);
    this.setState({
      switchVisible: true
    });
  };

  reflash() {
    this.getPaymentSetting();
  }
  render() {
    const { paymentList } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search" style={{ height: '100vh', background: '#fff' }}>
          <Headline title="Payment method" />
          <div className="method">
            <div className="method-title flex-start-align">
              <span></span>
              <span>Online payment</span>
              <span>Set in payment method model</span>
            </div>
            <Row>
              {paymentList &&
                paymentList.map((item, index) => (
                  <Col span={8} key={index}>
                    <Card style={{ width: 300, margin: 20 }} bodyStyle={{ padding: 10 }}>
                      <div className="methodItem">
                        <img
                          src={item.imgUrl}
                          style={{
                            width: '150px',
                            height: '80px',
                            marginTop: '10px'
                          }}
                        />
                      </div>
                      <div className="bar">
                        <div className="status">{item.isOpen === 1 ? 'Enabled' : 'Disabled'}</div>

                        <div className={'flex-start-align'}>
                          <Switch style={{ marginRight: 15 }} onChange={this.onSwitchChange} />
                          <Tooltip placement="top" title="Edit">
                            <a
                              style={{ color: 'red' }}
                              type="link"
                              onClick={() => {
                                this.setState({
                                  paymentVisible: true,
                                  paymentForm: item
                                });
                              }}
                              /* className="links"*/
                              className="iconfont iconEdit"
                            >
                              {/* <FormattedMessage id="edit" />*/}
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>

          <PaymentModel paymentForm={this.state.paymentForm} visible={this.state.paymentVisible} parent={this} reflash={() => this.reflash()} />
          <MethodTips visible={this.state.switchVisible} parent={this} reflash={() => this.reflash()} />
        </div>
      </div>
    );
  }
}
