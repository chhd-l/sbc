import React from 'react';
import { Table, Popconfirm, message } from 'antd';
import { getPaymentMethods, deleteCard } from '../webapi';
import { cache } from 'qmkit';

interface Iprop {
  customerId: string;
}

export default class PaymentList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: []
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

  deleteCard = (id) => {
    this.setState({ loading: true });
    deleteCard({ id })
      .then((data) => {
        message.success(data.res.message);
        this.getCardList();
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { list, loading } = this.state;
    const columns = [
      {
        title: 'Card number',
        dataIndex: 'cardno',
        key: 'cardno',
        render: (_, record) => (
          <>
            {record.paymentType === 'PAYU' ? (
              <div>{record.payuPaymentMethod && record.payuPaymentMethod.last_4_digits ? '**** **** **** ' + record.payuPaymentMethod.last_4_digits : ''}</div>
            ) : (
              <div>{record.adyenPaymentMethod && record.adyenPaymentMethod.lastFour ? '**** **** **** ' + record.adyenPaymentMethod.lastFour : ''}</div>
            )}
          </>
        )
      },
      {
        title: 'Card type',
        dataIndex: 'type',
        key: 'type',
        render: (_, record) => <>{record.paymentType === 'PAYU' ? <div>{record.payuPaymentMethod && record.payuPaymentMethod.card_type}</div> : <div>{record.adyenPaymentMethod && record.adyenPaymentMethod.card_type}</div>}</>
      },
      {
        title: 'Card holder',
        dataIndex: 'holder',
        key: 'holder',
        render: (_, record) => <>{record.paymentType === 'PAYU' ? <div>{record.payuPaymentMethod && record.payuPaymentMethod.holder_name}</div> : <div>{record.adyenPaymentMethod && record.adyenPaymentMethod.holder_name}</div>}</>
      },
      {
        title: 'E-mail address',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Phone number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber'
      },
      {
        title: 'Operation',
        key: 'oper',
        render: (_, record) => (
          <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.deleteCard(record.id)} okText="Confirm" cancelText="Cancel">
            <a className="iconfont iconDelete"></a>
          </Popconfirm>
        )
      }
    ];

    return (
      <div>
        <Table
          rowKey="id"
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </div>
    );
  }
}
