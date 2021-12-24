import React from 'react';
import { Table, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const columns = [
  {
    title: <FormattedMessage id="Prescriber.PrescriberID" />,
    dataIndex: 'clinicID',
    key: 'clinicID'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberName" />,
    dataIndex: 'clinicName',
    key: 'clinicName'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberPhone" />,
    dataIndex: 'clinicPhone',
    key: 'clinicPhone'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberCity" />,
    dataIndex: 'clinicCity',
    key: 'clinicCity'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberZip" />,
    dataIndex: 'clinicZip',
    key: 'clinicZip'
  },
  {
    title: <FormattedMessage id="Prescriber.Longitude" />,
    dataIndex: 'longitude',
    key: 'longitude'
  },
  {
    title: <FormattedMessage id="Prescriber.Latitude" />,
    dataIndex: 'latitude',
    key: 'latitude'
  },
  {
    title: <FormattedMessage id="Prescriber.Action" />,
    key: 'action',
    render: (text, record) => (
      <span>
        <Link to="/clinic-add">
          <FormattedMessage id="Prescriber.Edit" />,
        </Link>
        <Divider type="vertical" />
        <a>
          <FormattedMessage id="Prescriber.Delete" />,
        </a>
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

  handleTableChange(pagination) {}
  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <Button>
          <Link to="/clinic-add">
            <FormattedMessage id="Prescriber.Add" />
          </Link>
        </Button>
        <Table
          columns={columns}
          rowKey={(record) => record.clinicID}
          dataSource={data}
          pagination={pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
