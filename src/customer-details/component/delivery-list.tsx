import React from 'react';
import { Table, Popconfirm, Button } from 'antd';
import { getAddressListByType } from '../webapi';
import { getCityList, getCountryList } from './webapi';

interface Iprop {
  startDate: string;
  endDate: string;
  customerId: string;
  type: 'DELIVERY' | 'BILLING';
}

export default class DeliveryList extends React.Component<Iprop, any> {
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
    this.getAddressList();
  }

  getAddressList = () => {
    this.setState({
      loading: true
    });
    getAddressListByType(this.props.customerId, this.props.type)
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.customerDeliveryAddressVOList
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, list } = this.state;
    const columns = [
      {
        title: 'Receiver name',
        dataIndex: 'consigneeName',
        key: 'name'
      },
      {
        title: 'Phone number',
        dataIndex: 'consigneeNumber',
        key: 'phone'
      },
      {
        title: 'Post code',
        dataIndex: 'postcode',
        key: 'postcode'
      },
      {
        title: 'Address',
        dataIndex: 'address1',
        key: 'address'
      },
      {
        title: 'Reference',
        dataIndex: 'rfc',
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
        <Button type="primary">Add new</Button>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={list} pagination={false} />
      </div>
    );
  }
}
