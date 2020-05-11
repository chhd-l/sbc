import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider } from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

const columns = [
  {
    title: 'Clinic ID',
    dataIndex: 'clinicsId',
    key: 'clinicID'
  },
  {
    title: 'Clinic Name',
    dataIndex: 'clinicsName',
    key: 'clinicName'
  },
  {
    title: 'Clinic Phone',
    dataIndex: 'phone',
    key: 'clinicPhone'
  },
  {
    title: 'Clinic City',
    dataIndex: 'primaryCity',
    key: 'clinicCity'
  },
  {
    title: 'Clinic Zip',
    dataIndex: 'primaryZip',
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
        <Link to={'/clinic-edit/' + record.clinicsId}>Edit</Link>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    )
  }
];

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      clinicList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        clinicsId: '',
        clinicsName: '',
        phone: '',
        primaryCity: '',
        primaryZip: ''
      },
      loading: false
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);

    this.init();
  }
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state.searchForm;
    const { res } = await webapi.fetchClinicList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let clinicList = res.context.content;
      pagination.total = res.context.total;
      this.setState({
        pagination: pagination,
        clinicList: clinicList
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: pagination.current, pageSize: 10 });
  }
  render() {
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <Headline title="Clinic List" />
          {/*搜索条件*/}
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="Clinic ID"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'clinicsId',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore="Clinic Name"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'clinicsName',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore="Clinic Phone"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'phone',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                label="Clinic City"
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'primaryCity',
                    value
                  });
                }}
              >
                <Option value="">All</Option>
                <Option value="0">Mexico City</Option>
                <Option value="1">Monterrey</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Input
                addonBefore="Clinic Zip"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'primaryZip',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  this.onSearch();
                }}
              >
                Search
              </Button>
            </FormItem>
          </Form>
          <Button>
            <Link to="/clinic-add">Add</Link>
          </Button>
          <Table
            columns={columns}
            rowKey={(record) => record.clinicsId}
            dataSource={this.state.clinicList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
