import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n ,cache} from 'qmkit';
import List from '@/groupon-activity-list/component/list';
import { Relax } from 'plume2';
import { left } from '@antv/x6/lib/registry/port-layout/line';
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 8,
    // xs: { span: 24 },
    // sm: { span: 6 }
  },
  wrapperCol: {
    span: 16,
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
      _country:'fr',
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
    handelModelOpenOClose: noop
  };

  componentDidMount() {
    let _country = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
    this.setState({
      _country
    })
  }

  onFormChange = (value) => {
    this.setState({
      isOpen: value ? 1 : 0
    });
  };

  _handleClick = (value) => {
    const { setCurrentTabKey } = this.props.relaxProps;
    setCurrentTabKey(Number(value));
  };

  afterClose = () => {
    // this.form.resetFields()
  };
  
  isDisplayValue = (code) =>{
    // 线下店支付 开启的时候需要传2 目前有fr.
    let checkoutCode = ["adyen_point_of_sale","CASH"].indexOf(code)>-1
    let value =  this.state._country == 'fr' && checkoutCode ?2 : 1;
    return value
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { key, onFormChange, visible, saveLoading } = this.props.relaxProps;

    let paymentForm = this.props.relaxProps.paymentForm.toJS();

    return (
      <Modal
        afterClose={this.afterClose}
        confirmLoading={saveLoading}
        maskClosable={false}
        title="Edit Payment Setting"
        visible={visible}
        onOk={this._next}
        onCancel={() => this.cancel()}
        okText="Submit"
      >
        <Tabs defaultActiveKey={key ? key.toString() : null} onChange={this._handleClick}>
          {paymentForm &&
            paymentForm.payPspItemVOList &&
            paymentForm.payPspItemVOList.map((item, index) => {
              return !item.code.includes('cod') ? (
                <TabPane tab={item.name} key={item.id}>
                  <Form name={item.name + '_form'} ref={(form) => (this.form = form)}>
                    <Row>
                     {this.state._country == 'fr' && item.code.includes('CASH') ?null:<>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="apiKey" />}
                        >
                          {getFieldDecorator(item.id + 'apiKey', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.apiKey,
                            rules: [
                              {
                                required: false,
                                message: RCi18n({ id: 'Setting.PleaseinputApiKey' })
                              }
                            ]
                          })(
                            <Input
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'apiKey',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="merchantAccount" />}
                        >
                          {getFieldDecorator(item.id + 'merchantAccount', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.merchantAccount,
                            rules: [
                              {
                                required: false,
                                message: RCi18n({ id: 'Setting.PleaseinputAppID' })
                              }
                            ]
                          })(
                            <Input
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'merchantAccount',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="privateKey" />}
                        >
                          {getFieldDecorator(item.id + 'privateKey', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.privateKey,
                            rules: [
                              {
                                required: false,
                                message: RCi18n({ id: 'Setting.PleaseinputPrivateKey' })
                              }
                            ]
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'privateKey',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="publicKey" />}
                        >
                          {getFieldDecorator(item.id + 'publicKey', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.publicKey,
                            rules: [
                              {
                                required: false,
                                message: RCi18n({ id: 'Setting.PleaseinputPublicKey' })
                              }
                            ]
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'publicKey',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="clientKey" />}
                        >
                          {getFieldDecorator(item.id + 'clientKey', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.clientKey
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'clientKey',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="paymentAccount" />}
                        >
                          {getFieldDecorator(item.id + 'paymentAccount', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.paymentAccount
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'paymentAccount',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="environment" />}
                        >
                          {getFieldDecorator(item.id + 'environment', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.environment
                          })(
                            <Select
                              style={{ width: 120 }}
                              onChange={(value) => {
                                onFormChange({
                                  id: key,
                                  field: 'environment',
                                  value: value
                                });
                              }}
                            >
                              <Option value="test">
                                <FormattedMessage id="Setting.Test" />
                              </Option>
                              <Option value="live">
                                <FormattedMessage id="Setting.Live" />
                              </Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="checkoutApiPrefix" />}
                        >
                          {getFieldDecorator(item.id + 'checkoutApiPrefix', {
                            initialValue:
                              item.pspConfigSupplierVO && item.pspConfigSupplierVO.checkoutApiPrefix
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'checkoutApiPrefix',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="classicPaymentApiPrefix" />}
                        >
                          {getFieldDecorator(item.id + 'classicPaymentApiPrefix', {
                            initialValue:
                              item.pspConfigSupplierVO &&
                              item.pspConfigSupplierVO.classicPaymentApiPrefix
                          })(
                            <Input.TextArea
                              onChange={(e) => {
                                onFormChange({
                                  id: key,
                                  field: 'classicPaymentApiPrefix',
                                  value: e.target.value
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      {/*新增*/}
                      <Col span={24}>
                        <FormItem
                          {...formItemLayout}
                          required={false}
                          label={<FormattedMessage id="paymentMethod" />}
                        >
                          {getFieldDecorator(item.id + 'paymentMethod', {
                            initialValue:
                              item.payPspItemCardTypeVOList &&
                              item.payPspItemCardTypeVOList.map((a) => {
                                return a.cardType;
                              }),
                            rules: [
                              {
                                required: false,
                                message: RCi18n({ id: 'Setting.PleaseselectPayment' })
                              }
                            ]
                          })(
                            <Select
                              mode="multiple"
                              onChange={(values) => {
                                let paymentMethodList = [];
                                paymentForm.payPspCardTypeVOList.map((item) => {
                                  values.map((value) => {
                                    if (value === item.cardType) {
                                      paymentMethodList.push(item);
                                    }
                                  });
                                });
                                onFormChange({
                                  id: key,
                                  field: 'payPspItemCardTypeVOList',
                                  value: paymentMethodList
                                });
                              }}
                            >
                              {paymentForm.payPspCardTypeVOList &&
                                paymentForm.payPspCardTypeVOList.map((b, i) => {
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
                                  );
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      </>}
                      <Col span={24} className="newAddSwitch">
                        <FormItem {...formItemLayout} label={<FormattedMessage id="enabledPaymentmethod" />}>
                          {getFieldDecorator(item.id + 'isOpen', {
                            initialValue: item.isOpen == 1 
                          })(
                            <Switch
                              defaultChecked={item.isOpen == 1}
                              checked={item.isOpen == 1}
                              onChange={(value) => {
                                this.onFormChange(value);
                                onFormChange({
                                  id: key,
                                  field: 'isOpen',
                                  value: value ? 1 : 0
                                });
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                      {item.isOpen == 1 && (
                        <Col span={24} className="newAddSwitch">
                          <FormItem {...formItemLayout} label={<FormattedMessage id="displayCheckoutPage" />}>
                            {getFieldDecorator(item.id + 'isDisplay', {
                              initialValue: item.isDisplay == this.isDisplayValue(item.code)
                            })(
                              <Switch
                                defaultChecked={item.isDisplay == this.isDisplayValue(item.code)}
                                checked={item.isDisplay == this.isDisplayValue(item.code)}
                                onChange={(value) => {
                                  onFormChange({
                                    id: key,
                                    field: 'isDisplay',
                                    value: value ? this.isDisplayValue(item.code) : 0
                                  });
                                }}
                              />
                            )}
                          </FormItem>
                        </Col>
                      )}
                      {item.isOpen == 1 && item.code.includes('adyen_credit_card') && (
                        <>
                          <Col span={24} className="newAddSwitch capture">
                            <FormItem {...formItemLayout} label={<FormattedMessage id="Capture payment after shipping" />}>
                              {getFieldDecorator(item.id + 'isTwoStages', {
                                initialValue: item.isTwoStages == 1
                              })(
                                <Switch
                                  defaultChecked={item.isTwoStages == 1}
                                  checked={item.isTwoStages == 1}
                                  onChange={(value) => {
                                    onFormChange({
                                      id: key,
                                      field: 'isTwoStages',
                                      value: value ? 1 : 0
                                    });
                                  }}
                                />
                              )}
                            </FormItem>
                          </Col>
                          <div className='newAddSwitchTips'>(<FormattedMessage id='We also need to enable "authorized" on Adyen portal' />)</div>
                        </>
                      )}
                      {item.isOpen == 1 && (
                        <Col span={24}>
                          <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="Setting.SupportSubscription" />}
                          >
                            {getFieldDecorator(item.id + 'supportSubscription', {
                              initialValue: item.supportSubscription
                            })(
                              <Select
                                style={{ width: 120 }}
                                onChange={(value) => {
                                  onFormChange({
                                    id: key,
                                    field: 'supportSubscription',
                                    value: value
                                  });
                                }}
                              >
                                <Option value={1}>
                                  <FormattedMessage id="Setting.Yes" />
                                </Option>
                                <Option value={0}>
                                  <FormattedMessage id="Setting.No" />
                                </Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      )}
                      {item.maxAmount ? (
                        <MaxAmountInput
                          getFieldDecorator={getFieldDecorator}
                          item={item}
                          onFormChange={onFormChange}
                          formKey={key}
                        />
                      ) : null}
                    </Row>
                  </Form>
                </TabPane>
              ) : (
                <TabPane tab={item.name} key={item.id}>
                  <Form>
                    <Row>
                      <MaxAmountInput
                        getFieldDecorator={getFieldDecorator}
                        item={item}
                        onFormChange={onFormChange}
                        formKey={key}
                      />

                      <Col span={24} className="newAddSwitch">
                        <FormItem {...formItemLayout} label={<FormattedMessage id="Enabled this payment method" />}>
                          {getFieldDecorator(item.id + 'isOpen', {
                            initialValue: item.isOpen == 1
                          })(
                            <Switch
                              defaultChecked={item.isOpen == 1}
                              checked={item.isOpen == 1}
                              onChange={(value) => {
                                onFormChange({
                                  id: key,
                                  field: 'isOpen',
                                  value: value ? 1 : 0
                                });
                              }}
                            />
                          )}
                        </FormItem>
                        {item.isOpen == 1 && (
                          <Col span={24} className="newAddSwitch">
                            <FormItem {...formItemLayout} label={<FormattedMessage id="Display on checkout page" />}>
                              {getFieldDecorator(item.id + 'isDisplay', {
                                initialValue: item.isDisplay == 1
                              })(
                                <Switch
                                  defaultChecked={item.isDisplay == 1}
                                  checked={item.isDisplay == 1}
                                  onChange={(value) => {
                                    onFormChange({
                                      id: key,
                                      field: 'isDisplay',
                                      value: value ? 1 : 0
                                    });
                                  }}
                                />
                              )}
                            </FormItem>
                          </Col>
                        )}
                        {item.isOpen == 1 && (
                          <Col span={24}>
                            <FormItem
                              {...formItemLayout}
                              label={<FormattedMessage id="Setting.SupportSubscription" />}
                            >
                              {getFieldDecorator(item.id + 'supportSubscription', {
                                initialValue: item.supportSubscription
                              })(
                                <Select
                                  style={{ width: 120 }}
                                  onChange={(value) => {
                                    onFormChange({
                                      id: key,
                                      field: 'supportSubscription',
                                      value: value
                                    });
                                  }}
                                >
                                  <Option value={1}>
                                    <FormattedMessage id="Setting.Yes" />
                                  </Option>
                                  <Option value={0}>
                                    <FormattedMessage id="Setting.No" />
                                  </Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              );
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
    const { handelModelOpenOClose, init } = this.props.relaxProps;
    this.props.form.resetFields();
    handelModelOpenOClose(false);
    init();
  };

  union = (arr1, arr2) => {
    return arr1.filter((item) => {
      if (arr2.indexOf(item.cardType) > -1) {
        arr2.splice(arr2.indexOf(item.cardType), 1);
        return item;
      }
    });
  };

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      //如果校验通过
      const { key, save } = this.props.relaxProps;
      let paymentForm = this.props.relaxProps.paymentForm.toJS();
      let payPspItemVOList = paymentForm.payPspItemVOList.find((item) => item.id === key);
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
      //     pspItemId: payPspItemVOList.pspConfigSupplierVO.pspItemId,
      //     cardType: item.cardType,
      //     imgUrl: item.imgUrl,
      //   })
      // })
      let params = {};
      // CASH fr主要用于felinstore 游客代客下单，不填写cash的输入框数据
      if (!payPspItemVOList.code.includes('cod')) {
        if (payPspItemVOList.pspConfigSupplierVO || (payPspItemVOList.code.includes('CASH')&& this.state._country == 'fr')) {
          params = {
            pspConfigSaveRequest: Object.assign({
              id: payPspItemVOList?.pspConfigSupplierVO?.id || null,
              pspId: payPspItemVOList?.pspConfigSupplierVO?.pspId|| null,
              pspItemId: payPspItemVOList?.pspConfigSupplierVO?.pspItemId|| null,
              apiKey: payPspItemVOList?.pspConfigSupplierVO?.apiKey || '',
              secret: payPspItemVOList?.pspConfigSupplierVO?.secret || '',
              merchantAccount: payPspItemVOList?.pspConfigSupplierVO?.merchantAccount || '',
              privateKey: payPspItemVOList?.pspConfigSupplierVO?.privateKey || '',
              publicKey: payPspItemVOList?.pspConfigSupplierVO?.publicKey || '',
              clientKey: payPspItemVOList?.pspConfigSupplierVO?.clientKey || '',
              paymentAccount: payPspItemVOList?.pspConfigSupplierVO?.paymentAccount || '',
              environment: payPspItemVOList?.pspConfigSupplierVO?.environment || '',
              checkoutApiPrefix: payPspItemVOList?.pspConfigSupplierVO?.checkoutApiPrefix || '',
              classicPaymentApiPrefix: payPspItemVOList?.pspConfigSupplierVO?.classicPaymentApiPrefix || ''
            }),
            payPspItemSaveRequest: Object.assign({
              id:
                payPspItemVOList.pspConfigSupplierVO &&
                  payPspItemVOList.pspConfigSupplierVO.pspItemId
                  ? payPspItemVOList.pspConfigSupplierVO.pspItemId
                  : payPspItemVOList.id,
              isOpen: payPspItemVOList.isOpen,
              isDisplay: payPspItemVOList.isDisplay,
              isTwoStages: payPspItemVOList.isTwoStages,
              maxAmount: payPspItemVOList.maxAmount,
              pspItemCardTypeSaveRequestList: payPspItemVOList.payPspItemCardTypeVOList,
              supportSubscription: payPspItemVOList.supportSubscription
            })
          };
        }
      } else {
        params = {
          payPspItemSaveRequest: Object.assign({
            id:
              payPspItemVOList.pspConfigSupplierVO && payPspItemVOList.pspConfigSupplierVO.pspItemId
                ? payPspItemVOList.pspConfigSupplierVO.pspItemId
                : payPspItemVOList.id,
            isOpen: payPspItemVOList.isOpen,
            maxAmount: payPspItemVOList.maxAmount,
            supportSubscription: payPspItemVOList.supportSubscription
          })
        };
      }
      if (!errs) {
        save(params);
      }
    });
  };
}
export default Form.create()(PaymentModal);

// {/* max amount input */}
const MaxAmountInput = ({ getFieldDecorator, item, onFormChange, formKey }) => {
  return (
    <Col span={24}>
      <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.maxAmount" />}>
        {getFieldDecorator(item.id + 'maxAmount', {
          initialValue: item.maxAmount
        })(
          <Input
            onChange={(e) => {
              onFormChange({
                id: formKey,
                field: 'maxAmount',
                value: e.target.value
              });
            }}
          />
        )}
      </FormItem>
    </Col>
  );
};
