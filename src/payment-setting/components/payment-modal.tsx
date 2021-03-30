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
        isOpen: false
      },
      enabled: null,
      key: "0"
    };
  }


  onFormChange = (value) => {
    this.setState({
      isOpen: value
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
    let checked = this.state.paymentForm.isOpen;
    if (this.state.isOpen != null) {
      checked = this.state.isOpen;
    }



    return (
      <Modal maskClosable={false} title="Edit Payment Setting" visible={this.props.visible} onOk={this._next} onCancel={() => this.cancel()} okText="Submit">
        <Tabs defaultActiveKey="0" onChange={this._handleClick} >
          {this.props.paymentForm&&this.props.paymentForm.payPspItemVOList&&this.props.paymentForm.payPspItemVOList.map((item, index)=>{
            setTimeout(()=>{
              console.log(item.pspConfigVO.isOpen,23);
            })
            return(
              <TabPane tab={item.name} key={index}>
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
                        {getFieldDecorator('enabled', {
                          initialValue: item.pspConfigVO.isOpen == 1? true : false
                        })(<Switch checked={checked} onChange={(value) => this.onFormChange(value)} />)}
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

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      console.log(values,1111111);
      //如果校验通过
      let payPspItemVOList = this.props.paymentForm.payPspItemVOList[this.state.key]
      if (!errs) {
        const { res } = await webapi.savePaymentSetting({
          pspItemCardTypeSaveRequestList: Object.assign({
            id: payPspItemVOList.pspConfigVO.id,
            pspId: payPspItemVOList.pspConfigVO.pspId,
            pspItemId: payPspItemVOList.pspConfigVO.pspItemId,
            apiKey: values.apiKey,
            secret: payPspItemVOList.pspConfigVO.secret,
            appId: payPspItemVOList.pspConfigVO.appId,
            privateKey: values.privateKey,
            publicKey: values.publicKey
          }),
          payPspItemSaveReques: Object.assign({
            id: payPspItemVOList.pspConfigVO.pspItemId,
            isOpen: values.isOpen ? 1 : 0,
            storePaymentMethod: values.paymentMethod.join(','),
          })
        });
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
