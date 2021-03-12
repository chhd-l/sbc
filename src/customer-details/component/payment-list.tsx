import React from 'react';
import { Table, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
interface Iprop {
  startDate: string;
  endDate: string;
}

export default class PaymentList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [
        {
          id: 5678,
          cardno: '**** **** **** 3213',
          type: 'test',
          holder: 'test',
          phone: '4321432',
          email: 'xx@xx.com'
        },
        {
          id: 5678,
          cardno: '**** **** **** 3213',
          type: 'test',
          holder: 'test',
          phone: '4321432',
          email: 'xx@xx.com'
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
        title: <FormattedMessage id="PetOwner.CardNumber" />,
        dataIndex: 'cardno',
        key: 'cardno'
      },
      {
        title: <FormattedMessage id="PetOwner.CardType" />,
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: <FormattedMessage id="PetOwner.CardHolder" />,
        dataIndex: 'holder',
        key: 'holder'
      },
      {
        title: <FormattedMessage id="PetOwner.EmailAddress" />,
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: <FormattedMessage id="PetOwner.PhoneNumber" />,
        dataIndex: 'phone',
        key: 'phone'
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
