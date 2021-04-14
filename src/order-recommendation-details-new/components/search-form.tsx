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

/**
 * 订单查询头
 */
@Relax
class SearchHead extends Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      onProductForm: Function;
      onBatchAudit: Function;
      tab: IMap;
      dataList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
      onSearchParams: Function;
    };
  };

  static relaxProps = {
    onProductForm: noop,
    onBatchAudit: noop,
    tab: 'tab',
    dataList: 'dataList',
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    onSearchParams: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);

    this.state = {
      likeGoodsName: '',
      likeGoodsInfoNo: '',
      Signed: '',
      Price: ''
    };
  }

  render() {
    const { onSearchParams } = this.props.relaxProps;

    return (
      <div>
        <Headline title={'Product list'} />
        <div>
          <Form className="filter-content" layout="inline">
            <Row style={{ width: '100vh', margin: '0 auto' }}>
              <div style={{ width: '100%', margin: '0 auto' }} className="space-around">
                <Col>
                  <FormItem>
                    <Input
                      addonBefore={<p style={{ width: '120px' }}>Product Name</p>}
                      style={{ width: '300px' }}
                      onChange={(e) => {
                        this.setState({
                          likeGoodsName: (e.target as any).value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                <Col>
                  <FormItem>
                    <Input
                      addonBefore={<p style={{ width: '120px' }}>SKU</p>}
                      style={{ width: '300px' }}
                      onChange={(e) => {
                        this.setState({
                          likeGoodsInfoNo: (e.target as any).value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
              </div>

              {/*<Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                    <p style={{width:'120px'}}>
                      Signed classification
                    </p>
                  }
                    onChange={(e) => {
                      this.setState({
                        Signed: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                      <p style={{width:'120px'}}>
                        Price
                      </p>
                    }
                    onChange={(e) => {
                      this.setState({
                        Price: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>*/}

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
                      const { likeGoodsName, likeGoodsInfoNo } = this.state;
                      const params = {
                        likeGoodsName: likeGoodsName,
                        likeGoodsInfoNo: likeGoodsInfoNo
                      };
                      onSearchParams(params);
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
        </div>
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
        <Option value="subscriptionNumber">
          <FormattedMessage id="order.subscriptionNumber" />
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
    const title = RCi18n({id:'order.audit'});
    const content = RCi18n({id:'order.confirmAudit'});
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
      byParamsTitle: 'Export filtered orders',
      byIdsTitle: 'Export selected order',
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
    // width: 139
  }
} as any;
