import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache } from 'qmkit';
import { Form, Input, Select, Modal, Button, Radio, message, Col, Row, Popconfirm, Tooltip, Switch } from 'antd';
import ModalForm from './conponents/modal-form';
import ModalFormClub from './conponents/modal-form-club';
import ModalFormIndividual from './conponents/modal-form-individual';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import {
  querySysDictionary,
  delSysDictionary,
  defaultProductSetting,
  translateAddBatch,
  addSysDictionary
} from './webapi';

const { Option } = Select;
const { confirm } = Modal;

class ProductSearchSetting extends Component<any, any> {
  state = {
    visible: false,
    visibleClub: false,
    visibleIndividual: false,
    loading: false,

    disabled: false,
    options: [],
    optionsClub: [],
    optionsIndividual: [],

    defaultPurchaseType: '',
    defaultSubscriptionFrequencyId: '',
    defaultSubscriptionClubFrequencyId: '',
    defaultSubscriptionIndividualFrequencyId: '',
    language: [],
    purchaseType: [],
    priceDisplayMethod: 0,
    basePricePDPShowedFlag: 0
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


  showIndividualModal = () => {
    this.setState({
      visibleIndividual: true
    });
  };

  handleIndividualCancel = () => {
    this.setState({
      visibleIndividual: false
    });
  };

  handleIndividualSubmit = () => {
    this.setState(
      {
        visibleIndividual: false
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
      querySysDictionary({ type: 'purchase_type' }),
      querySysDictionary({ type: 'Frequency_day' }),
      querySysDictionary({ type: 'Frequency_day_club' }),

      querySysDictionary({ type: 'Frequency_day_individual' }),
      querySysDictionary({ type: 'Frequency_week_individual' }),
      querySysDictionary({ type: 'Frequency_month_individual' })

    ]);
    let {
      defaultPurchaseType,
      defaultSubscriptionFrequencyId,
      defaultSubscriptionClubFrequencyId,
      defaultSubscriptionIndividualFrequencyId,
      languageId,
      priceDisplayMethod,
      basePricePDPShowedFlag
    } = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
    let weeks = result[0].res?.context?.sysDictionaryVOS ?? [];
    let months = result[1].res?.context?.sysDictionaryVOS ?? [];
    let weeksClub = result[2].res?.context?.sysDictionaryVOS ?? [];
    let monthsClub = result[3].res?.context?.sysDictionaryVOS ?? [];
    let languageList = result[4].res?.context?.sysDictionaryVOS ?? [];
    let purchaseType = result[5].res?.context?.sysDictionaryVOS ?? [];
    let day = result[6].res?.context?.sysDictionaryVOS ?? [];
    let dayClub = result[7].res?.context?.sysDictionaryVOS ?? [];
    /**
     * individual day week month
     **/
    let dayIndividual = result[8].res?.context?.sysDictionaryVOS ?? [];
    let weeksIndividual = result[9].res?.context?.sysDictionaryVOS ?? [];
    let monthsIndividual = result[10].res?.context?.sysDictionaryVOS ?? [];

    let options = [...months, ...weeks, ...day];
    let optionsClub = [...monthsClub, ...weeksClub, ...dayClub];
    let optionsIndividual = [...monthsIndividual, ...weeksIndividual, ...dayIndividual];

    let d = languageId.split(',');
    let language = languageList.filter((item) => {
      if (d.includes(item.id.toString())) {
        return item;
      }
    });
    this.setState({
      options,
      optionsClub,
      optionsIndividual,
      defaultPurchaseType,
      defaultSubscriptionFrequencyId,
      defaultSubscriptionClubFrequencyId,
      defaultSubscriptionIndividualFrequencyId,
      language,
      purchaseType,
      basePricePDPShowedFlag,
      priceDisplayMethod

    });
  }

  async deleteDict(item, type) {
    const { res } = await delSysDictionary({ id: item.id });
    this.querySysDictionary();
    message.success(res.message);
    this.props.form.setFieldsValue({
      [type]: null
    });

  }

  showConfirm(item, type) {
    const _this = this;
    confirm({
      content: 'Are you sure you want to delete this frequency?',
      onOk() {
        _this.deleteDict(item, type);
      },
      onCancel() {
      }
    });
  }

  onFinish = (e: any) => {
    e.preventDefault();
    const { disabled } = this.state;

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        values.basePricePDPShowedFlag = values.basePricePDPShowedFlag ? 1 : 0;
        const res: any = await defaultProductSetting(values);
        this.setState({ loading: false });
        if (res.res.code === Const.SUCCESS_CODE) {
          message.success(res.res.message);
          let obj = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
          sessionStorage.setItem(cache.PRODUCT_SALES_SETTING, JSON.stringify({ ...obj, ...values }));
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      disabled,
      defaultPurchaseType,
      visible,
      visibleClub,
      visibleIndividual,
      defaultSubscriptionFrequencyId,
      defaultSubscriptionClubFrequencyId,
      defaultSubscriptionIndividualFrequencyId,
      options,
      optionsClub,
      optionsIndividual,
      language,
      purchaseType,
      basePricePDPShowedFlag,
      priceDisplayMethod
    } = this.state;

    return (
      <div style={styles.container}>
        <BreadCrumb />
        <div style={styles.formContainer}>
          <Form
            name='complex'
            onSubmit={this.onFinish}
            labelAlign='left'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
          >


            <Form.Item
              label={<span style={{ color: '#666' }}><FormattedMessage id='Product.Defaultpurchasetype' /></span>}
              style={{display:Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block'}}
            >
              {getFieldDecorator('defaultPurchaseType', {
                initialValue: defaultPurchaseType,
                rules: [
                  {
                    required: true,
                    message: RCi18n({ id: 'Product.PleaseSelectPurchaseType' })
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
                <span className='ant-form-item-required' style={{ color: '#666' }}>
                 <FormattedMessage id='Product.Defaultautoshipfrequency' />
                </span>
              }
              style={{ marginBottom: 0 }}
            >
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item>
                    {getFieldDecorator('defaultSubscriptionFrequencyId', {
                      initialValue: defaultSubscriptionFrequencyId || '',
                      rules: [
                        {
                          required: true,
                          message: RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })
                        }
                      ]
                    })(
                      <Select
                        disabled={disabled}
                        optionLabelProp='label'
                        placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                        style={{ width: 220 }}>
                        {options.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                              <span>{item.name}</span>

                              <div onClick={e => e.stopPropagation()} style={{
                                background: '#fff',
                                height: '90vh',
                                padding: '5px 12px',
                                position: 'absolute',
                                right: -10,
                                top: -5
                              }}>
                                {/* <Popconfirm placement="topLeft" title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionFrequencyId')} okText="Confirm" cancelText="Cancel">
                              <Tooltip placement="top" title="Delete">
                                <a>
                                  <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                </a>
                              </Tooltip>
                            </Popconfirm> */}
                                <a onClick={(e) => this.showConfirm(item, 'defaultSubscriptionFrequencyId')}>
                                  <span className='icon iconfont iconDelete' style={{ fontSize: 15 }} />
                                </a>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button type='primary' size='default' onClick={this.showModal} disabled={disabled}>
                    <FormattedMessage id='Product.Addnewfrequency' />
                  </Button>
                </Col>
              </Row>


            </Form.Item>

            <Form.Item
              label={
                <span className='ant-form-item-required' style={{ color: '#666' }}>
                 <FormattedMessage id='Product.Defaultclubfrequency' />
                </span>
              }
              style={{ marginBottom: 0, display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item>

                    {getFieldDecorator('defaultSubscriptionClubFrequencyId', {
                      initialValue: defaultSubscriptionClubFrequencyId || '',
                      rules: [
                        {
                          required: true,
                          message: RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })
                        }
                      ]

                    })(
                      <Select disabled={disabled}
                              optionLabelProp='label'
                              placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                              style={{ width: 220 }}>
                        {optionsClub.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                              <span>{item.name}</span>

                              <div onClick={e => e.stopPropagation()} style={{
                                background: '#fff',
                                padding: '5px 12px',
                                position: 'absolute',
                                right: -10,
                                top: -5
                              }}>
                                {/* <Popconfirm placement="right" style={{zIndex:9999999}} title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionClubFrequencyId')} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a>
                                    <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                  </a>
                                </Tooltip>
                              </Popconfirm> */}
                                <a onClick={(e) => this.showConfirm(item, 'defaultSubscriptionClubFrequencyId')}>
                                  <span className='icon iconfont iconDelete' style={{ fontSize: 15 }}></span>
                                </a>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item></Col>
                <Col span={4}>
                  <Button type='primary' size='default' onClick={this.showClubModal} disabled={disabled}>
                    <FormattedMessage id='Product.Addnewfrequency' />
                  </Button>
                </Col>
              </Row>


            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#666' }}>
                  <FormattedMessage id='Product.DefaultIndividualfrequency' />
                </span>
              }
              style={{ marginBottom: 0, display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item>
                    {getFieldDecorator('defaultSubscriptionIndividualFrequencyId', {
                      initialValue: defaultSubscriptionIndividualFrequencyId || ''
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: RCi18n({id:'Product.PleaseSelectSubscriptionFrequency'})
                      //   }
                      // ],
                    })(
                      <Select
                        allowClear
                        disabled={disabled}
                        optionLabelProp='label'
                        placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                        style={{ width: 220 }}
                      >
                        {optionsIndividual.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                              <span>{item.name}</span>

                              <div onClick={e => e.stopPropagation()} style={{
                                background: '#fff',
                                padding: '5px 12px',
                                position: 'absolute',
                                right: -10,
                                top: -5
                              }}>
                                {/* <Popconfirm placement="right" style={{zIndex:9999999}} title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionClubFrequencyId')} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a>
                                    <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                  </a>
                                </Tooltip>
                              </Popconfirm> */}
                                <a onClick={(e) => this.showConfirm(item, 'defaultSubscriptionIndividualFrequencyId')}>
                                  <span className='icon iconfont iconDelete' style={{ fontSize: 15 }} />
                                </a>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item></Col>
                <Col span={4}>
                  <Button type='primary' size='default' onClick={this.showIndividualModal} disabled={disabled}>
                    <FormattedMessage id='Product.Addnewfrequency' />
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#666' }}>Price display method</span>}
              style={{display:Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block'}}
            >
              {getFieldDecorator('priceDisplayMethod', {
                initialValue: priceDisplayMethod || 0,
                rules: [
                  {
                    required: true,
                    message: 'Please select Price display method !'
                  }
                ]
              })(<Select disabled={disabled}
                         optionLabelProp='label'
                         placeholder='Please select Price display method !' style={{ width: 220 }}>
                {['From the lowest to highest', 'Above the lowest', 'Lowest one-off and subscription price'].map((item, index) => (
                  <Option key={index} title={item} value={index} label={item}>{item}</Option>
                ))}
              </Select>)}
            </Form.Item>


            <Form.Item
              label={<span style={{ color: '#666' }}>Base price showed in PDP</span>}
              style={{display:Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block'}}
            >
              {getFieldDecorator('basePricePDPShowedFlag', {
                valuePropName: 'checked',
                initialValue: basePricePDPShowedFlag === 0 ? false : true,
                rules: [
                  {
                    required: true,
                    message: 'Please select Base price showed in PDP !'
                  }
                ]
              })(<Switch />)}
            </Form.Item>

            <div className='bar-button' style={{ marginLeft: -40 }}>
              <Button loading={loading} type='primary' htmlType='submit'>
                <FormattedMessage id='Product.Save' />
              </Button>
            </div>
          </Form>
        </div>

        <ModalForm
          visible={visible}
          languageList={language}
          handleOk={this.handleSubmit}
          handleCancel={this.handleCancel}
        />
        <ModalFormClub
          visibleClub={visibleClub}
          languageList={language}
          handleClubOk={this.handleClubSubmit}
          handleClubCancel={this.handleClubCancel}
        />
        <ModalFormIndividual
          visible={visibleIndividual}
          languageList={language}
          handleOk={this.handleIndividualSubmit}
          handleCancel={this.handleIndividualCancel}
        />
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
