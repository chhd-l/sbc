import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class RefundList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refundList: any;
      payWaysObj: any;
      refundTotal: any;
      dateRange: any;
    };
  };

  static relaxProps = {
    refundList: 'refundList',
    payWaysObj: 'payWaysObj',
    refundTotal: 'refundTotal',
    dateRange: 'dateRange'
  };

  render() {
    const {
      refundList,
      payWaysObj,
      refundTotal,
      dateRange
    } = this.props.relaxProps;
    return (
      <div>
        {/*<div className="totalAmount">
          <ul>
            <li>
              <p className="payName">&nbsp;Total Refund</p>
              <strong>
                {refundList.toJS().map((item, index) => {
                  let a = item.totalAmount.substr(
                    0,
                    item.totalAmount.length - 1
                  );
                  return a;
                })}
              </strong>
              <p className="payPercent">100% &nbsp;{}</p>
            </li>
            <li>
              <p className="payName">&nbsp;PayU</p>
              <strong>
                {refundList.toJS().map((item, index) => {
                  let a = item.totalAmount.substr(
                    0,
                    item.totalAmount.length - 1
                  );
                  return a;
                })}
              </strong>
              <p className="payPercent">100% &nbsp;{}</p>
            </li>
            <li>
              <p className="payName">&nbsp;OXXO</p>
              <strong>--</strong>
              <p className="payPercent">-- &nbsp;{}</p>
            </li>
          </ul>
        </div>*/}
        {/* <div className="totalAmount">
          <ul>
            {refundTotal.toJS().length > 0
              ? refundTotal.map((v, i) => {
                  //不显示预存款，优惠券和积分
                  return (
                    v.get('payWay') != 'ADVANCE' &&
                    v.get('payWay') != 'COUPON' &&
                    v.get('payWay') != 'POINT' && (
                      <li key={i}>
                        <p className="payName">
                          {payWaysObj.toJS()[v.get('payWay')]}
                        </p>
                        <strong>{v.get('sumAmount')}</strong>
                        <p className="payPercent">{v.get('percentage')}</p>
                      </li>
                    )
                  );
                })
              : null}
          </ul>
        </div> */}
        <DataGrid
          dataSource={refundList.toJS().length > 0 ? refundList.toJS() : []}
          rowKey={(record, index) => index}
          pagination={false}
        >
          <Column
            title="NO."
            dataIndex="index"
            key="index"
            width="50"
            render={(_text, _rowData: any, index) => {
              return index + 1;
            }}
          />
          {/* <Column
            title="转账汇款"
            dataIndex="CASH"
            key="CASH"
            width="100"
            render={(_text, rowData: any, _index) => {
              return <span>{rowData.payItemAmountMap.CASH}</span>;
            }}
          />
          <Column
            title="银联"
            dataIndex="UNIONPAY"
            key="UNIONPAY"
            width="100"
            render={(_text, rowData: any, _index) => {
              return <span>{rowData.payItemAmountMap.UNIONPAY}</span>;
            }}
          />
          <Column
            title="支付宝"
            dataIndex="ALIPAY"
            key="ALIPAY"
            width="100"
            render={(_text, rowData: any, _index) => {
              return <span>{rowData.payItemAmountMap.ALIPAY}</span>;
            }}
          />
          <Column
            title="微信"
            dataIndex="WECHAT"
            key="WECHAT"
            width="100"
            render={(_text, rowData: any, _index) => {
              return <span>{rowData.payItemAmountMap.WECHAT}</span>;
            }}
          />
          <Column
            title="企业银联"
            dataIndex="UNIONPAY_B2B"
            key="UNIONPAY_B2B"
            width="100"
            render={(_text, rowData: any) => {
              return <span>{rowData.payItemAmountMap.UNIONPAY_B2B}</span>;
            }}
          /> */}
          <Column
            title="Total Revenue"
            dataIndex="totalAmount"
            key="totalAmount"
          />

          {/*<Column
            title={<FormattedMessage id="balance" />}
            dataIndex="BALANCE"
            key="BALANCE"
            width="100"
            render={(_text, rowData: any) => {
              return <span>{rowData.payItemAmountMap.BALANCE}</span>;
            }}
          />*/}
          {/*<Column*/}
          {/*title='预存款'*/}
          {/*dataIndex='ADVANCE'*/}
          {/*key='ADVANCE'*/}
          {/*width='100'*/}
          {/*render={(text, rowData: any, index) => {*/}
          {/*return <span>{rowData.payItemAmountMap.ADVANCE}</span>*/}
          {/*}}*/}
          {/*/>*/}
          {/*<Column*/}
          {/*title='优惠券'*/}
          {/*dataIndex='COUPON'*/}
          {/*key='COUPON'*/}
          {/*width='100'*/}
          {/*render={(text, rowData: any, index) => {*/}
          {/*return <span>{rowData.payItemAmountMap.COUPON}</span>*/}
          {/*}}*/}
          {/*/>*/}
          {/*<Column*/}
          {/*title='积分'*/}
          {/*dataIndex='POINT'*/}
          {/*key='POINT'*/}
          {/*width='100'*/}
          {/*render={(text, rowData: any, index) => {*/}
          {/*return <span>{rowData.payItemAmountMap.POINT}</span>*/}
          {/*}}*/}
          {/*/>*/}
          <Column title="PayU" dataIndex="totalAmount" key="supplierId" />
          <Column
            title={<FormattedMessage id="operation" />}
            dataIndex="operate"
            key="storeId"
            width="100"
            render={(_text, record: any, _index) => {
              return (
                <AuthWrapper functionName="f_finance_manage_refund">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: `/finance-manage-refund/${
                          record.storeId
                        }/${'refund'}`,
                        state: {
                          beginTime:
                            dateRange.get('beginTime') + ' ' + '00:00:00',
                          endTime: dateRange.get('endTime') + ' ' + '23:59:59'
                        }
                      })
                    }
                  >
                    Details
                  </a>
                </AuthWrapper>
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }
}
