import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const, noop } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import PaymentModel from './payment-modal';
import MethodTips from './methodTips';

import { Relax, StoreProvider } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';
@Relax
export default class PaymentMethod extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentVisible: false,
      enabled: true,
      paymentForm: {}, //edit
      editType: false,
      isChecked: false
    };
    this.closeModel = this.closeModel.bind(this);
  }
  props: {
    relaxProps?: {
      queryByStoreId: any;
      switchVisible: any;
      checkedId: any;
      onShow: Function;
      onChecked: Function;
      switchChecked: any;
      getEditStorePayment: Function;
      getStorePaymentVOs: Function;
      getCheckedId: Function;
    };
  };

  static relaxProps = {
    queryByStoreId: 'queryByStoreId',
    switchVisible: 'switchVisible',
    onShow: noop,
    onChecked: noop,
    switchChecked: 'switchChecked',
    checkedId: 'checkedId',
    getEditStorePayment: noop,
    getStorePaymentVOs: noop,
    getCheckedId: noop,
  };
  componentDidMount() {}
  getPaymentSetting = async () => {
    /*const { res } = await webapi.getPaymentSetting();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        paymentList: res.context.payGatewayVOList
      });
    }*/
  };

  closeModel = () => {
    this.setState({
      paymentVisible: false
    });
  };

  onSwitchChange = (e,checkedId) => {
    const { onChecked, getCheckedId } = this.props.relaxProps;
    console.log(e,1111);
    console.log(checkedId,3333333);
    this.setState({
      isChecked: e
    })
    //getCheckedId(checkedId)
    onChecked(e);
  };

  onTooltip = () => {
    const { onShow, switchChecked } = this.props.relaxProps;
    if (switchChecked == true) {
      onShow(true);
    } else {
      return false;
    }
  };

  onChange = () => {};

  render() {
    const { queryByStoreId, switchChecked, getStorePaymentVOs, getCheckedId, switchVisible } = this.props.relaxProps;
    setTimeout(()=>{
      console.log(switchChecked,11111111111);
    })
    return (
      <div>
        <div className="method">
          {queryByStoreId.List1 && (
            <div className="method-title flex-start-align">
              <span></span>
              <span>Online payment</span>
              <span>Set in payment method model</span>
            </div>
          )}
          <div className="method-list flex-start-align">
            {queryByStoreId.List1 &&
              queryByStoreId.List1.map((item, index) => {
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
          {queryByStoreId.List2 && (
            <div className="method-title flex-start-align">
              <span></span>
              <span>Offline payment</span>
            </div>
          )}
          <div className="flex-start-align">
            {queryByStoreId.List2 &&
              queryByStoreId.List2.map((item, index) => {
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
                            {/*<Tooltip placement="top" title="Edit">
                              <a
                                style={{ color: 'red' }}
                                type="link"
                                onClick={() => {
                                  this.setState({
                                    paymentVisible: true,
                                    paymentForm: item
                                  });
                                }}
                                className="iconfont iconEdit"
                              ></a>
                            </Tooltip>*/}
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
          {queryByStoreId.List3 && (
            <div className="method-title flex-start-align">
              <span></span>
              <span>COD</span>
            </div>
          )}
          <div className="flex-start-align">
            {queryByStoreId.List3 &&
              queryByStoreId.List3.map((item, index) => {
                getStorePaymentVOs(item);
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
                            <Switch style={{ marginRight: 15 }} key={item.id} onChange={e=>this.onSwitchChange(e,item.id)} />
                            <Tooltip placement="top" title="Edit">
                              <a style={{ color: this.state.isChecked == true ? 'red' : '#cccccc' }} type="link" onClick={this.onTooltip} className="iconfont iconEdit"></a>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                );
              })}
          </div>
        </div>
        <MethodTips/>
      </div>
    );
  }
}
