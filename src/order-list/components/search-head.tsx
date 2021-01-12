import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, Menu, Dropdown, Icon, DatePicker, Row, Col } from 'antd';
import { noop, ExportModal, Const, AuthWrapper, checkAuth, Headline, SelectGroup } from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
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
      clinicSelect: 'clinicsName',
      buyerOptions: 'buyerName',
      numberSelect: 'orderNumber',
      statusSelect: 'paymentStatus',
      id: '',
      subscribeId: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      clinicSelectValue: '',
      numberSelectValue: '',
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
                <FormattedMessage id="order.batchReview" />
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="order.batchExport" />
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
                          <FormattedMessage id="all" />
                        </Option>
                        <Option value="NOT_PAID">
                          <FormattedMessage id="order.unpaid" />
                        </Option>
                        <Option value="UNCONFIRMED">
                          <FormattedMessage id="order.toBeConfirmed" />
                        </Option>
                        <Option value="PAID">
                          <FormattedMessage id="order.paid" />
                        </Option>
                        <Option value="PAYING">Paying</Option>
                      </Select>
                    ) : (
                      <Select
                        value={tradeState.deliverStatus}
                        style={styles.wrapper}
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
                          <FormattedMessage id="all" />
                        </Option>
                        <Option value="NOT_YET_SHIPPED">
                          <FormattedMessage id="order.notShipped" />
                        </Option>
                        <Option value="PART_SHIPPED">
                          <FormattedMessage id="order.partialShipment" />
                        </Option>
                        <Option value="SHIPPED">
                          <FormattedMessage id="order.allShipments" />
                        </Option>
                      </Select>
                    )}
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.leftLabel} disabled defaultValue="Order Category" />
                    <Select
                      style={styles.wrapper}
                      defaultValue=""
                      onChange={(value) => {
                        this.setState({
                          orderCategory: value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      <Option value="SINGLE" title="Single purchase">
                        Single purchase
                      </Option>
                      <Option value="FIRST_AUTOSHIP" title="1st autoship order">
                        1st autoship order
                      </Option>
                      <Option value="RECURRENT_AUTOSHIP" title="Recurrent orders of autoship">
                        Recurrent orders of autoship
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
                      const { buyerOptions, goodsOptions, receiverSelect, clinicSelect, numberSelect, id, subscribeId, buyerOptionsValue, goodsOptionsValue, receiverSelectValue, clinicSelectValue, numberSelectValue, tradeState, beginTime, endTime, orderCategory } = this.state;

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
                        beginTime,
                        endTime,
                        orderCategory
                      };

                      onSearch(params);
                    }}
                  >
                    <span>
                      <FormattedMessage id="search" />
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
                  <FormattedMessage id="order.bulkOperations" /> <Icon type="down" />
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
        value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option title="Consumer name" value="buyerName">
          <FormattedMessage id="consumerName" />
        </Option>
        <Option title="Consumer account" value="buyerAccount">
          <FormattedMessage id="consumerAccount" />
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
        value={this.state.goodsOptions}
        style={styles.label}
      >
        <Option title="Product name" value="skuName">
          <FormattedMessage id="productName" />
        </Option>
        <Option title="Sku code" value="skuNo">
          <FormattedMessage id="skuCode" />
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
        value={this.state.receiverSelect}
        style={styles.label}
      >
        <Option title="Recipient" value="consigneeName">
          <FormattedMessage id="recipient" />
        </Option>
        <Option title="Recipient phone" value="consigneePhone">
          <FormattedMessage id="recipientPhone" />
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
        value={this.state.clinicSelect}
        style={styles.label}
      >
        <Option title="Prescriber name" value="clinicsName">
          <FormattedMessage id="clinicName" />
        </Option>
        <Option title="Prescriber ID" value="clinicsIds">
          <FormattedMessage id="clinicID" />
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
        value={this.state.numberSelect}
        style={styles.label}
      >
        <Option title="Order number" value="orderNumber">
          <FormattedMessage id="order.orderNumber" />
        </Option>
        <Option title="Subscriptio number" value="subscriptioNumber">
          <FormattedMessage id="order.subscriptioNumber" />
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
        value={this.state.statusSelect}
        style={styles.label}
      >
        <Option title="Payment status" value="paymentStatus">
          <FormattedMessage id="order.paymentStatus" />
        </Option>
        <Option title="Shipping status" value="shippingStatus">
          <FormattedMessage id="order.shippingStatus" />
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
      title: <FormattedMessage id="order.audit" />,
      content: <FormattedMessage id="order.confirmAudit" />,
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
      byParamsTitle: 'Export all orders',
      byIdsTitle: 'Export selected orders',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}

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
