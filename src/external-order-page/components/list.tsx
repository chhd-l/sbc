import React from 'react';
import { Relax, Store } from 'plume2';
import { DataGrid, noop, AuthWrapper, history, cache } from 'qmkit';
import { List } from 'immutable';
import { Popconfirm } from 'antd';
import momnet from 'moment';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
type TList = List<any>;
const Column = DataGrid;

/**
 * 订单收款单列表
 */
@Relax
export default class OrderInvoiceList extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      ccccccc: 'String';
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: any;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onSearchByInvoiceId: Function;
      current: number;
      getPrescriberId: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    ccccccc: 'ccccccc',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onSearchByInvoiceId: noop,
    getPrescriberId: noop,
    current: 'current',
    searchForm: 'searchForm'
  };

  render() {
    const { loading, total, pageSize, selected, dataList, onSelect, init, current } = this.props.relaxProps;
    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
        /*rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}*/
        rowKey={(record: any, i) => i}
        pagination={{
          pageSize,
          total,
          fitColumns: true,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
        /*dataSource = {[
          { id: '1', firstName: 'John', lastName: 'Bobson'},
          { id: '2', firstName: 'Bob', lastName: 'Mclaren'}
        ]}*/
      >
        <Column
          title={<FormattedMessage id="ExternalOrderPage.ClinicsCRM" />}
          key="clientId"
          dataIndex="clientId"
          /*render={(invoiceTime) => (
            <span>
              {invoiceTime
                ? momnet(invoiceTime).format(Const.TIME_FORMAT).toString()
                : '-'}
            </span>
          )}*/
        />
        <Column title={<FormattedMessage id="ExternalOrderPage.ClinicsName" />} key="clinicsName" dataIndex="clinicsName" />
        <Column title={<FormattedMessage id="ExternalOrderPage.ClinicsRegion" />} key="clinicsCity" dataIndex="clinicsCity" />
        <Column title={<FormattedMessage id="ExternalOrderPage.PrescriptionId" />} key="prescriptionId" dataIndex="prescriptionId" />
        <Column
          title={<FormattedMessage id="ExternalOrderPage.OrderTime" />}
          dataIndex="date"
          key="date"
          render={(text, _rowData: any) => {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          }}
        />

        <Column
          title={<FormattedMessage id="ExternalOrderPage.OrderNumber" />}
          dataIndex="orderId"
          key="orderId"
          //render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />
        <Column title={<FormattedMessage id="ExternalOrderPage.ProductId" />} dataIndex="productId" key="productId" />
        <Column title={<FormattedMessage id="ExternalOrderPage.UnitPrice" />} key="price" dataIndex="price" render={(orderPrice) => <span>{orderPrice != null ? `${orderPrice.toFixed(2) + ' ' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}` : '-'}</span>} />

        <Column title={<FormattedMessage id="ExternalOrderPage.Qty" />} width="3%" key="quantity" dataIndex="quantity" />
        <Column
          title={<FormattedMessage id="ExternalOrderPage.OrderProductAmount" />}
          key="totalIncome"
          dataIndex="totalIncome"
          width="11%"
          render={(orderPrice) => <span>{orderPrice != null ? `${orderPrice.toFixed(2) + ' ' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}` : '-'}</span>}
        />
        <Column
          title={<FormattedMessage id="ExternalOrderPage.TotalOrderAmount" />}
          key="orderTotalIncome"
          width="11%"
          dataIndex="orderTotalIncome"
          render={(orderTotalIncome) => <span>{orderTotalIncome != null ? `${orderTotalIncome.toFixed(2) + ' ' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}` : '-'}</span>}
        />

        <Column title={<FormattedMessage id="ExternalOrderPage.OrderStatus" />} key="orderStatus" dataIndex="orderStatus" />
        {/*<Column
          title='Unit price'
          width="8%"
          render={(text, record: any, i) => {
            return (
              <a
                href="javascript:void(0)"
                onClick={() => this._renderOperate(text)}
              >
                Details
              </a>
            );
          }}
          // render={(rowInfo) => this._renderOperate(rowInfo)}
        />*/}
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { getPrescriberId } = this.props.relaxProps;

    getPrescriberId({ prescriberId: rowInfo });
    history.push({
      pathname: '/finance-reward-details',
      params: {
        prescriberId: rowInfo.prescriberId,
        prescriberName: rowInfo.prescriberName
      }
    });

    //return (<Link to={{pathname :'/finance-reward-details', state : { name : rowInfo }}}>Details</Link>)

    /*const { invoiceState, orderInvoiceId } = rowInfo;

    //待确认
    return checkAuth('fetchOrderInovices') ||
      checkAuth('destoryOpenOrderInvoice')
      ? this._renderMenu(orderInvoiceId, invoiceState)
      : '-';*/
  }

  _renderMenu = (id: string, invoiceState: number) => {
    const { onDestory, onConfirm, onSearchByInvoiceId } = this.props.relaxProps;

    return (
      <div className="operation-box">
        <AuthWrapper functionName="fetchOrderInovices">
          <a href="javascript:void(0);" onClick={() => onSearchByInvoiceId(id)}>
            {<FormattedMessage id="ExternalOrderPage.view" />}
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="destoryOpenOrderInvoice">
          <Popconfirm
            title={invoiceState == 0 ? <FormattedMessage id="ExternalOrderPage.Confirm" /> : <FormattedMessage id="ExternalOrderPage.Cancel" />}
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText={<FormattedMessage id="ExternalOrderPage.btnConfirm" />}
            cancelText={<FormattedMessage id="ExternalOrderPage.btnCancel" />}
          >
            <a href="javascript:void(0);">{invoiceState == 0 ? 'Billing' : 'Cancellation'}</a>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  };
}
