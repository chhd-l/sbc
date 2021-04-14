import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, Menu, Dropdown, Icon, DatePicker, Row, Col, Modal, message } from 'antd';
import { noop, ExportModal, Const, AuthWrapper, checkAuth, Headline, SelectGroup, ShippStatus, PaymentStatus, RCi18n } from 'qmkit';
// import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';

import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;

/**
 * 订单查询头
 */
@Relax
class SearchHead extends Component<any, any> {
  props: {
    intl?: any;
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      tab: IMap;
      dataList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
    intl: any;
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    tab: 'tab',
    dataList: 'dataList',
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      receiverSelect: 'consigneeName',
      clinicSelect: 'clinicsName',
      buyerOptions: 'buyerName',
      numberSelect: 'orderNumber',
      statusSelect: 'paymentStatus',
      recommenderSelect: 'recommenderName',
      id: '',
      subscribeId: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      clinicSelectValue: '',
      numberSelectValue: '',
      recommenderSelectValue: '',

      // 21/3/3 新增字段
      refillNumber: '',
      orderType: '',
      orderSource: '',
      subscriptionType: '',
      subscriptionPlanType: '',
      codeSelect: 'promotionCode',
      codeSelectValue: '',
      orderTypeList: [
        { value: 'SINGLE_PURCHASE', name: props.intl.formatMessage({ id: 'Order.Singlepurchase' }) },
        { value: 'SUBSCRIPTION', name: props.intl.formatMessage({ id: 'Order.subscription' }) },
        { value: 'MIXED_ORDER', name: props.intl.formatMessage({ id: 'Order.mixedOrder' }) }
      ],
      subscriptionPlanTypeList: [],
      subscriptionPlanTypeListClone: [
        { value: 'Cat', name: props.intl.formatMessage({ id: 'Order.cat' }) },
        { value: 'Dog', name: props.intl.formatMessage({ id: 'Order.dog' }) },
        { value: 'Cat_Dog', name: props.intl.formatMessage({ id: 'Order.Cat&Dog' }) },
        { value: 'SmartFeeder', name: props.intl.formatMessage({ id: 'Order.smartFeeder' }) }
      ],
      subscriptionTypeList: [],
      subscriptionTypeListClone: [
        { value: 'ContractProduct', name: props.intl.formatMessage({ id: 'Order.contractProduct' }), isMixed: false },
        { value: 'Club', name: props.intl.formatMessage({ id: 'Order.club' }), isMixed: false },
        { value: 'Autoship', name: props.intl.formatMessage({ id: 'Order.autoship' }), isMixed: false },
        { value: 'Autoship_Club', name: props.intl.formatMessage({ id: 'Order.Autoship&Club' }), isMixed: true },
        { value: 'Autoship_SingePurchase', name: props.intl.formatMessage({ id: 'Order.Autoship&singePurchase' }), isMixed: true },
        { value: 'Club_SingePurchase', name: props.intl.formatMessage({ id: 'Order.Club&singePurchase' }), isMixed: true },
        { value: 'Autoship_Club_SingePurchase', name: props.intl.formatMessage({ id: 'Order.Autoship&Club&singePurchase' }), isMixed: true }
      ],

      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      orderCategory: '',
      showAdvanceSearch: false,
      orderTypeSelect: 'Order type'
    };
  }
  render() {
    const { tab, exportModalData, onExportModalHide } = this.props.relaxProps;

    const { tradeState, orderType, orderSource, subscriptionType, refillNumber, subscriptionPlanType } = this.state;
    const { orderTypeList, subscriptionTypeList, subscriptionPlanTypeList, showAdvanceSearch } = this.state;
    let hasMenu = false;
    if ((tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) || checkAuth('fOrderList004')) {
      hasMenu = true;
    }
    const refillNumberList = [
      { value: 'First', name: (window as any).RCi18n({ id: 'Order.first' }) },
      { value: 'Recurrent', name: (window as any).RCi18n({ id: 'Order.recurrent' }) }
    ];

    const orderSourceList = [
      { value: 'FGS', name: (window as any).RCi18n({ id: 'Order.fgs' }) },
      { value: 'L_ATELIER_FELIN', name: (window as any).RCi18n({ id: 'Order.felin' }) }
    ];

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002">
              <a target="_blank" href="javascript:;" onClick={() => this._showBatchAudit()}>
                <FormattedMessage id="Order.batchReview" />
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="Order.batchExport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row>
          <Col span={12}>
            <Headline title={<FormattedMessage id="Order.orderList" />} />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <span style={{ color: '#e82f3d', cursor: 'pointer' }} onClick={() => this.setState({ showAdvanceSearch: !showAdvanceSearch })}>
              <FormattedMessage id="Order.AdvanceSearch" /> <Icon type={showAdvanceSearch ? 'up' : 'down'} />
            </span>
          </Col>
        </Row>
        <div>
          <Form className="filter-content" layout="inline">
            <Row>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      {this._renderNumberSelect()}
                      <Input
                        style={styles.wrapper}
                        onChange={(e) => {
                          this.setState({
                            numberSelectValue: (e.target as any).value
                          });
                        }}
                      />
                    </InputGroup>
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      {this._renderBuyerOptionSelect()}
                      <Input
                        style={styles.wrapper}
                        onChange={(e) => {
                          this.setState({
                            buyerOptionsValue: (e.target as any).value
                          });
                        }}
                      />
                    </InputGroup>
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      {this._renderReceiverSelect()}
                      <Input
                        style={styles.wrapper}
                        onChange={(e) => {
                          this.setState({
                            receiverSelectValue: (e.target as any).value
                          });
                        }}
                      />
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              {showAdvanceSearch ? (
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderOrderTypeSelect()}
                        {this.state.orderTypeSelect === 'Order type' ? (
                          <Select
                            style={styles.wrapper}
                            allowClear
                            value={orderType}
                            getPopupContainer={(trigger: any) => trigger.parentNode}
                            onChange={(value) => {
                              this.getSubscriptionType(value);
                            }}
                          >
                            {orderTypeList &&
                              orderTypeList.map((item, index) => (
                                <Option value={item.value} title={item.name} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        ) : (
                          <Select
                            style={styles.wrapper}
                            allowClear
                            value={orderSource}
                            getPopupContainer={(trigger: any) => trigger.parentNode}
                            onChange={(value) => {
                              this.setState({
                                orderSource: value
                              });
                            }}
                          >
                            {orderSourceList &&
                              orderSourceList.map((item, index) => (
                                <Option value={item.value} title={item.name} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderGoodsOptionSelect()}
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            this.setState({
                              goodsOptionsValue: (e.target as any).value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8} id="input-group-width">
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderStatusSelect()}
                        {this.state.statusSelect === 'paymentStatus' ? (
                          <Select
                            style={styles.wrapper}
                            allowClear
                            getPopupContainer={(trigger: any) => trigger.parentNode}
                            onChange={(value) =>
                              this.setState({
                                tradeState: {
                                  deliverStatus: '',
                                  payState: value,
                                  orderSource: ''
                                }
                              })
                            }
                            value={tradeState.payState}
                          >
                            {PaymentStatus.map((item) => (
                              <Option value={item.value}>{item.name}</Option>
                            ))}
                          </Select>
                        ) : (
                          <Select
                            value={tradeState.deliverStatus}
                            style={styles.wrapper}
                            allowClear
                            getPopupContainer={(trigger: any) => trigger.parentNode}
                            onChange={(value) => {
                              this.setState({
                                tradeState: {
                                  deliverStatus: value,
                                  payState: '',
                                  orderSource: ''
                                }
                              });
                            }}
                          >
                            {ShippStatus.map((item) => (
                              <Option value={item.value}>{item.name}</Option>
                            ))}
                          </Select>
                        )}
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.leftLabel} disabled defaultValue={(window as any).RCi18n({ id: 'Order.subscriptionType' })} />
                        <Select
                          style={styles.wrapper}
                          dropdownMatchSelectWidth={false}
                          allowClear
                          value={subscriptionType}
                          disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          onChange={(value) => {
                            this.setState(
                              {
                                subscriptionType: value
                              },
                              () => {
                                this.getSubsrciptionPlanType(value);
                              }
                            );
                          }}
                        >
                          {subscriptionTypeList &&
                            subscriptionTypeList.map((item, index) => (
                              <Option value={item.value} title={item.name} key={index}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderCodeSelect()}
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            this.setState({
                              codeSelectValue: (e.target as any).value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>
                  {/* <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderRecommenderSelect()}
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            this.setState({
                              recommenderSelectValue: (e.target as any).value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col> */}
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.leftLabel} title={(window as any).RCi18n({ id: 'Order.subscriptionOrderTime' })} disabled defaultValue={(window as any).RCi18n({ id: 'Order.subscriptionOrderTime' })} />
                        <Select
                          style={styles.wrapper}
                          allowClear
                          value={refillNumber}
                          disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          onChange={(value) => {
                            this.setState({
                              refillNumber: value
                            });
                          }}
                        >
                          {refillNumberList &&
                            refillNumberList.map((item, index) => (
                              <Option value={item.value} title={item.name} key={index}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.leftLabel} title={(window as any).RCi18n({ id: 'Order.subscriptionPlanType' })} disabled defaultValue={(window as any).RCi18n({ id: 'Order.subscriptionPlanType' })} />
                        <Select
                          style={styles.wrapper}
                          allowClear
                          value={subscriptionPlanType}
                          disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          onChange={(value) => {
                            this.setState({
                              subscriptionPlanType: value
                            });
                          }}
                        >
                          {subscriptionPlanTypeList &&
                            subscriptionPlanTypeList.map((item, index) => (
                              <Option value={item.value} title={item.name} key={index}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        {this._renderClinicSelect()}
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            let a = e.target.value ? e.target.value.split(',') : null;

                            this.setState({
                              clinicSelectValue: this.state.clinicSelect == 'clinicsName' ? (e.target as any).value : a
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8} id="Range-picker-width">
                    <FormItem>
                      <RangePicker
                        className="rang-picker-width"
                        style={styles.formItemStyle}
                        onChange={(e) => {
                          let beginTime = '';
                          let endTime = '';
                          if (e.length > 0) {
                            beginTime = e[0].format(Const.DAY_FORMAT);
                            endTime = e[1].format(Const.DAY_FORMAT);
                          }
                          this.setState({ beginTime: beginTime, endTime: endTime });
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              ) : null}

              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center' }}
                    onClick={(e) => {
                      this.handleSearch(e);
                    }}
                  >
                    <span>
                      <FormattedMessage id="Order.search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          {hasMenu && (
            <div className="handle-bar">
              <Dropdown overlay={menu} placement="bottomLeft" getPopupContainer={() => document.getElementById('page-content')}>
                <Button>
                  <FormattedMessage id="Order.bulkOperations" /> <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>

        <ExportModal data={exportModalData} onHide={onExportModalHide} handleByParams={exportModalData.get('exportByParams')} handleByIds={exportModalData.get('exportByIds')} />
      </div>
    );
  }

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        onChange={(value, a) => {
          this.setState({
            buyerOptions: value
          });
        }}
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.consumerName' })} value="buyerName">
          <FormattedMessage id="Order.consumerName" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.consumerAccount' })} value="buyerAccount">
          <FormattedMessage id="Order.consumerAccount" />
        </Option>
      </Select>
    );
  };

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.goodsOptions}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.productName' })} value="skuName">
          <FormattedMessage id="Order.productName" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.skuCode' })} value="skuNo">
          <FormattedMessage id="Order.skuCode" />
        </Option>
      </Select>
    );
  };

  _renderReceiverSelect = () => {
    return (
      <Select
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.receiverSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.recipient' })} value="consigneeName">
          <FormattedMessage id="Order.recipient" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.recipientPhone' })} value="consigneePhone">
          <FormattedMessage id="Order.recipientPhone" />
        </Option>
      </Select>
    );
  };

  _renderOrderTypeSelect = () => {
    return (
      <Select
        onChange={(val) =>
          this.setState({
            orderTypeSelect: val
          })
        }
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.orderTypeSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.orderType' })} value="Order type">
          <FormattedMessage id="Order.orderType" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.orderSource' })} value="Order source">
          <FormattedMessage id="Order.orderSource" />
        </Option>
      </Select>
    );
  };

  _renderClinicSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            clinicSelect: val
          });
        }}
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.clinicSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.clinicName' })} value="clinicsName">
          <FormattedMessage id="Order.clinicName" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.clinicID' })} value="clinicsIds">
          <FormattedMessage id="Order.clinicID" />
        </Option>
      </Select>
    );
  };
  _renderNumberSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            numberSelect: val
          });
        }}
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.numberSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.OrderNumber' })} value="orderNumber">
          <FormattedMessage id="Order.OrderNumber" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.subscriptionNumber' })} value="subscriptionNumber">
          <FormattedMessage id="Order.subscriptionNumber" />
        </Option>
      </Select>
    );
  };
  _renderRecommenderSelect = () => {
    return (
      <Select
        onChange={(val) =>
          this.setState({
            recommenderSelect: val
          })
        }
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.recommenderSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.recommenderId' })} value="recommenderId">
          <FormattedMessage id="Order.recommenderId" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.recommenderName' })} value="recommenderName">
          <FormattedMessage id="Order.recommenderName" />
        </Option>
      </Select>
    );
  };

  _renderStatusSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            statusSelect: val
          });
        }}
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.statusSelect}
        style={styles.label}
      >
        <Option title={(window as any).RCi18n({ id: 'Order.paymentStatus' })} value="paymentStatus">
          <FormattedMessage id="Order.paymentStatus" />
        </Option>
        <Option title={(window as any).RCi18n({ id: 'Order.shippingStatus' })} value="shippingStatus">
          <FormattedMessage id="Order.shippingStatus" />
        </Option>
      </Select>
    );
  };

  /**
   * 批量审核确认提示
   * @private
   */
  _showBatchAudit = () => {
    const { onBatchAudit, dataList } = this.props.relaxProps;
    const checkedIds = dataList
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();
    const mess = (window as any).RCi18n({ id: 'Order.pleaseSelectOrderToOperate' });
    if (checkedIds.length == 0) {
      message.error(mess);
      return;
    }

    const confirm = Modal.confirm;
    const title = (window as any).RCi18n({ id: 'Order.audit' });
    const content = (window as any).RCi18n({ id: 'Order.confirmAudit' });
    confirm({
      title: title,
      content: content,
      onOk() {
        onBatchAudit();
      },
      onCancel() {}
    });
  };

  _handleBatchExport() {
    const { onExportByParams, onExportByIds } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: (window as any).RCi18n({ id: 'Order.Exportfilteredorders' }),
      byIdsTitle: (window as any).RCi18n({ id: 'Order.Exportselectedorders' }),
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }

  _renderCodeSelect = () => {
    const codeTypeList = [
      { value: 'promotionCode', name: (window as any).RCi18n({ id: 'Order.promotionCode' }) },
      { value: 'couponCode', name: (window as any).RCi18n({ id: 'Order.couponCode' }) }
    ];
    return (
      <Select
        onChange={(val) =>
          this.setState({
            codeSelect: val
          })
        }
        getPopupContainer={() => document.getElementById('page-content')}
        value={this.state.codeSelect}
        style={styles.label}
      >
        {codeTypeList &&
          codeTypeList.map((item, index) => (
            <Option value={item.value} title={item.name} key={index}>
              {item.name}
            </Option>
          ))}
      </Select>
    );
  };
  getSubscriptionType = (orderType) => {
    const { subscriptionTypeListClone } = this.state;
    this.setState({
      orderType: orderType,
      subscriptionType: '',
      subscriptionPlanType: '',
      refillNumber: ''
    });
    let newSubscriptionTypeList = [];
    if (orderType === 'SUBSCRIPTION') {
      newSubscriptionTypeList = subscriptionTypeListClone.filter((x) => x.isMixed === false);
    }
    if (orderType === 'MIXED_ORDER') {
      newSubscriptionTypeList = subscriptionTypeListClone.filter((x) => x.isMixed === true);
    }
    this.setState({
      subscriptionTypeList: newSubscriptionTypeList
    });
  };
  getSubsrciptionPlanType = (subsriptionType) => {
    const { subscriptionPlanTypeListClone } = this.state;
    let newSubscriptionPlanTypeList = [];
    if (subsriptionType === 'ContractProduct') {
      newSubscriptionPlanTypeList = subscriptionPlanTypeListClone.filter((item) => item.value === 'SmartFeeder');
    } else if (subsriptionType.indexOf('Club') >= 0) {
      newSubscriptionPlanTypeList = subscriptionPlanTypeListClone.filter((item) => item.value === 'Cat_Dog' || item.value === 'Dog' || item.value === 'Cat');
    }
    this.setState({
      subscriptionPlanTypeList: newSubscriptionPlanTypeList
    });
  };
  handleSearch = (e) => {
    const { onSearch } = this.props.relaxProps;
    e.preventDefault();
    const {
      buyerOptions,
      goodsOptions,
      receiverSelect,
      clinicSelect,
      numberSelect,
      buyerOptionsValue,
      goodsOptionsValue,
      receiverSelectValue,
      clinicSelectValue,
      numberSelectValue,
      tradeState,
      beginTime,
      endTime,
      orderCategory,
      recommenderSelect,
      recommenderSelectValue,
      refillNumber,
      orderType,
      orderSource,
      subscriptionType,
      subscriptionPlanType,
      codeSelect,
      codeSelectValue
    } = this.state;

    const ts = {} as any;
    if (tradeState.deliverStatus) {
      ts.deliverStatus = tradeState.deliverStatus;
    }

    if (tradeState.payState) {
      ts.payState = tradeState.payState;
    }

    if (tradeState.orderSource) {
      ts.orderSource = tradeState.orderSource;
    }

    // const params = {
    //   id: numberSelect === 'orderNumber' ? numberSelectValue : '',
    //   subscribeId: numberSelect !== 'orderNumber' ? numberSelectValue : '',
    //   [buyerOptions]: buyerOptionsValue,
    //   tradeState: ts,
    //   [goodsOptions]: goodsOptionsValue,
    //   [receiverSelect]: receiverSelectValue,
    //   [clinicSelect]: clinicSelect === 'clinicsName' ? (clinicSelectValue ? clinicSelectValue : '') : clinicSelectValue ? clinicSelectValue : null,
    //   [recommenderSelect]: recommenderSelectValue,
    //   beginTime,
    //   endTime,
    //   orderCategory,

    //   refillNumber,
    //   orderType,
    //   orderSource,
    //   subscriptionType,
    //   subscriptionPlanType,
    //   [codeSelect]:codeSelectValue,

    // };
    const params = {
      id: numberSelect === 'orderNumber' ? numberSelectValue : '',

      subscribeId: numberSelect !== 'orderNumber' ? numberSelectValue : '',
      [buyerOptions]: buyerOptionsValue,
      [receiverSelect]: receiverSelectValue,
      subscriptionRefillType: refillNumber,
      [goodsOptions]: goodsOptionsValue,
      orderType,
      orderSource,
      tradeState: ts,
      subscriptionTypeQuery: subscriptionType,
      beginTime,
      endTime,
      [recommenderSelect]: recommenderSelectValue,
      [clinicSelect]: clinicSelectValue,
      subscriptionPlanType,
      [codeSelect]: codeSelectValue
    };

    onSearch(params);
  };
}

export default injectIntl(SearchHead);

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  wrapper: {
    width: 200
  }
} as any;
