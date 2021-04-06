import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const } from 'qmkit';
import List from "@/groupon-activity-list/component/list";
const { TabPane } = Tabs;

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

class PaymentModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {
        isOpen: 1
      },
      enabled: null,
      key: 0
    };
  }


  onFormChange = (value) => {
    this.setState({
      isOpen: value ? 1 : 0
    });
  };

  _handleClick = (value) => {
    this.setState({
      key: Number(value)
    })
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    //const key = form.get('tabType');
    // let checked = this.state.paymentForm.isOpen;
    // if (this.state.isOpen != null) {
    //   checked = this.state.isOpen;
    // }


    console.log(this.props.paymentForm, 'paymentForm');
    return (
      <Modal maskClosable={false} title="Edit Payment Setting" visible={this.props.visible} onOk={this._next} onCancel={() => this.cancel()} okText="Submit">
        <Tabs defaultActiveKey={this.props.paymentForm.payPspItemVOList && this.props.paymentForm.payPspItemVOList[0].id} onChange={this._handleClick} >
          {this.props.paymentForm&&this.props.paymentForm.payPspItemVOList&&this.props.paymentForm.payPspItemVOList.map((item, index)=>{
            return(
                item.name !== 'COD' ?
                  <TabPane tab={item.name} key={item.id}>
                  <Form>
                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={true} label={<FormattedMessage id="apiKey" />}>
                          {getFieldDecorator('apiKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.apiKey,
                            rules: [{ required: true, message: 'Please input Api Key!' }]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="appID" />}>
                          {getFieldDecorator('appId', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.appId,
                            rules: [{ required: false, message: 'Please input App ID!' }]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="privateKey" />}>
                          {getFieldDecorator('privateKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.privateKey,
                            rules: [{ required: false, message: 'Please input Private Key!' }]
                          })(<Input.TextArea />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="publicKey" />}>
                          {getFieldDecorator('publicKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.publicKey,
                            rules: [{ required: false, message: 'Please input Public Key!' }]
                          })(<Input.TextArea />)}
                        </FormItem>
                      </Col>

                      {/*新增*/}
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="paymentMethod" />}>
                          {getFieldDecorator('paymentMethod', {
                            initialValue: item.payPspItemCardTypeVOList&&item.payPspItemCardTypeVOList.map((a)=>{
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
                              {this.props.paymentForm.payPspCardTypeVOList&&this.props.paymentForm.payPspCardTypeVOList.map((b,i)=>{
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
                          {getFieldDecorator('isOpen', {
                            initialValue: item.isOpen == 1? true : false
                          })(<Switch defaultChecked={item.isOpen == 1? true : false} onChange={(value)=> {
                            this.onFormChange(value)
                            this.props.onFormChange({
                              id: item.id,
                              field: 'isOpen',
                              value: value ? 1 : 0
                            })
                          }} />)}
                        </FormItem>
                      </Col>
                      {
                        item.isOpen == 1 &&
                        <Col span={24}>
                          <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.SupportSubscription" />}>
                            {getFieldDecorator('supportSubscription', {
                              initialValue: item.supportSubscription
                            })(
                              <Select  style={{ width: 120 }} >
                                <Option value={1}><FormattedMessage id="Setting.Yes" /></Option>
                                <Option value={0}><FormattedMessage id="Setting.No" /></Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      }
                    </Row>
                  </Form>
                </TabPane > :
                  <TabPane tab={item.name} key={item.id}>
                  <Form>
                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="enabled" />}>
                          {getFieldDecorator('isOpen', {
                            initialValue: item.isOpen == 1? true : false
                          })(<Switch defaultChecked={item.isOpen == 1? true : false}  />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.maxAmount" />}>
                          {getFieldDecorator('maxAmount', {
                            initialValue: item.maxAmount
                          })(
                            <Input />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                </TabPane >
            )
          })}

        </Tabs>
      </Modal>
    );
  }
  /**
   * 保存
   */
  _next = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.onSave();
      }
    });
  };

  cancel = () => {
    this.props.parent.closeModel();
    this.props.form.resetFields();
    this.setState({
      isOpen: null
    });
  };

  union = (arr1,arr2) =>{
    return arr1.filter(item=>{
      if (arr2.indexOf(item.cardType)>-1) {
        arr2.splice(arr2.indexOf(item.cardType),1)
        return item
      }
    })
  }

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      //如果校验通过
      debugger
      let payPspItemVOList = this.props.paymentForm.payPspItemVOList.find(item => item.id === this.state.key)
      let pspItemCardTypeSaveRequestList = []
      let paymentMethodList = this.props.paymentForm.payPspCardTypeVOList.filter(item=>{
        if (values.paymentMethod.indexOf(item.cardType)>-1) {
          values.paymentMethod.splice(values.paymentMethod.indexOf(item.cardType),1)
          return item
        }
      })
      paymentMethodList.map((item,i)=>{
        pspItemCardTypeSaveRequestList.push({
          storeId: item.storeId,
          pspId: item.pspId,
          pspItemId: payPspItemVOList.pspConfigVO.pspItemId,
          cardType: item.cardType,
          imgUrl: item.imgUrl,
        })
      })
      let  params = {}
      if (payPspItemVOList.name !== 'COD') {
        if(payPspItemVOList.pspConfigVO) {
          params = {
            pspConfigSaveRequest: Object.assign({
              id: payPspItemVOList.pspConfigVO.id,
              pspId: payPspItemVOList.pspConfigVO.pspId,
              pspItemId: payPspItemVOList.pspConfigVO.pspItemId,
              apiKey: values.apiKey,
              secret: payPspItemVOList.pspConfigVO.secret,
              appId: payPspItemVOList.pspConfigVO.appId,
              privateKey: values.privateKey,
              publicKey: values.publicKey,
            }),
            payPspItemSaveRequest: Object.assign({
              id: payPspItemVOList.pspConfigVO && payPspItemVOList.pspConfigVO.pspItemId ? payPspItemVOList.pspConfigVO.pspItemId : payPspItemVOList.id,
              isOpen: values.isOpen == true ? 1 : 0,
              pspItemCardTypeSaveRequestList: pspItemCardTypeSaveRequestList,
              supportSubscription: values.supportSubscription,
            })
          }
        }
      } else {
        params = {
          payPspItemSaveRequest: Object.assign({
            id: payPspItemVOList.pspConfigVO && payPspItemVOList.pspConfigVO.pspItemId ? payPspItemVOList.pspConfigVO.pspItemId : payPspItemVOList.id,
            isOpen: values.isOpen == true ? 1 : 0,
            maxAmount: values.maxAmount
          })
        }
      }
      if (!errs) {
        const { res } = await webapi.savePaymentSetting(params);
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.props.reflash();
          this.cancel();
        }
      }
    });
  };
}
export default Form.create()(PaymentModal);
