import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const, noop } from 'qmkit';
import {Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch, Input, Select} from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
const FormItem = Form.Item;
import { Relax, StoreProvider } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';

const formItemLayout = {
  labelCol: {
    span: 8
    // xs: { span: 24 },
    // sm: { span: 6 }
  },
  wrapperCol: {
    span: 16
    // xs: { span: 24 },
    // sm: { span: 14 }
  }
};
@Relax
export default class PaymentList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }
  props: {
    relaxProps?: {
      storePaymentVOs: any;
      onFormChange: Function;
    };
  };

  static relaxProps = {
    storePaymentVOs: 'storePaymentVOs',
    onFormChange: noop,
  };
  componentDidMount() {}



  render() {
    const { storePaymentVOs } = this.props.relaxProps;
    console.log(storePaymentVOs, 'storePaymentVOs--------------');
    return (
      <div>
        {
          storePaymentVOs &&
          <div>
            <div className="method">
              {storePaymentVOs.get('onlinePaymentMethodList') && (
                <div className="method-title flex-start-align">
                  <span></span>
                  <span>Online payment</span>
                  <span>Set in payment method model</span>
                </div>
              )}
              <div className="method-list flex-start-align">
                {storePaymentVOs.get('onlinePaymentMethodList') &&
                storePaymentVOs.get('onlinePaymentMethodList').map((item, index) => {
                  return (
                    <Row>
                      <Col span={8}>
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
                            <div className="status">{item.name}</div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>

            <div className="method">
              {storePaymentVOs.get('offlinePaymentMethodList') && (
                <div className="method-title flex-start-align">
                  <span></span>
                  <span>Offline payment</span>
                </div>
              )}
              <div className="flex-start-align">
                {storePaymentVOs.get('offlinePaymentMethodList') &&
                storePaymentVOs.get('offlinePaymentMethodList').map((item, index) => {
                  return (
                    <Row>
                      <Col span={8}>
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
                            <div className="status">{item.name}</div>

                            <div className={'flex-start-align'}>
                              <Switch style={{ marginRight: 15 }} />
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>

            <div className="method">
              {storePaymentVOs.get('codPaymentMethodList') && (
                <div className="method-title flex-start-align">
                  <span></span>
                  <span>COD</span>
                </div>
              )}
              <div className="flex-start-align">
                {storePaymentVOs.get('codPaymentMethodList') &&
                storePaymentVOs.get('codPaymentMethodList').map((item, index) => {
                  return (
                    <Row key={item.id} >
                      <Col span={8}>
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
                          {/*<div className="bar">*/}
                          {/*  <div className="status">{item.name}</div>*/}

                          {/*  <div className={'flex-start-align'}>*/}
                          {/*    <Switch style={{ marginRight: 15 }} onChange={e=>this.onSwitchChange(e,item.id)} />*/}
                          {/*    <Tooltip placement="top" title="Edit">*/}
                          {/*      /!*<a style={{ color: this.state.isChecked == true ? 'red' : '#cccccc' }} type="link" onClick={this.onTooltip} className="iconfont iconEdit"></a>\*!/*/}
                          {/*      <a  type="link" onClick={()=>this.onTooltip(this,item.id,item.maxAmount)} className="iconfont iconEdit"></a>*/}

                          {/*    </Tooltip>*/}
                          {/*  </div>*/}
                          {/*</div>*/}
                        </Card>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
