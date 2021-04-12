import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache } from 'qmkit';
import { Form, Input, Select, Modal, Button, Radio, message, Col, Row, Popconfirm, Tooltip } from 'antd';
import ModalForm from './conponents/modal-form';
import ModalFormClub from './conponents/modal-form-club';

import { FormattedMessage } from 'react-intl';
import { querySysDictionary,delSysDictionary, defaultProductSetting, translateAddBatch, addSysDictionary } from './webapi';
const { Option } = Select;

class ProductSearchSetting extends Component<any, any> {
  state = {
    visible: false,
    visibleClub: false,
    disabled: false,
    options: [],
    optionsClub: [],
    defaultPurchaseType: '',
    defaultSubscriptionFrequencyId: '',
    defaultSubscriptionClubFrequencyId: '',
    language: [],
    purchaseType: []
  };
  onFinish = (e: any) => {
    e.preventDefault();
    const { disabled } = this.state;

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res: any = await defaultProductSetting(values);
        if (res.res.code === Const.SUCCESS_CODE) {
          message.success(res.res.message);
          let obj = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
          sessionStorage.setItem(cache.PRODUCT_SALES_SETTING, JSON.stringify({ ...obj, ...values }));
        }
      }
    });
  };
  componentDidMount() {
    this.querySysDictionary();
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleSubmit = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.querySysDictionary();
      }
    );
  };

  showClubModal = () => {
    this.setState({
      visibleClub: true
    });
  };
  handleClubCancel = () => {
    this.setState({
      visibleClub: false
    });
  };
  handleClubSubmit = () => {
    this.setState(
      {
        visibleClub: false
      },
      () => {
        this.querySysDictionary();
      }
    );
  };
  /**
   * 获取更新频率月｜ 周
   */
  async querySysDictionary() {
    const result = await Promise.all([
      querySysDictionary({ type: 'Frequency_week' }),
      querySysDictionary({ type: 'Frequency_month' }),
      querySysDictionary({ type: 'Frequency_week_club' }),
      querySysDictionary({ type: 'Frequency_month_club' }),
      querySysDictionary({ type: 'language' }),
      querySysDictionary({ type: 'purchase_type' })]);
    let { defaultPurchaseType, defaultSubscriptionFrequencyId, defaultSubscriptionClubFrequencyId, languageId } = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
    let weeks = result[0].res?.context?.sysDictionaryVOS ?? [];
    let months = result[1].res?.context?.sysDictionaryVOS ?? [];
    let weeksClub = result[2].res?.context?.sysDictionaryVOS ?? [];
    let monthsClub = result[3].res?.context?.sysDictionaryVOS ?? [];
    let languageList = result[4].res?.context?.sysDictionaryVOS ?? [];
    let purchaseType = result[5].res?.context?.sysDictionaryVOS ?? [];
    let options = [...months, ...weeks];
    let optionsClub = [...monthsClub, ...weeksClub];

    let d = languageId.split(',');
    let language = languageList.filter((item) => {
      if (d.includes(item.id.toString())) {
        return item;
      }
    });
    this.setState({
      options,
      optionsClub,
      defaultPurchaseType,
      defaultSubscriptionFrequencyId,
      defaultSubscriptionClubFrequencyId,
      language,
      purchaseType
    });
  }
  deleteDict =async (item,e) => {
    e.preventDefault()
  const {res}=  await delSysDictionary({id:item.id})
   message.success(res.message)
   this.querySysDictionary();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, defaultPurchaseType, visible, visibleClub, defaultSubscriptionFrequencyId, defaultSubscriptionClubFrequencyId, options, optionsClub, language, purchaseType } = this.state;

    return (
      <div style={styles.container}>
        <BreadCrumb />
        <div style={styles.formContainer}>
          <Form name="complex" onSubmit={this.onFinish} labelAlign="left" labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>


            <Form.Item label={<span style={{ color: '#666' }}>Default purchase type</span>}>
              {getFieldDecorator('defaultPurchaseType', {
                initialValue: defaultPurchaseType,
                rules: [
                  {
                    required: true,
                    message: 'Please select purchase type!'
                  }
                ]
              })(
                <Radio.Group disabled={disabled}>
                  {purchaseType.map((item, index) => {
                    return (
                      <Radio.Button value={item.id} key={index} style={{ textAlign: 'center' }}>
                        {item.valueEn}
                      </Radio.Button>
                    );
                  })}
                  {/* <Radio.Button value="One-off" style={{ width: 150, textAlign: 'center' }}>
                    One-off
                  </Radio.Button>
                  <Radio.Button value="Subscription" style={{ width: 150, textAlign: 'center' }}>
                    Subscription
                  </Radio.Button> */}
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span className="ant-form-item-required" style={{ color: '#666' }}>
                  Default autoship frequency
                </span>
              }
              style={{ marginBottom: 0 }}
            >
              <Row gutter={20}>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator('defaultSubscriptionFrequencyId', {
                      initialValue: defaultSubscriptionFrequencyId,
                      rules: [
                        {
                          required: true,
                          message: 'Please select subscription frequency !'
                        }
                      ],
                      onChange:(e)=>{e.preventDefault()}
                    })(
                      <Select disabled={disabled}  optionLabelProp="label" placeholder="Please select subscription frequency !" style={{ width: 180 }}>
                        {options.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                            <span >{item.name}</span>
                            <Popconfirm placement="topLeft" title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,e)} okText="Confirm" cancelText="Cancel">
                              <Tooltip placement="top" title="Delete">
                                <a>
                                  <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                                </a>
                              </Tooltip>
                            </Popconfirm>


                          </div>
                        </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button type="danger" size="default" onClick={this.showModal} disabled={disabled}>
                    Add new frequency
                </Button>
                </Col>
              </Row>


            </Form.Item>
            <Form.Item
              label={
                <span className="ant-form-item-required" style={{ color: '#666' }}>
                  Default club frequency
                </span>
              }
              style={{ marginBottom: 0 }}
            >
              <Row>
                <Col span={6}>
                  <Form.Item>

                    {getFieldDecorator('defaultSubscriptionClubFrequencyId', {
                      initialValue: defaultSubscriptionClubFrequencyId,
                      rules: [
                        {
                          required: true,
                          message: 'Please select subscription frequency !'
                        }
                      ],
                      onChange:(e)=>{e.preventDefault()}
                    })(
                      <Select disabled={disabled}
                        optionLabelProp="label"
                        placeholder="Please select subscription frequency !" style={{ width: 180 }}>
                        {optionsClub.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                              <span >{item.name}</span>
  
                              <Popconfirm placement="topLeft" title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,e)} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a>
                                    <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                                  </a>
                                </Tooltip>
                              </Popconfirm>


                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item></Col>
                <Col span={4}>
                  <Button type="danger" size="default" onClick={this.showClubModal} disabled={disabled}>
                    Add new frequency
                </Button>
                </Col>
              </Row>


            </Form.Item>

            <div className="bar-button" style={{ marginLeft: -40 }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>

        <ModalForm visible={visible} languageList={language} handleOk={this.handleSubmit} handleCancel={this.handleCancel} />
        <ModalFormClub visibleClub={visibleClub} languageList={language} handleClubOk={this.handleClubSubmit} handleClubCancel={this.handleClubCancel} />
      </div>
    );
  }
}
export default Form.create()(ProductSearchSetting);
const styles = {
  container: {
    background: 'rgb(255, 255, 255)',
    height: 'calc(100vh - 170px)'
  },
  formContainer: {
    marginTop: '30px',
    marginLeft: 35
  }
} as any;
