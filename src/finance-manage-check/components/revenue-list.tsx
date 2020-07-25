import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class RevenueList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      incomeList: any;
      incomeTotal: any;
      payWaysObj: any;
      dateRange: any;
    };
  };

  static relaxProps = {
    incomeList: 'incomeList',
    incomeTotal: 'incomeTotal',
    payWaysObj: 'payWaysObj',
    dateRange: 'dateRange'
  };

  render() {
    const {
      incomeList,
      payWaysObj,
      incomeTotal,
      dateRange
    } = this.props.relaxProps;
    let totalAmount = 0;
    return (
      <div>
        {/*<div className="totalAmount">
          <ul>
            <li>
              <p className="payName">
                &nbsp;
                <FormattedMessage id="TotalRevenue" />
              </p>

              <strong>
                {incomeList.toJS().map((item, index) => {
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
                {incomeList.toJS().map((item, index) => {
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
            {incomeTotal.toJS().length > 0
              ? incomeTotal.map((v, i) => {
                  //不显示预存款，优惠券和积分
                  return (
                    v.get('payWay') != 'ADVANCE' &&
                    v.get('payWay') != 'COUPON' && (
                      <li key={i}>
                        <p className="payName">
                          &nbsp;{payWaysObj.toJS()[v.get('payWay')]}
                        </p>
                        <strong>{v.get('sumAmount')}</strong>
                        <p className="payPercent">
                          {' '}
                          &nbsp;{v.get('percentage')}
                        </p>
                      </li>
                    )
                  );
                })
              : null}
          </ul>
        </div>*/}

        <div>
          <DataGrid
            dataSource={incomeList.toJS().length > 0 ? incomeList.toJS() : []}
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
            <Column
              title="Total Revenue"
              dataIndex="totalAmount"
              key="totalAmount"
            />
            {/* <Column
              title="转账汇款"
              dataIndex="CASH"
              key="CASH"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.CASH}</span>;
              }}
            />
            <Column
              title="银联"
              dataIndex="UNIONPAY"
              key="UNIONPAY"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.UNIONPAY}</span>;
              }}
            />
            <Column
              title="支付宝"
              dataIndex="ALIPAY"
              key="ALIPAY"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.ALIPAY}</span>;
              }}
            />
            <Column
              title="微信"
              dataIndex="WECHAT"
              key="WECHAT"
              width="100"
              render={(_text, rowData: any) => {
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
            />
            <Column
              title="积分兑换"
              dataIndex="POINT"
              key="POINT"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.POINT}</span>;
              }}
            /> */}
            <Column title="PayU" dataIndex="totalAmount" key="supplierId" />
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
            {/*<Column
              title={<FormattedMessage id="Revenue" />}
              dataIndex="totalAmount"
              key="totalAmount"
              width="100"
            />*/}
            <Column
              title={<FormattedMessage id="operation" />}
              dataIndex="operate"
              key="storeId"
              width="100"
              render={(_text, record: any) => {
                return (
                  <AuthWrapper functionName="f_finance_manage_refund">
                    <a
                      onClick={() =>
                        history.push({
                          pathname: `/finance-manage-refund/${
                            record.storeId
                          }/${'income'}`,
                          state: {
                            beginTime:
                              dateRange.get('beginTime') + ' ' + '00:00:00',
                            endTime: dateRange.get('endTime') + ' ' + '23:59:59'
                          }
                        })
                      }
                    >
                      {<FormattedMessage id="details" />}
                    </a>
                  </AuthWrapper>
                );
              }}
            />
          </DataGrid>
        </div>
      </div>
    );
  }
}
