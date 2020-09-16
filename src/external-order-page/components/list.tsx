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
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      current
    } = this.props.relaxProps;
    //console.log(this.props.relaxProps.searchForm.toJS(),'--------===');
    return (
      <DataGrid
        loading={loading}
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
          title="Clinics CRM id"
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
        <Column
          title="Clinics name"
          key="clinicsName"
          dataIndex="clinicsName"
        />
        <Column
          title="Clinics region"
          key="clinicsCity"
          dataIndex="clinicsCity"
        />
        <Column
          title="Prescription id"
          key="prescriptionId"
          dataIndex="prescriptionId"
        />
        <Column
          title="Order time"
          dataIndex="date"
          key="date"
          render={(text, _rowData: any) => {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          }}
        />

        <Column
          title="Order number"
          dataIndex="orderId"
          key="orderId"
          //render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />
        <Column title="Product id" dataIndex="productId" key="productId" />
        <Column title="Unit price" key="price" dataIndex="price" />
        <Column title="Qty" key="quantity" dataIndex="quantity" />
        <Column
          title="Order product amount"
          key="totalIncome"
          dataIndex="totalIncome"
          width="12%"
          render={(orderPrice) => (
            <span>
              {orderPrice != null
                ? `${
                    orderPrice.toFixed(2) +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)
                  }`
                : '-'}
            </span>
          )}
        />
        <Column
          title="Order status"
          key="orderStatus"
          dataIndex="orderStatus"
        />
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
    //console.log(this.props.relaxProps.ccccccc);
    history.push({
      pathname: '/finance-reward-details',
      params: {
        prescriberId: rowInfo.prescriberId,
        prescriberName: rowInfo.prescriberName
      }
    });

    /*setTimeout(()=>{
      console.log(this.props.relaxProps.ccccccc);

    },300)*/
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
            {<FormattedMessage id="view" />}
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="destoryOpenOrderInvoice">
          <Popconfirm
            title={
              invoiceState == 0
                ? 'Do you confirm to bill？'
                : 'Do you confirm to cancel bill record？'
            }
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a href="javascript:void(0);">
              {invoiceState == 0 ? 'Billing' : 'Cancellation'}
            </a>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  };
}
