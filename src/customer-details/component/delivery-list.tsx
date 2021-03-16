import React from 'react';
import { Table, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

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
        title: <FormattedMessage id="PetOwner.ReceiverName" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="PetOwner.PhoneNumber" />,
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: <FormattedMessage id="PetOwner.PostCode" />,
        dataIndex: 'postcode',
        key: 'postcode'
      },
      {
        title: <FormattedMessage id="PetOwner.Address" />,
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: <FormattedMessage id="PetOwner.Reference" />,
        dataIndex: 'reference',
        key: 'reference'
      },
      {
        title: <FormattedMessage id="PetOwner.Operation" />,
        key: 'oper',
        render: (_, record) => (
          <div>
            <a className="iconfont iconEdit" style={{ marginRight: 10 }}></a>
            <Popconfirm placement="topRight" title={<FormattedMessage id="PetOwner.deleteThisItem" />} onConfirm={() => {}} okText={<FormattedMessage id="PetOwner.Confirm" />} cancelText={<FormattedMessage id="PetOwner.Cancel" />}>
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
