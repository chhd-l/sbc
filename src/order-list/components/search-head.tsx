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
  DatePicker
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
      id: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      clinicSelectValue: '',
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

    let hasMenu = false;
    if (
      (tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) ||
      checkAuth('fOrderList004')
    ) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002">
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
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="order.orderNumber" />}
                onChange={(e) => {
                  this.setState({
                    id: (e.target as any).value
                  });
                }}
              />
            </FormItem>

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

            <FormItem>
              <FormattedMessage id="order.shippingStatus">
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
                          deliverStatus: value,
                          payState: this.state.tradeState.payState,
                          orderSource: this.state.tradeState.orderSource
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
                  </SelectGroup>
                )}
              </FormattedMessage>
            </FormItem>

            <FormItem>
              <FormattedMessage id="order.paymentStatus">
                {(txt) => (
                  <SelectGroup
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    onChange={(value) =>
                      this.setState({
                        tradeState: {
                          deliverStatus: this.state.tradeState.deliverStatus,
                          payState: value,
                          orderSource: this.state.tradeState.orderSource
                        }
                      })
                    }
                    label={txt.toString()}
                    defaultValue=""
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
                      <FormattedMessage id="paid" />
                    </Option>
                  </SelectGroup>
                )}
              </FormattedMessage>
            </FormItem>

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

            <FormItem>
              <Input
                addonBefore={this._renderClinicSelect()}
                onChange={(e) => {
                  this.setState({
                    clinicSelectValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

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
            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const {
                    buyerOptions,
                    goodsOptions,
                    receiverSelect,
                    clinicSelect,
                    id,
                    buyerOptionsValue,
                    goodsOptionsValue,
                    receiverSelectValue,
                    clinicSelectValue,
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
                    id,
                    [buyerOptions]: buyerOptionsValue,
                    tradeState: ts,
                    [goodsOptions]: goodsOptionsValue,
                    [receiverSelect]: receiverSelectValue,
                    [clinicSelect]: clinicSelectValue,
                    beginTime,
                    endTime
                  };

                  onSearch(params);
                }}
              >
                <FormattedMessage id="search" />
              </Button>
            </FormItem>
          </Form>

          {hasMenu && (
            <div className="handle-bar">
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
        onChange={(value) => {
          this.setState({
            buyerOptions: value
          });
        }}
        value={this.state.buyerOptions}
        style={{ width: 100 }}
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
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
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
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        value={this.state.receiverSelect}
        style={{ width: 100 }}
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
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            clinicSelect: val
          })
        }
        value={this.state.clinicSelect}
        style={{ width: 100 }}
      >
        <Option value="clinicsName">
          <FormattedMessage id="clinicName" />
        </Option>
        <Option value="clinicsId">
          <FormattedMessage id="clinicID" />
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
      byParamsTitle: <FormattedMessage id="order.exportFilterOrder" />,
      byIdsTitle: <FormattedMessage id="order.exportSelectedOrder" />,
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
