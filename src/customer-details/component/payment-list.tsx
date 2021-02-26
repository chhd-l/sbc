import React from 'react';
import { Table, Popconfirm } from 'antd';
import { getPaymentMethods } from '../webapi';
import { cache } from 'qmkit';

interface Iprop {
  startDate: string;
  endDate: string;
  customerId: string;
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

  componentDidMount() {
    this.getCardList();
  }

  getCardList = () => {
    this.setState({ loading: true });
    getPaymentMethods({
      customerId: this.props.customerId,
      storeId: JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)).storeId || ''
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.sort((a, b) => b.isDefault - a.isDefault)
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { list, pagination } = this.state;
    const columns = [
      {
        title: 'Card number',
        dataIndex: 'cardno',
        key: 'cardno'
      },
      {
        title: 'Card type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Card holder',
        dataIndex: 'holder',
        key: 'holder'
      },
      {
        title: 'E-mail address',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Phone number',
        dataIndex: 'phone',
        key: 'phone'
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
