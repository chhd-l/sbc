import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache } from 'qmkit';
import {
  Form,
  InputNumber,
  Select,
  Modal,
  Button,
  Radio,
  message,
  Col,
  Row,
  Popconfirm,
  Tooltip,
  Switch
} from 'antd';
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
    defaultQuantitySelected: '',
    discountDisplayTypeInfo: '',
    dailyPortion: '',
    notify_me_block: '',
    maximum_number_of_orders_per_sku: '20',
    maximum_number_of_items_per_cart: '',
    maximum_number_of_orders_sku_total: '',
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
   * ???????????????????????? ???
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
    let {
      defaultQuantitySelected,
      discountDisplayTypeInfo,
      dailyPortion,
      notify_me_block,
      maximum_number_of_orders_per_sku,
      maximum_number_of_items_per_cart,
      maximum_number_of_orders_sku_total
    } = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_CONFIG) || '{}');
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
      defaultQuantitySelected,
      discountDisplayTypeInfo,
      dailyPortion,
      notify_me_block,
      language,
      purchaseType,
      basePricePDPShowedFlag,
      priceDisplayMethod,
      maximum_number_of_items_per_cart,
      maximum_number_of_orders_per_sku,
      maximum_number_of_orders_sku_total
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
      content: RCi18n({ id: 'Product.Areyousuretodelete' }),
      onOk() {
        _this.deleteDict(item, type);
      },
      onCancel() {}
    });
  }

  onFinish = (e: any) => {
    e.preventDefault();
    const { disabled } = this.state;

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        values.basePricePDPShowedFlag = values.basePricePDPShowedFlag ? 1 : 0;
        values.dailyPortion = values.dailyPortion ? '1' : '0';
        values.notify_me_block = values.notify_me_block ? '1' : '0';
        const res: any = await defaultProductSetting({
          ...values,
          systemConfigs: [
            {
              configName: 'defaultQuantitySelected',
              context: values.defaultQuantitySelected
            },
            {
              configName: 'discountDisplayTypeInfo',
              context: values.discountDisplayTypeInfo
            },
            {
              configName: 'dailyPortion',
              context: values.dailyPortion
            },
            {
              configName: 'notify_me_block',
              context: values.notify_me_block
            },
            {
              configName: 'maximum_number_of_orders_per_sku',
              context: `${values.maximum_number_of_orders_per_sku}`
            },
            {
              configName: 'maximum_number_of_orders_sku_total',
              context: `${values.maximum_number_of_orders_sku_total}`
            }
          ]
        });
        this.setState({ loading: false });
        if (res.res.code === Const.SUCCESS_CODE) {
          message.success(res.res.message);
          let obj = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
          sessionStorage.setItem(
            cache.PRODUCT_SALES_SETTING,
            JSON.stringify({ ...obj, ...values })
          );
          sessionStorage.setItem(
            cache.PRODUCT_SALES_CONFIG,
            JSON.stringify({
              defaultQuantitySelected: values.defaultQuantitySelected,
              discountDisplayTypeInfo: values.discountDisplayTypeInfo,
              dailyPortion: values.dailyPortion,
              notify_me_block: values.notify_me_block,
              maximum_number_of_orders_per_sku: `${values.maximum_number_of_orders_per_sku}`,
              maximum_number_of_orders_sku_total: `${values.maximum_number_of_orders_sku_total}`
            })
          );
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
      defaultQuantitySelected,
      discountDisplayTypeInfo,
      dailyPortion,
      options,
      optionsClub,
      optionsIndividual,
      language,
      purchaseType,
      basePricePDPShowedFlag,
      priceDisplayMethod,
      maximum_number_of_orders_per_sku,
      maximum_number_of_items_per_cart,
      maximum_number_of_orders_sku_total,
      notify_me_block
    } = this.state;

    return (
      <div style={styles.container}>
        <BreadCrumb />
        <div style={styles.formContainer}>
          <Form
            name="complex"
            onSubmit={this.onFinish}
            labelAlign="right"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.Defaultpurchasetype" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              {getFieldDecorator('defaultPurchaseType', {
                initialValue: defaultPurchaseType,
                rules: [
                  {
                    required: true,
                    message: RCi18n({ id: 'Product.PleaseSelectPurchaseType' }),
                    validator: (rule, value, callback) => {
                      const bool = purchaseType.filter((item) => value === item.id);
                      if (bool.length === 0) {
                        this.setState({ defaultPurchaseType: 0 });
                        callback(RCi18n({ id: 'Product.PleaseSelectPurchaseType' }));
                      } else {
                        callback();
                      }
                    }
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
                  <FormattedMessage id="Product.Defaultautoshipfrequency" />
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
                        optionLabelProp="label"
                        placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                        style={{ width: 220 }}
                      >
                        {options.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                            >
                              <span>{item.name}</span>

                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: '#fff',
                                  height: '90vh',
                                  padding: '5px 12px',
                                  position: 'absolute',
                                  right: -10,
                                  top: -5
                                }}
                              >
                                {/* <Popconfirm placement="topLeft" title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionFrequencyId')} okText="Confirm" cancelText="Cancel">
                              <Tooltip placement="top" title="Delete">
                                <a>
                                  <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                </a>
                              </Tooltip>
                            </Popconfirm> */}
                                <a
                                  onClick={(e) =>
                                    this.showConfirm(item, 'defaultSubscriptionFrequencyId')
                                  }
                                >
                                  <span
                                    className="icon iconfont iconDelete"
                                    style={{ fontSize: 15 }}
                                  />
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
                  <Button
                    type="primary"
                    size="default"
                    onClick={this.showModal}
                    disabled={disabled}
                  >
                    <FormattedMessage id="Product.Addnewfrequency" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={
                <span className="ant-form-item-required" style={{ color: '#666' }}>
                  <FormattedMessage id="Product.Defaultclubfrequency" />
                </span>
              }
              style={{
                marginBottom: 0,
                display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block'
              }}
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
                      <Select
                        disabled={disabled}
                        optionLabelProp="label"
                        placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                        style={{ width: 220 }}
                      >
                        {optionsClub.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                            >
                              <span>{item.name}</span>

                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: '#fff',
                                  padding: '5px 12px',
                                  position: 'absolute',
                                  right: -10,
                                  top: -5
                                }}
                              >
                                {/* <Popconfirm placement="right" style={{zIndex:9999999}} title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionClubFrequencyId')} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a>
                                    <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                  </a>
                                </Tooltip>
                              </Popconfirm> */}
                                <a
                                  onClick={(e) =>
                                    this.showConfirm(item, 'defaultSubscriptionClubFrequencyId')
                                  }
                                >
                                  <span
                                    className="icon iconfont iconDelete"
                                    style={{ fontSize: 15 }}
                                  ></span>
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
                  <Button
                    type="primary"
                    size="default"
                    onClick={this.showClubModal}
                    disabled={disabled}
                  >
                    <FormattedMessage id="Product.Addnewfrequency" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.DefaultIndividualfrequency" />
                </span>
              }
              style={{
                marginBottom: 0,
                display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block'
              }}
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
                        optionLabelProp="label"
                        placeholder={RCi18n({ id: 'Product.PleaseSelectSubscriptionFrequency' })}
                        style={{ width: 220 }}
                      >
                        {optionsIndividual.map((item) => (
                          <Option key={item.id} value={item.id} label={item.name}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                            >
                              <span>{item.name}</span>

                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: '#fff',
                                  padding: '5px 12px',
                                  position: 'absolute',
                                  right: -10,
                                  top: -5
                                }}
                              >
                                {/* <Popconfirm placement="right" style={{zIndex:9999999}} title="Are you sure you want to delete this frequency?" onConfirm={(e) => this.deleteDict(item,'defaultSubscriptionClubFrequencyId')} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a>
                                    <span className="icon iconfont iconDelete" style={{ fontSize: 15 }}></span>
                                  </a>
                                </Tooltip>
                              </Popconfirm> */}
                                <a
                                  onClick={(e) =>
                                    this.showConfirm(
                                      item,
                                      'defaultSubscriptionIndividualFrequencyId'
                                    )
                                  }
                                >
                                  <span
                                    className="icon iconfont iconDelete"
                                    style={{ fontSize: 15 }}
                                  />
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
                  <Button
                    type="primary"
                    size="default"
                    onClick={this.showIndividualModal}
                    disabled={disabled}
                  >
                    <FormattedMessage id="Product.Addnewfrequency" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.PriceDisplayMethod" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              {getFieldDecorator('priceDisplayMethod', {
                initialValue: priceDisplayMethod || 0,
                rules: [
                  {
                    required: true,
                    message: RCi18n({ id: 'Product.PleaseSelectPriceDisplayMethod' })
                  }
                ]
              })(
                <Select
                  disabled={disabled}
                  optionLabelProp="label"
                  placeholder={RCi18n({ id: 'Product.PleaseSelectPriceDisplayMethod' })}
                  style={{ width: 220 }}
                >
                  {[
                    'From the lowest to highest',
                    'Above the lowest',
                    'Lowest one-off and subscription price'
                  ].map((item, index) => (
                    <Option key={index} title={item} value={index} label={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.BasePriceShowedInPDP" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
              required
            >
              {getFieldDecorator('basePricePDPShowedFlag', {
                valuePropName: 'checked',
                initialValue: basePricePDPShowedFlag === 0 ? false : true
              })(<Switch />)}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.DefaultQuantitySelected" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              {getFieldDecorator('defaultQuantitySelected', {
                initialValue: defaultQuantitySelected || '0',
                rules: [
                  {
                    required: true,
                    message: RCi18n({ id: 'Product.PleaseSelectDefaultQuantitySelected' })
                  }
                ]
              })(
                <Select
                  disabled={disabled}
                  optionLabelProp="label"
                  placeholder={RCi18n({ id: 'Product.PleaseSelectDefaultQuantitySelected' })}
                  style={{ width: 220 }}
                >
                  <Option value="0" label="The smallest">
                    The smallest
                  </Option>
                  <Option value="1" label="Second smallest one">
                    Second smallest one
                  </Option>
                  <Option value="2" label="The largest">
                    The largest
                  </Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.maxOfSku" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
              required
            >
              {getFieldDecorator('maximum_number_of_orders_per_sku', {
                rules: [
                  {
                    required: true,
                    type: 'integer',
                    max: 20,
                    min: 1,
                    message: RCi18n({ id: 'Product.maxOfSkuErr' })
                  }
                ],
                initialValue: maximum_number_of_orders_per_sku
                  ? parseInt(maximum_number_of_orders_per_sku)
                  : 20
              })(<InputNumber precision={0} style={{ width: 220 }} />)}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.maxOfCart" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
              required
            >
              {getFieldDecorator('maximum_number_of_orders_sku_total', {
                rules: [
                  {
                    required: true,
                    type: 'integer',
                    max: 100,
                    min: 10,
                    message: RCi18n({ id: 'Product.maxOfCartErr' })
                  }
                ],
                initialValue: maximum_number_of_orders_sku_total
                  ? parseInt(maximum_number_of_orders_sku_total)
                  : null
              })(<InputNumber precision={0} style={{ width: 220 }} />)}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.PromotionDisplayFormat" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
            >
              {getFieldDecorator('discountDisplayTypeInfo', {
                initialValue: discountDisplayTypeInfo,
                rules: [
                  {
                    required: true,
                    message: RCi18n({ id: 'Product.PleaseSelectPromotionDisplayFormat' })
                  }
                ]
              })(
                <Select
                  disabled={disabled}
                  optionLabelProp="label"
                  placeholder={RCi18n({ id: 'Product.PleaseSelectPromotionDisplayFormat' })}
                  style={{ width: 220 }}
                >
                  <Option value="Percentage" label="Percentage">
                    Percentage
                  </Option>
                  <Option value="Amount" label="Amount">
                    Amount
                  </Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.DailyPortionTool" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
              required
            >
              {getFieldDecorator('dailyPortion', {
                valuePropName: 'checked',
                initialValue: dailyPortion === '1'
              })(<Switch />)}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: '#666' }}>
                  <FormattedMessage id="Product.notifyMeBlock" />
                </span>
              }
              style={{ display: Const.SITE_NAME === 'MYVETRECO' ? 'none' : 'block' }}
              required
            >
              {getFieldDecorator('notify_me_block', {
                valuePropName: 'checked',
                initialValue: notify_me_block === '1'
              })(<Switch />)}
            </Form.Item>

            <div className="bar-button" style={{ marginLeft: -40 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                <FormattedMessage id="Product.Save" />
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
    paddingBottom: 20
  },
  formContainer: {
    marginTop: '30px',
    marginLeft: 35
  }
} as any;
