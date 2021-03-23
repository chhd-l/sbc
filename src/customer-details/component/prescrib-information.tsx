import React from 'react';
import { Table, Popconfirm } from 'antd';
import { getPrescriberList } from '../webapi';

interface Iprop {
  customerAccount: string;
}

export default class PrescribInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getPrescriberList();
  }

  getPrescriberList = () => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getPrescriberList({
      customerAccount: this.props.customerAccount,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.content,
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getPrescriberList()
    );
  };

  render() {
    const { list, pagination, loading } = this.state;
    const columns = [
      {
        title: 'Prescriber ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Prescriber name',
        dataIndex: 'prescriberName',
        key: 'name'
      },
      {
        title: 'Prescriber phone',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Prescriber city',
        dataIndex: 'primaryCity',
        key: 'city'
      },
      {
        title: 'Prescriber type',
        dataIndex: 'prescriberType',
        key: 'type'
      }
    ];

    return (
      <div>
        <Table
          rowKey="id"
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}
