import React from 'react';
import { Popconfirm, Switch, Tooltip, Table } from 'antd';

/**
 * 订单收款单列表
 */
export default class TaxesTable extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.dataList) !== JSON.stringify(state.dataList)) {
      return {
        dataList: props.dataList,
        pagination: props.pagination
      };
    }

    return null;
  }

  updateStatus = (check, row) => {
    console.log(check, row);
  };

  deleteTax = (id) => {
    this.props.deleteFunction(id);
  };
  handleTableChange = (pagination) => {
    this.props.tableChangeFunction(pagination);
  };
  openEditPage = (row) => {
    this.props.editFunction(row);
  };

  render() {
    const { dataList, pagination } = this.state;
    const columns = [
      {
        title: 'No.',
        key: 'index',
        width: '6%',
        render: (text, row, index) => <p>{index + 1}</p>
      },
      {
        title: 'Zone Name',
        key: 'zoneName',
        dataIndex: 'taxZoneName',
        width: '10%'
      },
      {
        title: 'Zone Type',
        key: 'zoneType',
        dataIndex: 'taxZoneType',
        width: '10%'
      },
      {
        title: 'Rate(range 0-1)',
        key: 'rate',
        dataIndex: 'taxRates',
        width: '10%'
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        width: '10%',
        render: (text, row) => {
          const check = +text ? true : false;
          return (
            <Popconfirm title={'Are you sure to ' + (check ? ' disable' : 'enable') + ' this?'} onConfirm={() => this.updateStatus(check, row)} okText="Yes" cancelText="No">
              <Switch checked={check} />
            </Popconfirm>
          );
        }
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        className: 'drag-visible',
        width: '8%',
        render: (text, row) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <a style={{ marginRight: 10 }} className="iconfont iconEdit" onClick={() => this.openEditPage(row)}></a>
            </Tooltip>

            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTax(row.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title="Delete">
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];
    return <Table rowKey="id" columns={columns} dataSource={dataList} pagination={pagination} onChange={this.handleTableChange}></Table>;
  }
}
