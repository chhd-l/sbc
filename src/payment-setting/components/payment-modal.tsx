import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n } from 'qmkit';
import List from "@/groupon-activity-list/component/list";
import { Relax } from 'plume2';
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
@Relax
class PaymentModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {
        isOpen: 1
      },
      enabled: null,
    };
  }
  form;
  props: {
    visible: any;
    form: any;
    relaxProps?: {
      key: any;
      paymentForm: any;
      saveLoading: boolean;
      visible: boolean;
      paymentFormSource: any;
      setCurrentTabKey: Function;
      onFormChange: Function;
      save: Function;
      handelModelOpenOClose: Function;
      init: Function;
    };
  };

  static relaxProps = {
    key: 'key',
    paymentForm: 'paymentForm',
    visible: 'visible',
    saveLoading: 'saveLoading',
    paymentFormSource: 'paymentFormSource',
    init: noop,
    setCurrentTabKey: noop,
    onFormChange: noop,
    save: noop,
    handelModelOpenOClose: noop,
  };
  onFormChange = (value) => {
    this.setState({
      isOpen: value ? 1 : 0
    });
  };

  _handleClick = (value) => {
    const { setCurrentTabKey } = this.props.relaxProps
    setCurrentTabKey(Number(value))
  };

  afterClose = () => {
    // this.form.resetFields()
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    const { key, onFormChange, visible, saveLoading } = this.props.relaxProps
    let paymentForm =  this.props.relaxProps.paymentForm.toJS()
    console.log(key, 'key----------');
    console.log(paymentForm, 'paymentForm----------');
    return (
      <Modal afterClose={this.afterClose} confirmLoading={saveLoading} maskClosable={false} title="Edit Payment Setting" visible={visible} onOk={this._next} onCancel={() => this.cancel()} okText="Submit">
        <Tabs defaultActiveKey={key ? key.toString() : null} onChange={this._handleClick}>
          {paymentForm&&paymentForm.payPspItemVOList&&paymentForm.payPspItemVOList.map((item, index)=>{
            return(
              item.name !== 'COD' ?
                <TabPane tab={item.name} key={item.id}>
                  <Form name={item.name+'_form'} ref={(form) => (this.form = form)}>
                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={true} label={<FormattedMessage id="apiKey" />}>
                          {getFieldDecorator(item.id + 'apiKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.apiKey,
                            rules: [{ required: true, message: RCi18n({id: 'Setting.PleaseinputApiKey'}) }]
                          })(<Input onChange={(e) => {
                            onFormChange({
                              id: key,
                              field: 'apiKey',
                              value: e.target.value
                            })
                          }}/>)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="appID" />}>
                          {getFieldDecorator(item.id+'appId', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.appId,
                            rules: [{ required: false, message:  RCi18n({id: 'Setting.PleaseinputAppID'}) }]
                          })(<Input onChange={(e) => {
                            onFormChange({
                              id: key,
                              field: 'appId',
                              value: e.target.value
                            })
                          }} />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="privateKey" />}>
                          {getFieldDecorator(item.id + 'privateKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.privateKey,
                            rules: [{ required: false, message: RCi18n({id: 'Setting.PleaseinputPrivateKey'}) }]
                          })(<Input.TextArea onChange={(e) => {
                            onFormChange({
                              id: key,
                              field: 'privateKey',
                              value: e.target.value
                            })
                          }} />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="publicKey" />}>
                          {getFieldDecorator(item.id + 'publicKey', {
                            initialValue: item.pspConfigVO&&item.pspConfigVO.publicKey,
                            rules: [{ required: false, message: RCi18n({id: 'Setting.PleaseinputPublicKey'})}]
                          })(<Input.TextArea onChange={(e) => {
                            onFormChange({
                              id: key,
                              field: 'publicKey',
                              value: e.target.value
                            })
                          }} />)}
                        </FormItem>
                      </Col>

                      {/*新增*/}
                      <Col span={24}>
                        <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="paymentMethod" />}>
                          {getFieldDecorator(item.id + 'paymentMethod', {
                            initialValue: item.payPspItemCardTypeVOList&&item.payPspItemCardTypeVOList.map((a)=>{
                              return a.cardType
                            }),
                            rules: [
                              {
                                required: false,
                                message: RCi18n({id: 'Setting.PleaseselectPayment'})
                              }
                            ]
                          })(
                            <Select mode="multiple" onChange={(values) => {
                              let paymentMethodList = []
                                paymentForm.payPspCardTypeVOList.map(item=>{
                                  values.map(value => {
                                    if(value === item.cardType) {
                                      paymentMethodList.push(item)
                                    }
                                  })
                              })
                              onFormChange({
                                id: key,
                                field: 'payPspItemCardTypeVOList',
                                value: paymentMethodList
                              })
                            }}>
                              {paymentForm.payPspCardTypeVOList&&paymentForm.payPspCardTypeVOList.map((b,i)=>{
                                return (
                                  <Option value={b.cardType} key={i} >
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
                          {getFieldDecorator(item.id + 'isOpen', {
                            initialValue: item.isOpen == 1
                          })(<Switch defaultChecked={item.isOpen == 1} checked={item.isOpen == 1} onChange={(value)=> {
                            this.onFormChange(value)
                            onFormChange({
                              id: key,
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
                            {getFieldDecorator(item.id + 'supportSubscription', {
                              initialValue: item.supportSubscription
                            })(
                              <Select  style={{ width: 120 }} onChange={(value) => {
                                onFormChange({
                                  id: key,
                                  field: 'supportSubscription',
                                  value: value
                                })
                              }}>
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
                          {getFieldDecorator(item.id + 'isOpen', {
                            initialValue: item.isOpen == 1
                          })(<Switch defaultChecked={item.isOpen == 1} checked={item.isOpen == 1}
                                     onChange={(value)=> {
                                       onFormChange({
                                         id: key,
                                         field: 'isOpen',
                                         value: value ? 1 : 0
                                       })
                                     }}
                          />)}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.maxAmount" />}>
                          {getFieldDecorator(item.id + 'maxAmount', {
                            initialValue: item.maxAmount
                          })(
                            <Input  onChange={(e) => {
                              onFormChange({
                                id: key,
                                field: 'maxAmount',
                                value: e.target.value
                              })
                            }}/>
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
    const { handelModelOpenOClose, init } = this.props.relaxProps
    this.props.form.resetFields();
    handelModelOpenOClose(false)
    init()
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
      const { key, save } = this.props.relaxProps
      let paymentForm = this.props.relaxProps.paymentForm.toJS()
      let payPspItemVOList = paymentForm.payPspItemVOList.find(item => item.id === key)
      // let pspItemCardTypeSaveRequestList = []
      // let paymentMethodList = paymentForm.payPspCardTypeVOList.filter(item=>{
      //   if (values.paymentMethod.indexOf(item.cardType)>-1) {
      //     values.paymentMethod.splice(values.paymentMethod.indexOf(item.cardType),1)
      //     return item
      //   }
      // })
      // paymentMethodList.map((item,i)=>{
      //   pspItemCardTypeSaveRequestList.push({
      //     storeId: item.storeId,
      //     pspId: item.pspId,
      //     pspItemId: payPspItemVOList.pspConfigVO.pspItemId,
      //     cardType: item.cardType,
      //     imgUrl: item.imgUrl,
      //   })
      // })
      let  params = {}
      if (payPspItemVOList.name !== 'COD') {
        if(payPspItemVOList.pspConfigVO) {
          params = {
            pspConfigSaveRequest: Object.assign({
              id: payPspItemVOList.pspConfigVO.id,
              pspId: payPspItemVOList.pspConfigVO.pspId ,
              pspItemId: payPspItemVOList.pspConfigVO.pspItemId,
              apiKey: payPspItemVOList.pspConfigVO.apiKey,
              secret: payPspItemVOList.pspConfigVO.secret,
              appId: payPspItemVOList.pspConfigVO.appId,
              privateKey: payPspItemVOList.pspConfigVO.privateKey,
              publicKey: payPspItemVOList.pspConfigVO.publicKey,
            }),
            payPspItemSaveRequest: Object.assign({
              id: payPspItemVOList.pspConfigVO && payPspItemVOList.pspConfigVO.pspItemId ? payPspItemVOList.pspConfigVO.pspItemId : payPspItemVOList.id,
              isOpen: payPspItemVOList.isOpen,
              pspItemCardTypeSaveRequestList: payPspItemVOList.payPspItemCardTypeVOList,
              supportSubscription: payPspItemVOList.supportSubscription,
            })
          }
        }
      } else {
        params = {
          payPspItemSaveRequest: Object.assign({
            id: payPspItemVOList.pspConfigVO && payPspItemVOList.pspConfigVO.pspItemId ? payPspItemVOList.pspConfigVO.pspItemId : payPspItemVOList.id,
            isOpen: payPspItemVOList.isOpen,
            maxAmount: payPspItemVOList.maxAmount
          })
        }
      }
      console.log(params, 'params-----');
      if (!errs) {
        save(params)
      }
    });
  };
}
export default Form.create()(PaymentModal);
