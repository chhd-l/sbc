import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { cache, DataGrid, FindArea, noop } from 'qmkit';
import { Relax } from 'plume2';

const Column = DataGrid;

@Relax
export default class ReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      columns: [],
      selectedRowKeys: []
    };
  }
  props: {
    relaxProps?: {
      onProductReportPage: Function;
      total: number;
      pageSize: number;
      current: number;
      productReportPage: any;
      loading: boolean;
      getDate: any;
      skuText: any;
    };
  };

  static relaxProps = {
    onProductReportPage: noop,
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    productReportPage: 'productReportPage',
    loading: 'loading',
    getDate: 'getDate',
    skuText: 'skuText'
  };

  componentDidMount() {}

  render() {
    const { onProductReportPage, total, pageSize, current, getDate,productReportPage, loading, skuText } = this.props.relaxProps;
    console.log(total, '----------total');
    return (
      <div>
        <DataGrid
          //loading={{ spinning: loading, indicator:<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" /> }}
          rowKey="serialNum"
          /*  pagination={{
            current: selfCurrentPage,
            pageSize: selfPageSize,
            total: selfTotal,
            onChange: (pageNum, pageSize) => {
              initForSelf({ pageNum: pageNum - 1, pageSize });
            }
          }}*/
          pagination={{
            pageSize,
            total,
            current: current - 1,
            onChange: (pageNum, pageSize) => {
              onProductReportPage({...getDate, ...{ pageNum: pageNum, pageSize, sortName: 'revenue', skuText }});
            }
          }}
          dataSource={productReportPage && productReportPage.toJS()}
        >
          <Column title={<FormattedMessage id="Analysis.No" />} key="serialNum" dataIndex="serialNum" width="8%" />
          <Column title={<FormattedMessage id="Analysis.Product" />} key="skuName" dataIndex="skuName" width="200px" />
          <Column title={<FormattedMessage id="Analysis.SKU" />} key="SKU" dataIndex="skuCode" />
          <Column title={<FormattedMessage id="Analysis.SalesVolume" />} key="salesVolume" dataIndex="salesVolume" />
          <Column
            title={<FormattedMessage id="Analysis.Revenue" />}
            dataIndex="revenue"
            key="revenue"
            render={(text) => {
              return text ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + ' ' + text : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + ' ' + 0;
            }}
          />

          <Column
            title={<FormattedMessage id="Analysis.Rating" />}
            dataIndex="rating"
            key="Rating"
            render={(text) => {
              return text ? text : '--';
            }}
          />
        </DataGrid>
        {/*<Table rowSelection={rowSelection} dataSource={list} columns={columns} loading={this.props.loading} />;*/}
      </div>
    );
  }
}
