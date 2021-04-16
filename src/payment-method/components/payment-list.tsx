import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const, noop } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch, Input, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
const FormItem = Form.Item;
import { Relax, StoreProvider } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';
import nodataImg from '/web_modules/qmkit/images/sys/no-data.jpg';
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
      loading: boolean;
      onFormChange: Function;
    };
  };

  static relaxProps = {
    storePaymentVOs: 'storePaymentVOs',
    loading: 'loading',
    onFormChange: noop,
  };
  componentDidMount() {}



  render() {
    const { storePaymentVOs, loading } = this.props.relaxProps;
    const nodata = (!storePaymentVOs.get('onlinePaymentMethodList') || storePaymentVOs.get('onlinePaymentMethodList').size ===0) &&
      (!storePaymentVOs.get('offlinePaymentMethodList') || storePaymentVOs.get('offlinePaymentMethodList').size ===0) &&
      (!storePaymentVOs.get('codPaymentMethodList') || storePaymentVOs.get('codPaymentMethodList').size ===0)

    return (
      <div>
        {
            !loading? !nodata ?
              storePaymentVOs &&
              <div>
                <div className="method">
                  {storePaymentVOs.get('onlinePaymentMethodList') && storePaymentVOs.get('onlinePaymentMethodList').size!==0 && (
                    <div className="method-title flex-start-align">
                      <span></span>
                      <span><FormattedMessage id="Setting.Onlinepayment" /></span>
                      <span><FormattedMessage id="Setting.Setinpaymentmethodmodel" /></span>
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
                                  src={item.get('imgUrl')}
                                  style={{
                                    width: '150px',
                                    height: '80px',
                                    marginTop: '10px'
                                  }}
                                />
                              </div>
                              <div className="bar">
                                <div className="status">{item.get('name')}</div>
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </div>

                <div className="method">
                  {storePaymentVOs.get('offlinePaymentMethodList') && storePaymentVOs.get('offlinePaymentMethodList').size!==0 && (
                    <div className="method-title flex-start-align">
                      <span></span>
                      <span><FormattedMessage id="Setting.Offlinepayment" /></span>
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
                                  src={item.get('imgUrl')}
                                  style={{
                                    width: '150px',
                                    height: '80px',
                                    marginTop: '10px'
                                  }}
                                />
                              </div>
                              <div className="bar">
                                <div className="status">{item.get('name')}</div>

                                {/*<div className={'flex-start-align'}>*/}
                                {/*  <Switch style={{ marginRight: 15 }} />*/}
                                {/*</div>*/}
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </div>

                <div className="method">
                  {storePaymentVOs.get('codPaymentMethodList') && storePaymentVOs.get('codPaymentMethodList').size !==0 && (
                    <div className="method-title flex-start-align">
                      <span></span>
                      <span><FormattedMessage id="Setting.COD" /></span>
                    </div>
                  )}
                  <div className="flex-start-align">
                    {storePaymentVOs.get('codPaymentMethodList') && storePaymentVOs.get('codPaymentMethodList').size !==0 &&
                    storePaymentVOs.get('codPaymentMethodList').map((item, index) => {
                      return (
                        <Row key={item.id} >
                          <Col span={8}>
                            <Card style={{ width: 300, margin: 20 }} bodyStyle={{ padding: 10 }}>
                              <div className="methodItem">
                                <img
                                  src={item.get('imgUrl')}
                                  style={{
                                    width: '150px',
                                    height: '80px',
                                    marginTop: '10px'
                                  }}
                                />
                              </div>
                              <div className="bar">
                                <div className="status">{item.get('name')}</div>

                                {/*<div className={'flex-start-align'}>*/}
                                {/*  <Switch style={{ marginRight: 15 }} onChange={e=>this.onSwitchChange(e,item.id)} />*/}
                                {/*  <Tooltip placement="top" title="Edit">*/}
                                {/*    /!*<a style={{ color: this.state.isChecked == true ? 'red' : '#cccccc' }} type="link" onClick={this.onTooltip} className="iconfont iconEdit"></a>\*!/*/}
                                {/*    <a  type="link" onClick={()=>this.onTooltip(this,item.id,item.maxAmount)} className="iconfont iconEdit"></a>*/}

                                {/*  </Tooltip>*/}
                                {/*</div>*/}
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </div>
              </div> :
              <img src={nodataImg} width="80" className="no-data-img" /> :
            <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />
        }
      </div>
    );
  }
}
