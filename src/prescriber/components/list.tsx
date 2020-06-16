import React from 'react';
import { Table, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Prescriber ID',
    dataIndex: 'clinicID',
    key: 'clinicID'
  },
  {
    title: 'Prescriber Name',
    dataIndex: 'clinicName',
    key: 'clinicName'
  },
  {
    title: 'Prescriber Phone',
    dataIndex: 'clinicPhone',
    key: 'clinicPhone'
  },
  {
    title: 'Prescriber City',
    dataIndex: 'clinicCity',
    key: 'clinicCity'
  },
  {
    title: 'Prescriber Zip',
    dataIndex: 'clinicZip',
    key: 'clinicZip'
  },
  {
    title: 'Longitude',
    dataIndex: 'longitude',
    key: 'longitude'
  },
  {
    title: 'Latitude',
    dataIndex: 'latitude',
    key: 'latitude'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Link to="/clinic-add">Edit</Link>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    )
  }
];
const data = [
  {
    clinicID: '1',
    clinicName: 'John Brown',
    clinicPhone: 32,
    clinicCity: 'New York No. 1 Lake Park',
    clinicZip: '00123',
    longitude: 77.12,
    latitude: 38.5
  },
  {
    clinicID: '2',
    clinicName: 'John Brown',
    clinicPhone: 32,
    clinicCity: 'New York No. 1 Lake Park',
    clinicZip: '00123',
    longitude: 77.12,
    latitude: 38.5
  },
  {
    clinicID: '3',
    clinicName: 'John Brown',
    clinicPhone: 32,
    clinicCity: 'New York No. 1 Lake Park',
    clinicZip: '00123',
    longitude: 77.12,
    latitude: 38.5
  }
];

export default class SearchForm extends React.Component<any, any> {
  state = {
    data: data,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 20
    },
    loading: false
  };

  handleTableChange(pagination) {
    console.log(pagination);
  }
  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <Button>
          <Link to="/clinic-add">Add</Link>
        </Button>
        <Table
          columns={columns}
          rowKey={(record) => record.clinicID}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
