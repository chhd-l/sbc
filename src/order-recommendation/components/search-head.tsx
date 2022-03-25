import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, Menu, Dropdown, DatePicker, Row, Col, message, Cascader } from 'antd';
import { noop, AuthWrapper, checkAuth, Headline, history,RCi18n, SelectGroup, Const } from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
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
    intl?:any;
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
      recommendationId: '',
      goodsOptions: 'Product name',
      receiverSelect: 'consigneeName',
      clinicSelect: 'clinicsName',
      buyerOptions: 'Recipient name',
      numberSelect: 'orderNumber',
      statusSelect: 'paymentStatus',
      linkStatus: 0,
      id: '',
      subscribeId: '',
      buyerOptionsValue: '',
      goodsOptionsValue: '',
      receiverSelectValue: '',
      clinicSelectValue: sessionStorage.getItem('PrescriberSelect') ? JSON.parse(sessionStorage.getItem('PrescriberSelect')).prescriberName : '',
      numberSelectValue: '',
      tradeState: {
        deliverStatus: '',
        payState: '',
        orderSource: ''
      }
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
        {/*<div className="space-between-align-items">*/}
        {/*  <Headline title="Prescription portal" />*/}
        {/*  {sessionStorage.getItem('PrescriberType') != null ? (*/}
        {/*    <Button*/}
        {/*      type="primary"*/}
        {/*      icon="plus"*/}
        {/*      htmlType="submit"*/}
        {/*      shape="round"*/}
        {/*      style={{ textAlign: 'center', marginRight: '20px' }}*/}
        {/*      onClick={(e) => {*/}
        {/*        history.push('/recomm-page-detail-new');*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <span>New</span>*/}
        {/*    </Button>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
        <div id="inputs">
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={RCi18n({id:'Order.RecommendationNo'})}
                    onChange={(e) => {
                      this.setState({
                        recommendationId: (e.target as any).value
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

              {/*<Col span={8}>
                <FormItem>
                  <SelectGroup
                    label="Link status"
                    defaultValue="All"
                    style={{ width: 170 }}
                    onChange={(value) => {
                      this.setState({
                        linkStatus: value
                      });
                    }}
                  >
                    <Option value="2">All</Option>
                    <Option value="1">Invalid</Option>
                    <Option value="0">Valid</Option>
                  </SelectGroup>
                  <Input
                    addonBefore="Link status"
                    type="number"
                    onChange={(e) => {
                      this.setState({
                        linkStatus: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>*/}

              <Col span={8}>
                <FormItem>
                  {sessionStorage.getItem('PrescriberSelect') ? (
                    <Input
                      addonBefore={this._renderClinicSelect()}
                      value={this.state.clinicSelectValue}
                      disabled
                      // value={
                      //   JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                      //     .clinicsIds != null
                      //     ? JSON.parse(sessionStorage.getItem('PrescriberType'))
                      //         .children
                      //     : this.state.clinicSelectValue
                      // }
                      /* onChange={(e) => {
                        let a = e.target.value.split(',');

                        this.setState({
                          clinicSelectValue:
                            this.state.clinicSelect == 'clinicsName'
                              ? (e.target as any).value
                              : e.target.value.split(',').map(Number)
                        });
                      }}*/
                    />
                  ) : (
                    <Input
                      addonBefore={this._renderClinicSelect()}
                      onChange={(e) => {
                        this.setState({
                          clinicSelectValue: (e.target as any).value
                        });
                      }}
                      // value={
                      //   JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                      //     .clinicsIds != null
                      //     ? JSON.parse(sessionStorage.getItem('PrescriberType'))
                      //         .children
                      //     : this.state.clinicSelectValue
                      // }
                      /* onChange={(e) => {
                        let a = e.target.value.split(',');

                        this.setState({
                          clinicSelectValue:
                            this.state.clinicSelect == 'clinicsName'
                              ? (e.target as any).value
                              : e.target.value.split(',').map(Number)
                        });
                      }}*/
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  {sessionStorage.getItem('PrescriberType') != null || Const.SITE_NAME === 'MYVETRECO' ? (
                    <Button
                      type="primary"
                      icon="plus"
                      htmlType="submit"
                      shape="round"
                      style={{ textAlign: 'center', marginRight: '20px' }}
                      onClick={(e) => {
                        history.push('/recomm-page-detail-new');
                      }}
                    >
                      <span>
                        <FormattedMessage id="Order.New" />
                      </span>
                    </Button>
                  ) : null}

                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center', marginTop: '20px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const { recommendationId, buyerOptions, goodsOptions, receiverSelect, clinicSelect, linkStatus, buyerOptionsValue, goodsOptionsValue, receiverSelectValue, clinicSelectValue } = this.state;
                      const params = {
                        recommendationId,
                        [buyerOptions == 'Recipient name' ? 'consumerName' : 'consumerEmail']: buyerOptionsValue,
                        [goodsOptions == 'Product name' ? 'goodsInfoName' : 'goodsInfoNo']: goodsOptionsValue,
                        [receiverSelect]: receiverSelectValue,
                        [clinicSelect == 'clinicsName' ? 'prescriberName' : 'prescriberId']: clinicSelectValue,
                        //linkStatus
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

          {/*{hasMenu && (
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
          )}*/}
        </div>

        {/*<ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />*/}
      </div>
    );
  }

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        defaultValue={RCi18n({id:'Order.RecipientName'})}
        onChange={(value, a) => {
          this.setState({
            buyerOptions: value
          });
        }}
        // value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option value="consumerName" title={RCi18n({id:'Order.RecipientName'})}>
          <FormattedMessage id="Order.RecipientName" />
        </Option>
        <Option value="consumerEmail" title={RCi18n({id:'Order.RecipientMail'})}>
          <FormattedMessage id="Order.RecipientMail" />
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
        defaultValue={RCi18n({id:'Order.Product Name'})}
        // value={this.state.goodsOptions}
        style={styles.label}
      >
        <Option value="goodsInfoName" title={RCi18n({id:'Order.Product Name'})}>
          <FormattedMessage id="Order.Product Name" />
        </Option>
        <Option value="goodsInfoNo" title={RCi18n({id:'Order.ProductSKU'})}>
          <FormattedMessage id="Order.ProductSKU" />
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
          <FormattedMessage id="Order.recipient" />
        </Option>
        <Option value="consigneePhone">
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
        value={this.state.clinicSelect}
        style={styles.label}
        disabled={sessionStorage.getItem('PrescriberSelect') ? true : false}
      >
        <Option value="clinicsName" title={RCi18n({id:'Order.PrescriberName'})}>
          <FormattedMessage id="Order.PrescriberName" />
        </Option>
        <Option value="clinicsIds" title={RCi18n({id:'Order.PrescriberId'})}>
          <FormattedMessage id="Order.PrescriberId" />
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
          <FormattedMessage id="Order.OrderNumber" />
        </Option>
        <Option value="subscriptionNumber">
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
        value={this.state.statusSelect}
        style={styles.label}
      >
        <Option value="paymentStatus">
          <FormattedMessage id="Order.paymentStatus" />
        </Option>
        <Option value="shippingStatus">
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
    const mess = (window as any).RCi18n({id:'Marketing.needsToBeOperated'});
    if (checkedIds.length == 0) {
      message.error(mess);
      return;
    }

    const confirm = Modal.confirm;
    const title = (window as any).RCi18n({id:'Order.audit'});
    const content = (window as any).RCi18n({id:'Order.confirmAudit'});
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
      byParamsTitle: RCi18n({id:'Order.exportFilterOrder'}),
      byIdsTitle: RCi18n({id:'Order.exportSelectedOrder'}),
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}

export default injectIntl(SearchHead);

const styles = {
  label: {
    width: 160,
    textAlign: 'center'
  },
  wrapper: {
    width: 185
  }
} as any;
