import React from 'react';
import { Relax, IMap } from 'plume2';
import { Table, Tooltip, Menu, Popover, Row, Col } from 'antd';
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
      payRecord: IList;
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
    payRecord: 'payRecord',
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
      title: 'Collection Serial Number',
      dataIndex: 'receivableNo',
      key: 'receivableNo'
    },
    {
      title: 'Collection Time',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: (receiveTime) => receiveTime && moment(receiveTime).format(Const.TIME_FORMAT).toString()
    },
    {
      title: 'Amount Received',
      dataIndex: 'payOrderPrice',
      key: 'payOrderPrice',
      render: (text, record) => (record.payOrderStatus == 1 ? '' : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (text || 0).toFixed(2))
    },
    {
      title: 'Accounts Receivable',
      dataIndex: 'receivableAccount',
      key: 'receivableAccount',
      render: (receivableAccount) => (receivableAccount ? this._desensitizeAccount(receivableAccount) : '-')
    },
    {
      title: 'Accessories',
      dataIndex: 'encloses',
      key: 'encloses',
      render: (encloses) =>
        encloses ? (
          <Popover key={'encloses'} placement="topRight" title={''} trigger="click" content={<img style={styles.attachmentView} src={encloses} />}>
            <a href="#">
              <img style={styles.attachment} src={encloses} />
            </a>
          </Popover>
        ) : (
          '-'
        )
    },
    {
      title: 'Status',
      dataIndex: 'payOrderStatus',
      key: 'payOrderStatus',
      render: (payOrderStatus) => payOrderStatusDic[payOrderStatus]
    },
    ,
    {
      title: 'Remarks',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <span>
          {comment ? (
            <Tooltip title={this._renderComment(comment)} placement="top">
              <a href="javascript:void(0);">{<FormattedMessage id="view" />}</a>
            </Tooltip>
          ) : (
            '-'
          )}
        </span>
      )
    },
    {
      title: 'Operation',
      dataIndex: 'operate',
      key: 'operate',
      render: (_text, record) => this._renderOperator(record)
    }
  ];

  render() {
    const { detail, payRecord, paymentInfo } = this.props.relaxProps;
    const id = detail.get('id');
    // const toExternalOrderId = detail.get('toExternalOrderId');
    const totalPayCash = detail.getIn(['tradePrice', 'totalPrice']) || 0;

    //交易状态
    const tradeState = detail.get('tradeState');

    return (
      <div style={styles.container}>
        <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              {<FormattedMessage id="orderNumber" />}:{id}
              &nbsp;&nbsp;&nbsp;&nbsp;
              {<FormattedMessage id="amountReceivable" />}:$
              {(totalPayCash || 0).toFixed(2)}
            </label>
          </div>
        </div>

        <div>
          <Table columns={this.receiveColumns} dataSource={payRecord.toJS()} pagination={false} bordered rowKey={(_record, index) => index.toString()} />
        </div>

        <Row>
          <Col span={16}>
            <p style={styles.inforItem}>
              {<FormattedMessage id="paymentId" />}: {paymentInfo.get('chargeId')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="paymentTime" />}: {tradeState.get('createTime')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="name" />}: {paymentInfo.get('holderName')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="email" />}: {paymentInfo.get('email')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="phoneNumber" />}: {paymentInfo.get('phone')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="cardNumber" />}: {paymentInfo.get('lastFourDigits')}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="paymentMethod" />}: {paymentInfo.get('paymentVendor')}
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

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperator(_payRecord) {
    return '-';
  }

  _renderMenu = (id: string) => {
    const { onConfirm } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={() => onConfirm(id)}>{<FormattedMessage id="confirm" />}</a>
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
