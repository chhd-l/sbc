import React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Table, Button, InputNumber, Modal, Form, Spin, Row } from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper, Logistics } from 'qmkit';
import DeliveryForm from './delivery-form';
import Moment from 'moment';
import { FormattedMessage } from 'react-intl';

/**
 * 订单发货记录
 */
@Relax
export default class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: [],
      loading: false
    };
  }

  props: {
    relaxProps?: {
      detail: IMap;
      deliver: Function;
      confirm: Function;
      changeDeliverNum: Function;
      showDeliveryModal: Function;
      modalVisible: boolean;
      formData: IMap;
      hideDeliveryModal: Function;
      saveDelivery: Function;
      obsoleteDeliver: Function;
      refresh: IMap;
      onRefresh: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalVisible: 'modalVisible',
    formData: 'formData',
    hideDeliveryModal: noop,
    saveDelivery: noop,
    obsoleteDeliver: noop,
    refresh: 'refresh',
    onRefresh: noop
  };

  /*static getDerivedStateFromProps(nextProps, prevState) {
    const { refresh } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    if (refresh != prevState.loading) {
      return {

      };
    }

    // 否则，对于state不进行任何操作
    return null;
  }*/

  render() {
    const { detail, deliver, modalVisible, saveDelivery, refresh, onRefresh } = this.props.relaxProps;
    const tradeDelivers = detail.get('tradeDelivers') as IList;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map((gift) =>
      gift
        .set('skuName', `【赠品】${gift.get('skuName')}`)
        .set('levelPrice', 0)
        .set('isGift', true)
    );
    const DeliveryFormDetail = Form.create({})(DeliveryForm);
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            wordBreak: 'break-word'
          }}
        >
          <Table rowKey={(_record, index) => index.toString()} columns={this._deliveryColumns()} dataSource={detail.get('tradeItems').concat(gifts).toJS()} pagination={false} bordered />
          {(flowState === 'AUDIT' || flowState === 'DELIVERED_PART') && !(paymentOrder == 'PAY_FIRST' && payState != 'PAID') ? (
            <div style={styles.buttonBox as any}>
              <AuthWrapper functionName="fOrderDetail002">
                <Button type="primary" onClick={() => deliver()}>
                  {<FormattedMessage id="ship" />}
                </Button>
              </AuthWrapper>
            </div>
          ) : null}
        </div>
        {tradeDelivers.count() > 0
          ? tradeDelivers.map((v, i) => {
              const logistic = v.get('logistics');
              const deliverTime = v.get('deliverTime') ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT) : null;
              //处理赠品
              const deliversGifts = (v.get('giftItemList') ? v.get('giftItemList') : fromJS([])).map((gift) => gift.set('itemName', `【赠品】${gift.get('itemName')}`));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={styles.title}>{<FormattedMessage id="deliveryRecord" />}</label>
                  <Table rowKey={(_record, index) => index.toString()} columns={this._deliveryRecordColumns()} dataSource={v.get('shippingItems').concat(deliversGifts).toJS()} pagination={false} bordered />

                  <div style={styles.expressBox as any}>
                    <div style={styles.stateBox}>
                      {logistic ? (
                        <label style={styles.information} className="flex-start-align">
                          【Logistics information】delivery date：{deliverTime}
                          &nbsp;&nbsp; Logistics company：
                          {logistic.get('logisticCompanyName')} &nbsp;&nbsp;Logistics single number：
                          {logistic.get('logisticNo')}&nbsp;&nbsp;
                          <Logistics companyInfo={logistic} deliveryTime={deliverTime} />
                          <Button type="primary" shape="round" style={{ marginLeft: 15 }} onClick={() => onRefresh()}>
                            Refresh
                          </Button>
                        </label>
                      ) : (
                        'none'
                      )}
                    </div>
                    {flowState === 'CONFIRMED' || flowState === 'COMPLETED' || flowState === 'VOID' ? null : (
                      <AuthWrapper functionName="fOrderDetail002">
                        <a style={{ color: 'blue' }} href="#" onClick={() => this._showCancelConfirm(v.get('deliverId'))}>
                          Invalid
                        </a>
                      </AuthWrapper>
                    )}
                  </div>

                  <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
                    <div style={{ marginTop: 0, marginBottom: 20, marginLeft: 15 }}>
                      {refresh.length != 0
                        ? refresh[i].syncLogisticsInfo &&
                          refresh[i].syncLogisticsInfo.originInfo.trackInfo &&
                          refresh[i].syncLogisticsInfo.originInfo.trackInfo.map((item, o) => {
                            return (
                              <div key={o} className="flex-start-align">
                                <span>{item.date},</span>
                                <span>{item.statusDescription},</span>
                                <span>{item.details}</span>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </Spin>
                </div>
              );
            })
          : null}

        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
          <div style={styles.expressOp}>
            {flowState === 'DELIVERED' ? (
              <AuthWrapper functionName="fOrderList003">
                <Button
                  type="primary"
                  onClick={() => {
                    this._showConfirm();
                  }}
                >
                  Confirm receipt
                </Button>
              </AuthWrapper>
            ) : null}
          </div>
        </div>

        <Modal
          maskClosable={false}
          title="Deliver goods"
          visible={modalVisible}
          onCancel={this._hideDeliveryModal}
          onOk={() => {
            this['_receiveAdd'].validateFields(null, (errs, values) => {
              //如果校验通过
              if (!errs) {
                values.deliverTime = values.deliverTime.format(Const.DAY_FORMAT);
                saveDelivery(values);
              }
            });
          }}
        >
          <DeliveryFormDetail ref={(_receiveAdd) => (this['_receiveAdd'] = _receiveAdd)} />
        </Modal>
      </div>
    );
  }

  _deliveryColumns = () => {
    const { changeDeliverNum } = this.props.relaxProps;

    return [
      {
        title: 'No.',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU Code',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: 'Product name',
        dataIndex: 'skuName',
        key: 'skuName',
        width: '50%'
      },
      {
        title: 'Weight',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: 'Quantity',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: 'Shipped',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      },
      {
        title: 'This Shipment',
        key: 'deliveringNum',
        render: (_, row) => {
          return (
            <InputNumber
              min={0}
              max={row.num - row.deliveredNum}
              value={row.deliveringNum ? row.deliveringNum : 0}
              onChange={(value) => {
                changeDeliverNum(_.skuId, _.isGift, value);
              }}
            />
          );
        }
      }
    ];
  };

  _deliveryRecordColumns = () => {
    return [
      {
        title: 'No.',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU Code',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: 'Product name',
        dataIndex: 'itemName',
        key: 'itemName'
      },
      {
        title: 'Weight',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: 'This Shipment',
        dataIndex: 'itemNum',
        key: 'itemNum'
      }
    ];
  };

  /**
   * 显示发货弹框
   */
  _showDeliveryModal = () => {
    const { showDeliveryModal } = this.props.relaxProps;
    showDeliveryModal();
  };

  /**
   * 关闭发货modal
   * @private
   */
  _hideDeliveryModal = () => {
    const { hideDeliveryModal } = this.props.relaxProps;
    hideDeliveryModal();
  };

  /**
   * 作废发货记录提示
   * @private
   */
  _showCancelConfirm = (tdId: string) => {
    const { obsoleteDeliver } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: 'Prompt',
      content: 'Whether to invalidate this delivery record',
      onOk() {
        obsoleteDeliver(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = () => {
    const { confirm, detail } = this.props.relaxProps;
    const tid = detail.get('id');
    const confirmModal = Modal.confirm;
    confirmModal({
      title: 'Confirm receipt',
      content: 'Confirm receipt of all items?',
      onOk() {
        confirm(tid);
      },
      onCancel() {}
    });
  };
}

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5
  },
  expressBox: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  expressOp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  information: {
    marginBottom: 10
  }
} as any;
