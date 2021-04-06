import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const, noop } from 'qmkit';
import {Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch, Input, Select} from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import PaymentModel from './payment-modal';
import MethodTips from './methodTips';
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
export default class PaymentMethod extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentVisible: false,
      editType: false,
      isChecked: false,
      paymentForm: {
        enabled: false
      },
      enabled: null,
      maxAmount: 0
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
      storePaymentVOs: any;
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
    storePaymentVOs: 'storePaymentVOs',
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
    this.setState({
      isChecked: e,
      checkedId: checkedId
    })
    getCheckedId(checkedId)
    //getCheckedId(checkedId)
    onChecked(e);
  };

  onTooltip = (e,id,maxAmount) => {
    const { onShow, switchChecked, checkedId, getStorePaymentVOs } = this.props.relaxProps;
    let { storePaymentVOs } = this.props.relaxProps
    if (switchChecked == true && checkedId == id) {
      this.setState({
        maxAmount: maxAmount
      })
      storePaymentVOs = storePaymentVOs.set('id', id)
      storePaymentVOs = storePaymentVOs.set('maxAmount', maxAmount)
      getStorePaymentVOs(storePaymentVOs)
      onShow(true);
    } else {
      return false;
    }
  };

  onFormChange = (value) => {
    this.setState({
      enabled: value
    });
  };

  render() {
    const { queryByStoreId, switchChecked, getStorePaymentVOs, getCheckedId, switchVisible } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    let checked = this.state.paymentForm.enabled;
    if (this.state.enabled != null) {
      checked = this.state.enabled;
    }
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
                console.log(item,111111);
                return (
                  /*<Form key={index}>
                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label="111"  valuePropName="checked">
                          {getFieldDecorator('enabled', {
                            initialValue: item.isOpen == 0 ? false : true
                          })(<Switch onChange={(value) => this.onFormChange(value)} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>*/


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
                        <div className="bar">
                          <div className="status">{item.name}</div>

                          <div className={'flex-start-align'}>
                            <Switch style={{ marginRight: 15 }} onChange={e=>this.onSwitchChange(e,item.id)} />
                            <Tooltip placement="top" title="Edit">
                              {/*<a style={{ color: this.state.isChecked == true ? 'red' : '#cccccc' }} type="link" onClick={this.onTooltip} className="iconfont iconEdit"></a>\*/}
                              <a  type="link" onClick={()=>this.onTooltip(this,item.id,item.maxAmount)} className="iconfont iconEdit"></a>

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
        <MethodTips checkedId={this.state.checkedId} maxAmount={this.state.maxAmount}/>
      </div>
    );
  }
}
