import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import {
  Form,
  Input,
  Select,
  Button,
  Menu,
  Dropdown,
  Icon,
  DatePicker,
  Row,
  Col
} from 'antd';
import {
  noop,
  ExportModal,
  Const,
  AuthWrapper,
  checkAuth,
  Headline,
  SelectGroup
} from 'qmkit';
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
      buyerOptions: 'buyerName',
      numberSelect: 'orderNumber',
      statusSelect: 'paymentStatus',
      id: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      numberSelectValue: '',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      }
    };
  }

  render() {
    const {
      onSearch,
      tab,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;

    const { tradeState } = this.state;
    let hasMenu = false;
    if (
      (tab.get('key') == 'flowState-INIT' &&
        checkAuth('fOrderList002_prescriber')) ||
      checkAuth('fOrderList004_prescriber')
    ) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002_prescriber">
              <a
                target="_blank"
                href="javascript:;"
                onClick={() => this._showBatchAudit()}
              >
                <FormattedMessage id="order.batchReview" />
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004_prescriber">
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
                  <Input
                    addonBefore={this._renderNumberSelect()}
                    onChange={(e) => {
                      this.setState({
                        numberSelectValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderBuyerOptionSelect()}
                    onChange={(e) => {
                      this.setState({
                        buyerOptionsValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                {/*商品名称、SKU编码*/}
                <FormItem>
                  <Input
                    addonBefore={this._renderGoodsOptionSelect()}
                    onChange={(e) => {
                      this.setState({
                        goodsOptionsValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderReceiverSelect()}
                    onChange={(e) => {
                      this.setState({
                        receiverSelectValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
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
                  <RangePicker
                    getCalendarContainer={() =>
                      document.getElementById('page-content')
                    }
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
                    shape="round"
                    htmlType="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      const {
                        buyerOptions,
                        goodsOptions,
                        receiverSelect,
                        id,
                        subscribeId,
                        numberSelect,
                        numberSelectValue,
                        buyerOptionsValue,
                        goodsOptionsValue,
                        receiverSelectValue,
                        tradeState,
                        beginTime,
                        endTime
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
                        id:
                          numberSelect === 'orderNumber'
                            ? numberSelectValue
                            : '',
                        subscribeId:
                          numberSelect !== 'orderNumber'
                            ? numberSelectValue
                            : '',
                        [buyerOptions]: buyerOptionsValue,
                        tradeState: ts,
                        [goodsOptions]: goodsOptionsValue,
                        [receiverSelect]: receiverSelectValue,
                        beginTime,
                        endTime
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
            {/* <FormItem>
              <FormattedMessage id="order.orderSource">
                {(txt) => (
                  <SelectGroup
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    defaultValue=""
                    label={txt.toString()}
                    onChange={(value) => {
                      this.setState({
                        tradeState: {
                          deliverStatus: this.state.tradeState.deliverStatus,
                          payState: this.state.tradeState.payState,
                          orderSource: value
                        }
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    <Option value="PC">
                      <FormattedMessage id="order.PCOrder" />
                    </Option>
                    <Option value="WECHAT">
                      <FormattedMessage id="order.H5Order" />
                    </Option>
                    <Option value="APP">
                      <FormattedMessage id="order.AppOrder" />
                    </Option>
                    <Option value="LITTLEPROGRAM">
                      <FormattedMessage id="order.miniProgramOrder" />
                    </Option>
                  </SelectGroup>
                )}
              </FormattedMessage>
            </FormItem> */}
          </Form>

          {hasMenu && (
            <div className="handle-bar ant-form-inline filter-content">
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  <FormattedMessage id="order.bulkOperations" />{' '}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>

        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value, a) => {
          this.setState({
            buyerOptions: value
          });
        }}
        value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option value="buyerName">
          <FormattedMessage id="consumerName" />
        </Option>
        <Option value="buyerAccount">
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
        <Option value="skuName">
          <FormattedMessage id="productName" />
        </Option>
        <Option value="skuNo">
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
        <Option value="consigneeName">
          <FormattedMessage id="recipient" />
        </Option>
        <Option value="consigneePhone">
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
        <Option value="clinicsName">
          <FormattedMessage id="clinicName" />
        </Option>
        <Option value="clinicsIds">
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
        <Option value="orderNumber">
          <FormattedMessage id="order.orderNumber" />
        </Option>
        <Option value="subscriptioNumber">
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
        <Option value="paymentStatus">
          <FormattedMessage id="order.paymentStatus" />
        </Option>
        <Option value="shippingStatus">
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
      byParamsTitle: 'Export filtered orders',
      byIdsTitle: 'Export selected order',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}

const styles = {
  label: {
    width: 160,
    textAlign: 'center'
  },
  wrapper: {
    width: 139
  }
} as any;
