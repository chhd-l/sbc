import React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Table, Button, InputNumber, Modal, Form, Spin, Timeline } from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper, cache } from 'qmkit';
import DeliveryForm from './delivery-form';
import Moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

/**
 * 订单发货记录
 */
@Relax
class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: [],
      loading: false
    };
  }

  props: {
    intl?: any;
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
      isFetchingLogistics: boolean;
      isSavingShipment: boolean;
      logisticsLoading: boolean;
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
    onRefresh: noop,
    isFetchingLogistics: 'isFetchingLogistics',
    isSavingShipment: 'isSavingShipment',
    logisticsLoading: 'logisticsLoading'
  };

  render() {
    const { detail, refresh, onRefresh, logisticsLoading } = this.props.relaxProps;

    const refreshList = fromJS(refresh);
    const tradeDelivers = refreshList && refreshList.toJS().length > 0 ? fromJS(refresh) : (detail.get('tradeDelivers') as IList);
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map((gift) =>
      gift
        .set('skuName', `【Giveaway】${gift.get('skuName')}`)
        .set('levelPrice', 0)
        .set('isGift', true)
    );

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

        </div>
        <Spin spinning={logisticsLoading}>
          {tradeDelivers.count() > 0
            ? tradeDelivers &&
            tradeDelivers.map((v, i) => {
              const logistic = v.get('logistics');
              const tradeLogisticsData = v.get('tradeLogisticsDetails') ? v.get('tradeLogisticsDetails').toJS() : [];
              const tradeLogisticsDetails = tradeLogisticsData
                .filter((x) => x.shown)
                .sort((a, b) => {
                  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                });
              const deliverTime = v.get('deliverTime') ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT) : null;
              //处理赠品
              const deliversGifts = (v.get('giftItemList') ? v.get('giftItemList') : fromJS([])).map((gift) => gift.set('itemName', `${(window as any).RCi18n({ id: 'Order.Giveaway' })}${gift.get('itemName')}`));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={styles.title}>{<FormattedMessage id="Order.DeliveryRecord" />}</label>
                  <Table rowKey={(_record, index) => index.toString()}
                    columns={this._deliveryRecordColumns()}
                    dataSource={v.get('shippingItems').concat(deliversGifts).toJS()}
                    pagination={false} bordered />

                  <div style={styles.expressBox as any}>
                    <div style={styles.stateBox}>
                      {logistic ? (
                        <div>
                          <label style={styles.information} className="flex-start-align">
                            【<FormattedMessage id="Product.logisticsInformation" />】
                            <FormattedMessage id="Order.deliveryDate" />：{deliverTime}&nbsp;&nbsp;
                            <FormattedMessage id="Order.logisticsCompany" />：{logistic.get('logisticCompanyName')} &nbsp;&nbsp;
                            <FormattedMessage id="Order.logisticsSingleNumber" />：{logistic.get('logisticNo')}&nbsp;&nbsp;
                            {logistic.get('deliverBagNo') ? (<><FormattedMessage id="Order.TraceabilityBagNumber" /><span>：{logistic.get('deliverBagNo')}&nbsp;&nbsp;</span></>) : null}

                            {v.get('trackingUrl') ? (
                              <Button type="primary" shape="round" style={{ marginLeft: 15 }} href={v.get('trackingUrl')} target="_blank" rel="noopener">
                                <FormattedMessage id="Order.Trackdelivery" />
                              </Button>
                            ) : (
                              <Button type="primary" shape="round" style={{ marginLeft: 15 }} onClick={() => onRefresh()}>
                                <FormattedMessage id="Order.Refresh" />
                              </Button>
                            )}
                          </label>
                          <div style={{ marginTop: 20 }}>
                            <Timeline>
                              {tradeLogisticsDetails.map((item, index) => {
                                let color = index === 0 ? 'red' : 'gray';
                                return (
                                  <Timeline.Item color={color}>
                                    <p>
                                      {moment(item.timestamp).format('YYYY-MM-DD HH:mm')} {item.longDescription}
                                    </p>
                                  </Timeline.Item>
                                );
                              })}
                            </Timeline>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>

                  </div>
                </div>
              );
            })
            : null}
        </Spin>


      </div>
    );
  }

  _deliveryColumns = () => {
    const { changeDeliverNum } = this.props.relaxProps;
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    
    return [
      {
        title: <FormattedMessage id="Order.appointmentNo" />,
        dataIndex: 'appointmentNo',
        key: 'appointmentNo',
      },
      {
        title: <FormattedMessage id="Order.appointmentStatus2" />,
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: <FormattedMessage id="Order.appointmentTime2" />,
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: <FormattedMessage id="Order.appointmentOperator" />,
        dataIndex: 'operator',
        key: 'operator',
        width: '40%'
      },
    ];
  };

  _deliveryRecordColumns = () => {
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    return [
      {
        title: <FormattedMessage id="Order.No." />,
        key: 'appointmentNo',
        render: (_text, _row, index) => index + 1
      },
      {
        title: <FormattedMessage id="Order.SKUCode" />,
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'operator',
        key: 'operator'
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
    const title = (window as any).RCi18n({ id: 'Order.prompt' });
    const content = (window as any).RCi18n({ id: 'Order.Whethertoinvalidate' });
    confirm({
      title: title,
      content: content,
      onOk() {
        obsoleteDeliver(tdId);
      },
      onCancel() { }
    });
  };

}

export default injectIntl(OrderDelivery);

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    padding: '10px 0'
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
