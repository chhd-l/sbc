import React from 'react';
import { Table, Popconfirm } from 'antd';

interface Iprop {
  startDate: string;
  endDate: string;
}

export default class PrescribInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [
        {
          id: 5678,
          name: 'test',
          phone: '4321432',
          city: 'test',
          type: 'test',
          attribute: 'default'
        },
        {
          id: 5679,
          name: 'test',
          phone: '4321432',
          city: 'test',
          type: 'test',
          attribute: 'default'
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  render() {
    const { list, pagination } = this.state;
    const columns = [
      {
        title: 'Prescriber ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Prescriber name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Prescriber phone',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Prescriber city',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: 'Prescriber type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Attribute',
        dataIndex: 'attribute',
        key: 'attribute'
      },
      {
        title: 'Operation',
        key: 'oper',
        render: (_, record) => (
          <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
            <a className="iconfont iconDelete"></a>
          </Popconfirm>
        )
      }
    ];

    return (
      <div>
        <Table rowKey="id" columns={columns} dataSource={list} pagination={pagination} />
      </div>
    );
  }
}
