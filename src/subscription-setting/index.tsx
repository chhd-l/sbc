import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, SelectGroup } from 'qmkit';
import {
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Select,
  Radio,
  Alert,
  InputNumber,
  Tabs,
  Spin,
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage,injectIntl } from 'react-intl';
import './index.css'

const FormItem = Form.Item;
 class Subscription extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Subscription.Setting" />,
      settingForm: {
        newOrdersId: null,
        newOrdersStatus: 0,
        newOrdersValue: 0,
        cardExpirationId: null,
        cardExpirationStatus: 0,
        cardExpirationValue: 0,
        cardExpirationTempValues:[],
        cardExpirationValues:[],
        switchProductId:null,
        switchProductStatus:0,
        switchProductValue:0,
        emailReminderId:null,
        emailReminderStatus:0,
        emailReminderValue:0,
        emailPaymentId:null,
        emailPaymentStatus:0,
        emailpaymentValue:0,
      },
      cardExpirationList:[],
      loading:false,
    };
  }
  componentDidMount() {
    let cardExpirationList=[];
    for(let i=0;i<15;i++){
      cardExpirationList.push({name:i+1,value:String(i+1)})
    }
    this.setState({cardExpirationList:cardExpirationList})
    this.getSettingConfig();
  }
  settingFormChange = ({ field, value }) => {
    let data = this.state.settingForm;
    data[field] = value;
    this.setState({
      settingForm: data
    });
  };
  getSettingConfig = () => {
    this.setState({
      loading:true
    })
    webapi
      .getSettingConfig()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { settingForm } = this.state;
          let newOrderConfig = res.context.find((item) => {
            return item.configType === 'subscription_new_order_send_email';
          });
          let cardExpirationConfig = res.context.find((item) => {
            return item.configType === 'subscription_tied_card_failure';
          });
          let switchProductConfig = res.context.find((item) => {
            return item.configType === 'subscription_next_life_stage';
          });
          let emailReminderConfig = res.context.find((item) => {
            return item.configType === 'subscription_inventory_shortage_error_number';
          });
          let emailPaymentConfig = res.context.find((item) => {
            return item.configType === 'subscription_payment_failure_error_number';
          });
          if (newOrderConfig) {
            settingForm.newOrdersId = newOrderConfig.id;
            settingForm.newOrdersStatus = newOrderConfig.status;
            settingForm.newOrdersValue = newOrderConfig.context;
          }
          if (cardExpirationConfig) {
            settingForm.cardExpirationId = cardExpirationConfig.id;
            settingForm.cardExpirationStatus = cardExpirationConfig.status;
            settingForm.cardExpirationValues = cardExpirationConfig.context.split(',');
            settingForm.cardExpirationTempValues = settingForm.cardExpirationValues;
          }
          if (switchProductConfig) {
            settingForm.switchProductId = switchProductConfig.id;
            settingForm.switchProductStatus = switchProductConfig.status;
            settingForm.switchProductValue = switchProductConfig.context;
          }
          if (emailReminderConfig) {
            settingForm.emailReminderId = emailReminderConfig.id;
            settingForm.emailReminderStatus = emailReminderConfig.status;
            settingForm.emailReminderValue = emailReminderConfig.context;
          }
          if (emailPaymentConfig) {
            settingForm.emailPaymentId = emailPaymentConfig.id;
            settingForm.emailPaymentStatus = emailPaymentConfig.status;
            settingForm.emailPaymentValue = emailPaymentConfig.context;
          }
          this.setState({
            settingForm,
            loading:false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading:false
        })
      });
  };
  updateSetting = () => {
    const { settingForm } = this.state;
    let cardExpirationValue='';
    for(let i=0;i<settingForm.cardExpirationValues.length;i++){
      if(i==0){
        cardExpirationValue=settingForm.cardExpirationValues[i]
      }else{
        cardExpirationValue +=','+settingForm.cardExpirationValues[i]
      }
    }
    let params = {
      requestList: [
        {
          context: settingForm.newOrdersValue,
          id: settingForm.newOrdersId,
          status: settingForm.newOrdersStatus ? 1 : 0
        },
        {
          context: cardExpirationValue,
          id: settingForm.cardExpirationId,
          status: settingForm.cardExpirationStatus ? 1 : 0
        },
        {
          context: settingForm.switchProductValue,
          id: settingForm.switchProductId,
          status: settingForm.switchProductStatus ? 1 : 0
        },
        {
          context: settingForm.emailReminderValue,
          id: settingForm.emailReminderId,
          status: settingForm.emailReminderStatus ? 1 : 0
        },
        {
          context: settingForm.emailPaymentValue,
          id: settingForm.emailPaymentId,
          status: settingForm.emailPaymentStatus ? 1 : 0
        }
      ]
    };
    this.setState({
      loading:true
    })
    webapi
      .updateSetting(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success((window as any).RCi18n({id:'Subscription.OperationSuccessful'}));
          this.setState({
            loading:false
          })
        }
      })
      .catch((err) => {
        this.setState({
          loading:false
        })
      });
  };
  render() {
    const { title, settingForm,cardExpirationList } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
            <FormItem label={<FormattedMessage id="Subscription.RemindOfNewOrders" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.newOrdersStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'newOrdersStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.newOrdersStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.newOrdersValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'newOrdersValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.Days1" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.RemindOfCardExpiration" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.cardExpirationStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'cardExpirationStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.cardExpirationStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <span onMouseDown={(e) => { e.preventDefault(); return false; }}>
                        <Select
                          mode="multiple"
                          ref="cardSelect"
                          showArrow={true}
                          maxTagPlaceholder={()=>{return null}}
                          style={{width:90}}
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <div style={{display:'flex',width:'100%',justifyContent:'center'}}>
                                <Button type="primary" onClick={(e)=>
                                {
                                  const cardSelect=this.refs.cardSelect as any;
                                  this.settingFormChange({
                                    field: 'cardExpirationValues',
                                    value: settingForm.cardExpirationTempValues
                                  })
                                  cardSelect.blur()
                                }
                                }>Save</Button>
                              </div>
                            </div>
                          )}
                          value={settingForm.cardExpirationTempValues}
                          maxTagCount={0}
                          maxTagTextLength={0}
                          onChange={(value) =>this.settingFormChange({
                            field: 'cardExpirationTempValues',
                            value: value
                          })}
                        >
                          {cardExpirationList.map((item)=>(
                            <Select.Option value={item.value}>{item.name}</Select.Option>
                          ))}
                        </Select>
                      </span>
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.Days2" />
                      </span>
                    </div>
                    {settingForm.cardExpirationValues.length>0?(
                      <div className="card-tags-list">
                        {settingForm.cardExpirationValues.map((item)=>(
                          <div className="card-tags" >
                            {item}<span  className="close_search_errmsg" onClick={(e)=>{
                            const tags = settingForm.cardExpirationValues.filter(tag => tag !== item);
                            this.settingFormChange({
                              field: 'cardExpirationValues',
                              value: tags
                            })
                            this.settingFormChange({
                              field: 'cardExpirationTempValues',
                              value: tags
                            })
                          }}/>
                          </div>))}
                      </div>
                    ):null}
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.ReminderSwitchProduct" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.switchProductStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'switchProductStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.switchProductStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.switchProductValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'switchProductValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.ReminderSwitchProductDesc" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.EmailReminderIntervals" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.emailReminderStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'emailReminderStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.emailReminderStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.emailReminderValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'emailReminderValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.EmailReminderIntervalsDesc" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.emailPaymentStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'emailPaymentStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.emailPaymentStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.emailPaymentValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'emailPaymentValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.EmailPaymentIntervalsDesc" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>
          </Form>
        </div>
        <div className="bar-button">
          <Button type="primary" shape="round" style={{ marginRight: 10 }} onClick={() => this.updateSetting()}>
            {<FormattedMessage id="Subscription.save" />}
          </Button>
        </div>
      </Spin>
    );
  }
}

const styles = {
  inputStyle: {
    display: 'inline-block',
    marginLeft: '20px'
  },
  tipsStyle: {
    fontSize: 16,
    lineHeight: 1,
    margin: '20px 0 10px 0'
  }
} as any;
export default injectIntl(Subscription)
