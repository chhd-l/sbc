import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, Menu, Dropdown, Icon, DatePicker, Row, Col } from 'antd';
import { noop, ExportModal, Const, AuthWrapper, checkAuth, Headline, SelectGroup } from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { message } from 'antd';
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
      buyerOptions: 'buyerName',
      numberSelect: 'orderNumber',
      statusSelect: 'paymentStatus',
      recommenderSelect: 'recommenderName',
      id: '',
      subscribeId: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      numberSelectValue: '',
      recommenderSelectValue: '',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      },
      orderCategory: ''
    };
  }

  render() {
    const { onSearch, tab, exportModalData, onExportModalHide } = this.props.relaxProps;

    const { tradeState } = this.state;
    let hasMenu = false;
    if ((tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) || checkAuth('fOrderList004_3pl')) {
      hasMenu = true;
    }

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
          <AuthWrapper functionName="fOrderList004_3pl">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="Order.batchExport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title={<FormattedMessage id="order.orderList" />} />
        <div>
          <Form className="filter-content" layout="inline">
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

              <Col span={8} id="input-group-width">
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    {this._renderStatusSelect()}
                    {this.state.statusSelect === 'paymentStatus' ? (
                      <Select
                        style={styles.wrapper}
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
                        <Option value="">
                          <FormattedMessage id="Order.All" />
                        </Option>
                        <Option value="NOT_PAID">
                          <FormattedMessage id="Order.unpaid" />
                        </Option>
                        <Option value="UNCONFIRMED">
                          <FormattedMessage id="Order.toBeConfirmed" />
                        </Option>
                        <Option value="PAID">
                          <FormattedMessage id="Order.paid" />
                        </Option>
                        <Option value="PAYING"><FormattedMessage id="Order.Paying" /></Option>
                      </Select>
                    ) : (
                      <Select
                        value={tradeState.deliverStatus}
                        style={styles.wrapper}
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
                        <Option value="">
                          <FormattedMessage id="Order.All" />
                        </Option>
                        <Option value="NOT_YET_SHIPPED">
                          <FormattedMessage id="Order.notShipped" />
                        </Option>
                        <Option value="PART_SHIPPED">
                          <FormattedMessage id="Order.partialShipment" />
                        </Option>
                        <Option value="SHIPPED">
                          <FormattedMessage id="Order.allShipments" />
                        </Option>
                      </Select>
                    )}
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.leftLabel} disabled defaultValue={this.props.intl.formatMessage({id:'Order.OrderCategory'})} />
                    <Select
                      style={styles.wrapper}
                      defaultValue=""
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      onChange={(value) => {
                        this.setState({
                          orderCategory: value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="Order.All" />
                      </Option>
                      <Option value="SINGLE" title={this.props.intl.formatMessage({id:'Order.Singlepurchase'})}>
                        <FormattedMessage id="Order.Singlepurchase" />
                      </Option>
                      <Option value="FIRST_AUTOSHIP" title={this.props.intl.formatMessage({id:'Order.1stautoshiporder'})}>
                        <FormattedMessage id="Order.1stautoshiporder" />
                      </Option>
                      <Option value="RECURRENT_AUTOSHIP" title={this.props.intl.formatMessage({id:'Order.Recurrentorders of autoship'})}>
                        <FormattedMessage id="Order.Recurrentorders of autoship" />
                      </Option>
                    </Select>
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
              <Col span={8}>
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
              </Col>

              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const {
                        buyerOptions,
                        goodsOptions,
                        receiverSelect,
                        clinicSelect,
                        numberSelect,
                        id,
                        subscribeId,
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
                        recommenderSelectValue
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

                      const params = {
                        id: numberSelect === 'orderNumber' ? numberSelectValue : '',
                        subscribeId: numberSelect !== 'orderNumber' ? numberSelectValue : '',
                        [buyerOptions]: buyerOptionsValue,
                        tradeState: ts,
                        [goodsOptions]: goodsOptionsValue,
                        [receiverSelect]: receiverSelectValue,
                        [clinicSelect]: clinicSelectValue,
                        [recommenderSelect]: recommenderSelectValue,
                        beginTime,
                        endTime,
                        orderCategory
                      };

                      onSearch(params);
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
            <div className="handle-bar ant-form-inline filter-content">
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.consumerName'})} value="buyerName">
          <FormattedMessage id="Order.consumerName" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.consumerAccount'})} value="buyerAccount">
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.goodsOptions}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.productName'})} value="skuName">
          <FormattedMessage id="Order.productName" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.skuCode'})} value="skuNo">
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.receiverSelect}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.recipient'})} value="consigneeName">
          <FormattedMessage id="Order.recipient" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.recipientPhone'})} value="consigneePhone">
          <FormattedMessage id="Order.recipientPhone" />
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.clinicSelect}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.clinicName'})} value="clinicsName">
          <FormattedMessage id="Order.clinicName" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.clinicID'})} value="clinicsIds">
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.numberSelect}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.OrderNumber'})} value="orderNumber">
          <FormattedMessage id="Order.OrderNumber" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.subscriptionNumber'})} value="subscriptionNumber">
          <FormattedMessage id="Order.subscriptionNumber" />
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
        <Option title={this.props.intl.formatMessage({id:'Order.paymentStatus'})} value="paymentStatus">
          <FormattedMessage id="Order.paymentStatus" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.shippingStatus'})} value="shippingStatus">
          <FormattedMessage id="Order.shippingStatus" />
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.recommenderSelect}
        style={styles.label}
      >
        <Option title={this.props.intl.formatMessage({id:'Order.recommenderId'})} value="recommenderId">
          <FormattedMessage id="Order.recommenderId" />
        </Option>
        <Option title={this.props.intl.formatMessage({id:'Order.recommenderName'})} value="recommenderName">
          <FormattedMessage id="Order.recommenderName" />
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

    if (checkedIds.length == 0) {
      message.error(<FormattedMessage id="Order.pleaseSelectOrderToOperate" />);
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: <FormattedMessage id="Order.audit" />,
      content: <FormattedMessage id="Order.confirmAudit" />,
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
      byParamsTitle: <FormattedMessage id="Order.Exportfilteredorders" />,
      byIdsTitle: <FormattedMessage id="Order.Exportselectedorders" />,
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
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
    cursor: 'text'
  },
  wrapper: {
    width: 200
  }
} as any;
