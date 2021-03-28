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
    const { getFieldDecorator } = this.props.form;
    const { payPspCardTypeVOList } = this.props.paymentForm;
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
                  <Form>
                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={true} label={<FormattedMessage id="apiKey" />}>
                          {getFieldDecorator('apiKey', {
                            initialValue: item.pspConfigVO.apiKey,
                            rules: [{ required: true, message: 'Please input Api Key!' }]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="appID" />}>
                          {getFieldDecorator('appId', {
                            initialValue: item.pspConfigVO.appId,
                            rules: [{ required: false, message: 'Please input App ID!' }]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="privateKey" />}>
                          {getFieldDecorator('privateKey', {
                            initialValue: item.pspConfigVO.privateKey,
                            rules: [{ required: false, message: 'Please input Private Key!' }]
                          })(<Input.TextArea />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="publicKey" />}>
                          {getFieldDecorator('publicKey', {
                            initialValue: item.pspConfigVO.publicKey,
                            rules: [{ required: false, message: 'Please input Public Key!' }]
                          })(<Input.TextArea />)}
                        </FormItem>
                      </Col>

                      {/*新增*/}
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="paymentMethod" />}>
                          {getFieldDecorator('paymentMethod', {
                            initialValue: item.payPspItemCardTypeVOList.map((a)=>{
                              return a.cardType
                            }),
                            rules: [
                              {
                                required: false,
                                message: 'Please select Payment Method.'
                              }
                            ]
                          })(
                            <Select mode="multiple">
                              {payPspCardTypeVOList&&payPspCardTypeVOList.map((b,i)=>{
                                return (
                                  <Option value={b.cardType} key={i}>
                                    <img
                                      src={b.imgUrl}
                                      style={{
                                        width: '30px',
                                        height: '20px',
                                        marginRight: '10px'
                                      }}
                                    />
                                    {b.cardType}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="enabled" />}>
                          {getFieldDecorator('enabled', {
                            initialValue: item.pspConfigVO.enabled
                          })(<Switch checked={checked} onChange={(value) => this.onFormChange(value)} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                  /*<Row key={item.id} >
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
                              <a style={{ color: this.state.isChecked == true ? 'red' : '#cccccc' }} type="link" onClick={this.onTooltip} className="iconfont iconEdit"></a>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>*/
                );
              })}
          </div>
        </div>
        <MethodTips/>
      </div>
    );
  }
}
