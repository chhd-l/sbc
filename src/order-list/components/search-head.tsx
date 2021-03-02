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
    if ((tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) || checkAuth('fOrderList004')) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002">
              <a target="_blank" href="javascript:;" onClick={() => this._showBatchAudit()}>
                <FormattedMessage id="Order.Batchreview" />
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="Order.Batchexport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title={<FormattedMessage id="Order.Orderlist" />} />
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
                          <FormattedMessage id="Order.Unpaid" />
                        </Option>
                        {/*<Option value="UNCONFIRMED">
                          <FormattedMessage id="order.toBeConfirmed" />
                        </Option>*/}
                        <Option value="PAID">
                          <FormattedMessage id="Order.Paid" />
                        </Option>
                        <Option value="PAYING">
                          <FormattedMessage id="Order.Paying" />
                        </Option>
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
                          <FormattedMessage id="Order.notshipped" />
                        </Option>
                        <Option value="PART_SHIPPED">
                          <FormattedMessage id="Order.Partialshipment" />
                        </Option>
                        <Option value="SHIPPED">
                          <FormattedMessage id="Order.Allshipments" />
                        </Option>
                      </Select>
                    )}
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input
                      style={styles.leftLabel}
                      disabled
                      defaultValue={this.props.intl.formatMessage({
                        id: 'Order.OrderCategory'
                      })}
                    />
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
                      <Option value="SINGLE" title="Single purchase">
                        <FormattedMessage id="Order.Singlepurchase" />
                      </Option>
                      <Option value="FIRST_AUTOSHIP" title="1st autoship order">
                        <FormattedMessage id="Order.1stautoshiporder" />
                      </Option>
                      <Option value="RECURRENT_AUTOSHIP" title="Recurrent orders of autoship">
                        <FormattedMessage id="Order.Recurrentordersofautoship" />
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
                        [clinicSelect]: clinicSelect === 'clinicsName' ? (clinicSelectValue ? clinicSelectValue : '') : clinicSelectValue ? clinicSelectValue : null,
                        [recommenderSelect]: recommenderSelectValue,
                        beginTime,
                        endTime,
                        orderCategory
                      };

                      onSearch(params);
                    }}
                  >
                    <span>
                      <FormattedMessage id="Order.Search" />
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
                  <FormattedMessage id="Order.Bulkoperations" /> <Icon type="down" />
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
        <Option title="Consumer name" value="buyerName">
          <FormattedMessage id="Order.Consumername" />
        </Option>
        <Option title="Consumer account" value="buyerAccount">
          <FormattedMessage id="Order.Consumeraccount" />
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
        <Option title="Product name" value="skuName">
          <FormattedMessage id="Order.Productname" />
        </Option>
        <Option title="Sku code" value="skuNo">
          <FormattedMessage id="Order.Skucode" />
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
        <Option title="Recipient" value="consigneeName">
          <FormattedMessage id="Order.Recipient" />
        </Option>
        <Option title="Recipient phone" value="consigneePhone">
          <FormattedMessage id="Order.Recipientphone" />
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
        <Option title="Auditor name" value="clinicsName">
          <FormattedMessage id="Order.Auditorname" />
        </Option>
        <Option title="Auditor ID" value="clinicsIds">
          <FormattedMessage id="Order.AuditorID" />
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
        <Option title="Order number" value="orderNumber">
          <FormattedMessage id="Order.Ordernumber" />
        </Option>
        <Option title="Subscriptio number" value="subscriptioNumber">
          <FormattedMessage id="Order.Subscriptionumber" />
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
        <Option title="Recommender id" value="recommenderId">
          <FormattedMessage id="Order.Recommenderid" />
        </Option>
        <Option title="Recommender name" value="recommenderName">
          <FormattedMessage id="Order.Recommendername" />
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
        <Option title="Payment status" value="paymentStatus">
          <FormattedMessage id="Order.Paymentstatus" />
        </Option>
        <Option title="Shipping status" value="shippingStatus">
          <FormattedMessage id="Order.Shippingstatus" />
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
      message.error('Please select the order that needs to be operated');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'Order.Audit'
      }),
      content: this.props.intl.formatMessage({
        id: 'Order.ConfirmAudit'
      }),
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
      byParamsTitle: this.props.intl.formatMessage({ id: 'Order.Exportfilteredorders' }),
      byIdsTitle: this.props.intl.formatMessage({ id: 'Order.Exportselectedorders' }),
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
