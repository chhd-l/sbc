import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Table, Modal } from 'antd';
import { IMap } from 'typings/globalType';
import { Const, noop, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const { confirm } = Modal;

/**
 * 退款记录 💵
 */
@Relax
export default class ReturnRecord extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refundRecord: IMap;
      onRefundDestroy: Function;
      detail: IMap;
    };
  };

  static relaxProps = {
    refundRecord: 'refundRecord',
    onRefundDestroy: noop,
    detail: 'detail'
  };

  constructor(props) {
    super(props);
  }

  columns = [
    {
      title: <FormattedMessage id="Order.refundSerialNumber"/>,
      dataIndex: 'refundBillCode',
      key: 'refundBillCode',
      render: (text) => {
        const { detail } = this.props.relaxProps;
        return detail.get('returnFlowState') == 'COMPLETED' ? text : '-';
      }
    },
    {
      title: <FormattedMessage id="Order.refundTime"/>,
      dataIndex: 'refundBillTime',
      key: 'refundBillTime',
      render: (refundBillTime, rowData) =>
        refundBillTime
          ? moment(refundBillTime).format(
              rowData.payType == 0 ? Const.TIME_FORMAT : Const.DAY_FORMAT
            )
          : '-'
    },
    {
      title: <FormattedMessage id="Order.refundPoint"/>,
      dataIndex: 'returnPoints',
      key: 'returnPoints',
      render: (returnPoints) => <div>{returnPoints}</div>
    },
    {
      title: <FormattedMessage id="Order.refundAmount"/>,
      dataIndex: 'returnPrice',
      key: 'returnPrice',
      render: (returnPrice) => <div>${returnPrice.toFixed(2)}</div>
    },
    {
      title: <FormattedMessage id="Order.priceChange"/>,
      dataIndex: 'actualReturnPrice',
      key: 'actualReturnPrice',
      render: (price) => <div>${price.toFixed(2)}</div>
    },
    {
      title: <FormattedMessage id="Order.refundMethod"/>,
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => Const.payType[payType]
    },
    {
      title: <FormattedMessage id="Order.refundAccount"/>,
      dataIndex: 'returnAccountName',
      key: 'returnAccountName',
      render: (returnAccountName) =>
        returnAccountName ? this._desensitizeAccount(returnAccountName) : '-'
    },
    {
      title: <FormattedMessage id="Order.collectAccount"/>,
      dataIndex: 'customerAccount',
      key: 'customerAccount',
      render: (_) => {
        const { detail } = this.props.relaxProps;
        const customerAccount = detail.get('customerAccount');
        if (customerAccount != null) {
          const bankName = customerAccount.get('bankName')
            ? customerAccount.get('bankName')
            : customerAccount.get('customerBankName');
          return `${bankName} ${this._parseBankNo(
            customerAccount.get('customerAccountNo')
          )}`;
        } else {
          return '-';
        }
      }
    },
    {
      title: <FormattedMessage id="Order.refundStatus"/>,
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (refundStatus) => Const.refundStatus[refundStatus]
    },
    {
      title: <FormattedMessage id='Order.remark'/>,
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (comment ? comment : 'None')
    }
  ];

  render() {
    const { refundRecord } = this.props.relaxProps;

    const list: Array<any> =
      refundRecord && refundRecord.get('refundBillCode')
        ? [refundRecord.toJS()]
        : [];

    return list.length > 0 ? (
      <div style={styles.container}>
        <h2 style={{ fontSize: 18, paddingBottom: 16 }}><FormattedMessage id="Order.Refundrecord" /></h2>
        <Table
          rowKey="refundId"
          columns={this.columns}
          dataSource={list}
          pagination={false}
          bordered
        />
      </div>
    ) : null;
  }

  _handleClickDestroy(refundId: string) {
    const { onRefundDestroy } = this.props.relaxProps;

    confirm({
      title: '作废',
      content: '是否确认作废这条退款记录？',
      onOk() {
        return onRefundDestroy(refundId);
      },
      onCancel() {}
    });
  }

  _desensitizeAccount(accountNm) {
    const strArr = accountNm.split(' ');
    if (strArr[1]) {
      strArr[1] = util.desensitizeStr(strArr[1]);
    }
    return strArr.join(' ');
  }

  _parseBankNo(bankNo: string) {
    if (!bankNo || bankNo.length <= 9) {
      return bankNo;
    }
    if (bankNo.length > 9) {
      return `${bankNo.substring(0, 4)}****${bankNo.substring(
        bankNo.length - 4,
        bankNo.length
      )}`;
    }
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
} as any;
