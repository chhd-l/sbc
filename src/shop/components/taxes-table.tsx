import React from 'react';
import { Relax, Store } from 'plume2';
import { DataGrid, noop, AuthWrapper, cache, history } from 'qmkit';
import { List } from 'immutable';
import { Divider, message, Popconfirm, Switch, Tooltip, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

type TList = List<any>;
const Column = DataGrid;

/**
 * 订单收款单列表
 */
@Relax
export default class TaxesTable extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      current: number;
      onTaxesAddVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    onTaxesAddVisible: noop
  };
  confirm = (check, id) => {
    this.onChange(!check, id);
  };
  cancel = () => {
    message.info('canceled');
  };

  showModal = () => {
    const { onTaxesAddVisible } = this.props.relaxProps;
    onTaxesAddVisible(true);
  };

  render() {
    const { loading, total, pageSize, current } = this.props.relaxProps;
    //console.log(this.props.relaxProps.searchForm.toJS(),'--------===');

    // @ts-ignore
    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
        rowKey="orderInvoiceId"
        pagination={{
          pageSize,
          total,
          fitColumns: true,
          current: current
          /*onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }*/
        }}
        dataSource={[
          {
            id: 1955,
            parentId: null,
            type: '1',
            name: '1',
            storeId: 123456858,
            Status: 0
          },
          {
            id: 1955,
            parentId: null,
            type: '1',
            name: '1',
            storeId: 123456858,
            Status: 1
          }
        ]}
        //dataSource={dataList.toJS()}
      >
        <Column
          title="No."
          width="6%"
          key="index"
          dataIndex="index"
          render={(_text: any, _rowData: any, index: any) => {
            return index + 1;
          }}
        />
        <Column title="Zone Name" key="prescriberId" dataIndex="prescriberId" />
        <Column title="Zone type" key="prescriberName" dataIndex="prescriberName" />
        <Column title="Zone range" key="orderQuantity" dataIndex="orderQuantity" />
        <Column title="Rate(range 0-1)" dataIndex="orderAmount" key="orderAmount" />
        <Column
          title="Status"
          dataIndex="Status"
          key="Status"
          render={(rowInfo) => {
            const check = rowInfo === 0 ? false : true;
            return (
              <Popconfirm title={check ? 'Are you sure disable this consent?' : 'Are you sure able this consent?'} onConfirm={() => this.confirm(check, rowInfo)} onCancel={this.cancel} okText="Yes" cancelText="No">
                <Switch
                  //loading={loading}
                  checked={check}
                  // onChange={this.onValid}
                />
              </Popconfirm>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="operation" />}
          width="8%"
          render={(text, record: any, i) => {
            return (
              <div>
                <a className="iconfont iconEdit" onClick={this.showModal}></a>

                <Divider type="vertical" />

                <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a type="link" className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
