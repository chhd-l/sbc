import React from 'react';
import { Relax, IMap } from 'plume2';
import { Table, Tooltip, Menu, Popover, Row, Col, Card } from 'antd';
import { noop, Const, util } from 'qmkit';
import { IList } from 'typings/globalType';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { cache } from 'qmkit';
const payTypeDic = {
  0: 'Online Payment',
  1: 'Offline Payment'
};

const payOrderStatusDic = {
  0: 'paid',
  1: 'unpaid',
  2: 'to be confirmed'
};

/**
 * 订单收款记录
 */
@Relax
export default class OrderReceive extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      paymentInfo: IMap;
      onSavePayOrder: Function;
      destroyOrder: Function;
      fetchOffLineAccounts: Function;
      addReceiverVisible: boolean;
      setReceiveVisible: Function;
      onConfirm: Function;
    };
  };

  /*state: {
    addReceiverVisible: boolean;
  }*/

  constructor(props) {
    super(props);
    /*this.state = {
      addReceiverVisible: false
    }*/
  }

  static relaxProps = {
    detail: 'detail',
    paymentInfo: 'paymentInfo',
    onSavePayOrder: noop,
    destroyOrder: noop,
    fetchOffLineAccounts: noop,
    addReceiverVisible: 'addReceiverVisible',
    setReceiveVisible: noop,
    onConfirm: noop
  };

  //收款列表
  receiveColumns = [
    {
      title: <FormattedMessage id="Order.CollectionTime" />,
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => createTime && moment(createTime).format(Const.TIME_FORMAT).toString()
    },
    {
      title: <FormattedMessage id="Order.AmountReceived" />,
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      render: (text, record) => (record.payOrderStatus == 1 ? '' : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (text || 0).toFixed(2))
    },
    {
      title: <FormattedMessage id="Order.Status" />,
      dataIndex: 'opStatus',
      key: 'opStatus'
    },
    {
      title: <FormattedMessage id="Order.tradeType" />,
      dataIndex: 'tradeType',
      key: 'tradeType'
    },
    {
      title: <FormattedMessage id="Order.Remarks" />,
      dataIndex: 'remark',
      key: 'remark',
      render: (remark) => (
        <span>
          {remark ? (
            <Tooltip title={remark} placement="top">
              {remark}
            </Tooltip>
          ) : (
            '-'
          )}
        </span>
      )
    }
  ];

  render() {
    const { detail, paymentInfo } = this.props.relaxProps;
    var payLogs = paymentInfo && paymentInfo.get('payPaymentLogsVOList') ? paymentInfo.get('payPaymentLogsVOList') : [];
    const id = detail.get('id');
    // const toExternalOrderId = detail.get('toExternalOrderId');
    const totalPayCash = detail.getIn(['tradePrice', 'totalPrice']) || 0;

    //交易状态
    const tradeState = detail.get('tradeState');

    return (
      <div style={styles.container}>
        <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <Row style={{ width: '100%' }}>
              <Col span={18}>
                <label style={styles.orderNum}>
                  {<FormattedMessage id="Order.orderNumber" />}:{id}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {<FormattedMessage id="Order.amountReceivable" />}:$
                  {(totalPayCash || 0).toFixed(2)}
                </label>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <label style={{ color: '#339966' }}>{paymentInfo.get('payStatus')}</label>
              </Col>
            </Row>
          </div>
        </div>

        <div>
          <Table columns={this.receiveColumns} dataSource={payLogs} pagination={false} bordered rowKey={(_record, index) => index.toString()} />
        </div>

        <Row>
          <Col span={12} className="headBox" style={{ height: 200, marginTop: 10 }}>
            <h4>
              <FormattedMessage id="Order.paymentDetails" />
            </h4>
            <p>
              {<FormattedMessage id="Order.purchaseType" />}: {paymentInfo.get('holderName')}
            </p>
            <p>
              {<FormattedMessage id="Order.PSP" />}: {paymentInfo.get('pspName')}
            </p>
            <p>
              {<FormattedMessage id="paymentMethod" />}: {paymentInfo.get('paymentVendor')}
            </p>
            <p>
              {<FormattedMessage id="Order.cardLast4Digits" />}: {paymentInfo.get('lastFourDigits')}
            </p>
            <p>
              {<FormattedMessage id="paymentId" />}: {paymentInfo.get('chargeId')}
            </p>
            <p>
              {<FormattedMessage id="Order.phoneNumber" />}: {paymentInfo.get('phone')}
            </p>
          </Col>
        </Row>
      </div>
    );
  }

  _desensitizeAccount(accountNm) {
    const strArr = accountNm.split(' ');
    if (strArr[1]) {
      strArr[1] = util.desensitizeStr(strArr[1]);
    }
    return strArr.join(' ');
  }

  _renderMenu = (id: string) => {
    const { onConfirm } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={() => onConfirm(id)}>{<FormattedMessage id="Order.confirm" />}</a>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  addReceiveButton: {
    display: 'flex',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  orderNum: {
    fontSize: 12
  } as any,
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 500,
    maxHeight: 400
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any
} as any;
