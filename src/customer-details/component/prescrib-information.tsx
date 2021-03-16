import React from 'react';
import { Table, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

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
        title: <FormattedMessage id="PetOwner.PrescriberID" />,
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: <FormattedMessage id="PetOwner.PrescriberName" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="PetOwner.PrescriberPhone" />,
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: <FormattedMessage id="PetOwner.PrescriberCity" />,
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: <FormattedMessage id="PetOwner.PrescriberType" />,
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: <FormattedMessage id="PetOwner.Attribute" />,
        dataIndex: 'attribute',
        key: 'attribute'
      },
      {
        title: <FormattedMessage id="PetOwner.Operation" />,
        key: 'oper',
        render: (_, record) => (
          <Popconfirm placement="topRight" title={<FormattedMessage id="PetOwner.deleteThisItem" />} onConfirm={() => {}} okText={<FormattedMessage id="PetOwner.Confirm" />} cancelText={<FormattedMessage id="PetOwner.Cancel" />}>
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
