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
      buyerOptions: 'buyerName',
      id: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
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
                批量审核
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              批量导出
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
                    <Option value="PART_SHIPPED">部分发货</Option>
                    <Option value="SHIPPED">全部发货</Option>
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
                    <Option value="NOT_PAID">未付款</Option>
                    <Option value="UNCONFIRMED">待确认</Option>
                    <Option value="PAID">
                      <FormattedMessage id="paid" />
                    </Option>
                  </SelectGroup>
                )}
              </FormattedMessage>
            </FormItem>

            <FormItem>
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
                    <Option value="LITTLEPROGRAM">小程序订单</Option>
                  </SelectGroup>
                )}
              </FormattedMessage>
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
                    id,
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
                    id,
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
        <Option value="buyerAccount">客户账号</Option>
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
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
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
        <Option value="consigneePhone">收件人手机</Option>
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
      message.error('请选择需要操作的订单');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: '审核',
      content: '确认审核已选择订单？',
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
      byParamsTitle: '导出筛选出的订单',
      byIdsTitle: '导出选中的订单',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
