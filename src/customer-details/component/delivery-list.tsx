import React from 'react';
import { Table, Popconfirm, Button } from 'antd';
import { getAddressListByType, delAddress } from '../webapi';

interface Iprop {
  customerId: string;
  type: 'DELIVERY' | 'BILLING';
  onEdit?: Function;
}

const NEW_ADDRESS_TEMPLATE = {
  firstName: '',
  lastName: '',
  consigneeNumber: '',
  postCode: '',
  countryId: null,
  region: '',
  province: '',
  city: '',
  address1: '',
  address2: '',
  entrance: '',
  apartment: '',
  rfc: ''
};

export default class DeliveryList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: []
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

  onDeleteAddress = (id: string) => {
    this.setState({
      loading: true
    });
    delAddress(id)
      .then((data) => {
        this.getAddressList();
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, list } = this.state;
    const { onEdit } = this.props;
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
        dataIndex: 'postCode',
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
            <Button type="link" size="small" onClick={() => onEdit({ ...NEW_ADDRESS_TEMPLATE, ...record })}>
              <i className="iconfont iconEdit"></i>
            </Button>
            <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.onDeleteAddress(record.deliveryAddressId)} okText="Confirm" cancelText="Cancel">
              <Button type="link" size="small">
                <i className="iconfont iconDelete"></i>
              </Button>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onEdit(NEW_ADDRESS_TEMPLATE)} style={{ marginBottom: 10 }}>
          Add new
        </Button>
        <Table
          rowKey="deliveryAddressId"
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </div>
    );
  }
}
