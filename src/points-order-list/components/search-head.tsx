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
import { IList } from 'typings/globalType';

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
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;

    let hasMenu = false;
    if (checkAuth('f_points_order_list_003')) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_points_order_list_003">
            <a
              target="_blank"
              href="#"
              onClick={() => this._handleBatchExport()}
            >
              Batch operation
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title="Integral order list" />
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore={
                  <FormattedMessage id="orderNumber"></FormattedMessage>
                }
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
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label="Delivery status"
                style={{width: 190}}
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
                <Option value="">All</Option>
                <Option value="NOT_YET_SHIPPED">Unshipped</Option>
                <Option value="PART_SHIPPED">Partially shipped</Option>
                <Option value="SHIPPED">All shipped</Option>
              </SelectGroup>
            </FormItem>
           
            <FormItem>
              <RangePicker
                style={{width: 295}}
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
            <br></br>
            <FormItem>
             <p style={{ textAlign: 'center' }}> <Button
                
                type="primary"
                htmlType="submit"
                shape="round"
                icon="search"
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
                Research
              </Button>
              </p>
            </FormItem>
          </Form>

          {hasMenu && (
            <div style={{ paddingBottom: '16px' }} 
             className="ant-form-inline filter-content">
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  Batch operation <Icon type="down" />
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
        <Option value="buyerName">Client name</Option>
        <Option value="buyerAccount">Client accounts</Option>
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
        <Option value="skuName">Product name</Option>
        <Option value="skuNo">SKU code</Option>
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
        <Option value="consigneeName">Recipient</Option>
        <Option value="consigneePhone">Recipient's cell</Option>
      </Select>
    );
  };

  _handleBatchExport() {
    const { onExportByParams, onExportByIds } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: 'Export filtered orders',
      byIdsTitle: 'Export selected orders',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
