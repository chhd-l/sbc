import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, Dropdown, Form, Icon, Input, Menu, Modal, Select, DatePicker, message, Row, Col } from 'antd';
import { ExportModal, Headline, noop, Const, AuthWrapper, checkAuth } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
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
      onBatchReceive: Function;
      onSearchFormChange: Function;
      selected: IList;
      exportModalData: IMap;
      onExportModalChange: Function;
      onExportModalHide: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    onBatchReceive: noop,
    onSearchFormChange: noop,
    selected: 'selected',
    exportModalData: 'exportModalData',
    onExportModalChange: noop,
    onExportModalHide: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    tab: 'tab'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      buyerOptions: 'buyerName',
      consigneeOptions: 'consigneeName',
      rid: '',
      tid: '',
      skuName: '',
      skuNo: '',
      buyerName: '',
      buyerAccount: '',
      consigneeName: '',
      consigneePhone: '',
      beginTime: '',
      endTime: ''
    };
  }

  render() {
    const { exportModalData, onExportModalHide, tab } = this.props.relaxProps;
    const tabKey = tab.get('key');
    let hasMenu = (tabKey == 'flowState-INIT' && checkAuth('rolf002')) || (tabKey == 'flowState-DELIVERED' && checkAuth('rolf004')) || checkAuth('rolf006');
    const batchMenu = (
      <Menu>
        {/* {tabKey == 'flowState-INIT' ? (
          <Menu.Item>
            <AuthWrapper functionName="rolf002">
              <a href="#" onClick={() => this._handleBatchAudit()}>
                批量审核
              </a>
            </AuthWrapper>
          </Menu.Item>
        ) : null}
        {tabKey == 'flowState-DELIVERED' ? (
          <Menu.Item>
            <AuthWrapper functionName="rolf004">
              <a href="#" onClick={() => this._handleBatchReceive()}>
                批量收货
              </a>
            </AuthWrapper>
          </Menu.Item>
        ) : null} */}
        <Menu.Item>
          <AuthWrapper functionName="rolf006">
            <a href="#" onClick={() => this._handleBatchExport()}>
              Bulk export
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Headline title={<FormattedMessage id="refundList" />} />

        <div>
          <Form className="filter-content" layout="inline">
            <Row id="input-lable-wwidth">
              <Col span={8}>
                <FormItem>
                  <Input
                    // addonBefore="退单编号"
                    addonBefore={<p style={{ textAlign: "left" }}><FormattedMessage id="Finance.ReturnOrderNumber" /></p>}
                    onChange={(e) => {
                      this.setState({ rid: (e.target as any).value }, this._paramChanged);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    // addonBefore="订单编号"
                    addonBefore={<p style={{ textAlign: "left" }}><FormattedMessage id="orderNumber" /></p>}
                    maxLength={300}
                    onChange={(e) => {
                      this.setState({ tid: (e.target as any).value }, this._paramChanged);
                    }}
                  />
                </FormItem>
              </Col>
              {/*商品名称、SKU编码*/}
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderGoodsOptionSelect()}
                    onChange={(e) => {
                      if (this.state.goodsOptions === 'skuName') {
                        this.setState(
                          {
                            skuName: (e.target as any).value,
                            skuNo: ''
                          },
                          this._paramChanged
                        );
                      } else if (this.state.goodsOptions === 'skuNo') {
                        this.setState(
                          {
                            skuName: '',
                            skuNo: (e.target as any).value
                          },
                          this._paramChanged
                        );
                      }
                    }}
                  />
                </FormItem>
              </Col>
              {/*客户名称、客户账号*/}
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderBuyerOptionSelect()}
                    onChange={(e) => {
                      if (this.state.buyerOptions === 'buyerName') {
                        this.setState(
                          {
                            buyerName: (e.target as any).value,
                            buyerAccount: ''
                          },
                          this._paramChanged
                        );
                      } else if (this.state.buyerOptions === 'buyerAccount') {
                        this.setState(
                          {
                            buyerName: '',
                            buyerAccount: (e.target as any).value
                          },
                          this._paramChanged
                        );
                      }
                    }}
                  />
                </FormItem>
              </Col>
              {/*收件人、收件人手机*/}
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderConsigneeOptionSelect()}
                    onChange={(e) => {
                      if (this.state.consigneeOptions === 'consigneeName') {
                        this.setState(
                          {
                            consigneeName: (e.target as any).value,
                            consigneePhone: ''
                          },
                          this._paramChanged
                        );
                      } else if (this.state.consigneeOptions === 'consigneePhone') {
                        this.setState(
                          {
                            consigneeName: '',
                            consigneePhone: (e.target as any).value
                          },
                          this._paramChanged
                        );
                      }
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8} id="Range-picker-width">
                <FormItem>
                  <div>
                    <RangePicker
                    getCalendarContainer={(trigger: any) => trigger.parentNode}
                    onChange={(e) => {
                      let beginTime = '';
                      let endTime = '';
                      if (e.length > 0) {
                        beginTime = e[0].format(Const.DAY_FORMAT);
                        endTime = e[1].format(Const.DAY_FORMAT);
                      }
                      this.setState({ beginTime: beginTime, endTime: endTime }, this._paramChanged);
                    }}
                  />
                  </div>
                  
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    shape="round"
                    icon="search"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.relaxProps.onSearch(this.state);
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
          {/* {hasMenu ? (
            <div className="handle-bar ant-form-inline filter-content">
              <Dropdown getPopupContainer={(trigger: any) => trigger.parentNode} overlay={batchMenu} placement="bottomLeft">
                <Button>
                  <FormattedMessage id="Order.bulkOperations" /> <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          ) : null} */}
        </div>
        <ExportModal data={exportModalData} onHide={onExportModalHide} handleByParams={exportModalData.get('exportByParams')} handleByIds={exportModalData.get('exportByIds')} />
      </div>
    );
  }

  _renderGoodsOptionSelect = () => {
    return (
      <div style={{textAlign:"left"}}>
        <Select
          getPopupContainer={(trigger: any) => trigger.parentNode}
          onChange={(val) => {
            if (val === 'skuName') {
              this.setState(
                {
                  skuName: this.state.skuNo,
                  skuNo: '',
                  goodsOptions: val
                },
                this._paramChanged
              );
            } else if (val === 'skuNo') {
              this.setState(
                {
                  skuName: '',
                  skuNo: this.state.skuName,
                  goodsOptions: val
                },
                this._paramChanged
              );
            }
          }}
          value={this.state.goodsOptions}
          style={{ width: '176px' }}
        >
          <Option value="skuName">
            <FormattedMessage id="product.productName" />
          </Option>
          <Option value="skuNo">
            <FormattedMessage id="product.SKU" />
          </Option>
        </Select>

      </div>
    );
  };

  _renderBuyerOptionSelect = () => {
    return (
      <div style={{textAlign:"left"}}>
        <Select
        getPopupContainer={(trigger: any) => trigger.parentNode}
        onChange={(val) => {
          if (val === 'buyerName') {
            this.setState(
              {
                buyerName: this.state.buyerAccount,
                buyerAccount: '',
                buyerOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'buyerAccount') {
            this.setState(
              {
                buyerName: '',
                buyerAccount: this.state.buyerName,
                buyerOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.buyerOptions}
        style={{ width: '176px' }}
      >
        <Option value="buyerName">
          <FormattedMessage id="consumerName" />
        </Option>
        <Option value="buyerAccount">
          <FormattedMessage id="consumerAccount" />
        </Option>
      </Select>
    
      </div>
      );
  };

  _renderConsigneeOptionSelect = () => {
    return (
      <div style={{textAlign:"left"}}>
        <Select
        getPopupContainer={(trigger: any) => trigger.parentNode}
        onChange={(val) => {
          if (val === 'consigneeName') {
            this.setState(
              {
                consigneeName: this.state.consigneePhone,
                consigneePhone: '',
                consigneeOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'consigneePhone') {
            this.setState(
              {
                consigneeName: '',
                consigneePhone: this.state.consigneeName,
                consigneeOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.consigneeOptions}
        style={{ width: '176px' }}
      >
        <Option value="consigneeName">
          <FormattedMessage id="recipient" />
        </Option>
        <Option value="consigneePhone">
          <FormattedMessage id="recipientPhone" />
        </Option>
      </Select>
   </div>
       );
  };

  // 搜索条件变化，更新store的form参数
  _paramChanged() {
    // console.log(this.props.relaxProps);
    this.props.relaxProps.onSearchFormChange(this.state);
  }

  _handleBatchAudit() {
    const { selected, onBatchAudit } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量审核',
      content: (
        <div>
          <div>您确定要批量通过已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchAudit(selected.toArray());
      },
      onCancel() { }
    });
  }

  _handleBatchReceive() {
    const { selected, onBatchReceive } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量收货',
      content: (
        <div>
          <div>您确定要批量收货已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchReceive(selected.toArray());
      },
      onCancel() { }
    });
  }

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
