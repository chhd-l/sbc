import React from 'react';
import { Table, Popconfirm } from 'antd';

interface Iprop {
  startDate: string;
  endDate: string;
}

export default class DeliveryList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [
        {
          id: 5678,
          name: 'test',
          phone: '4321432',
          postcode: '32143',
          address: 'test',
          reference: ''
        },
        {
          id: 5678,
          name: 'test',
          phone: '4321432',
          postcode: '32143',
          address: 'test',
          reference: ''
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
        title: 'Receiver name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Phone number',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Post code',
        dataIndex: 'postcode',
        key: 'postcode'
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference'
      },
      {
        title: 'Operation',
        key: 'oper',
        render: (_, record) => (
          <div>
            <a className="iconfont iconEdit" style={{ marginRight: 10 }}></a>
            <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
              <a className="iconfont iconDelete"></a>
            </Popconfirm>
          </div>
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
