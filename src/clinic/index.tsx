import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider, message } from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Prescriber ID',
          dataIndex: 'clinicsId',
          key: 'clinicID'
        },
        {
          title: 'Prescriber Name',
          dataIndex: 'clinicsName',
          key: 'clinicName'
        },
        {
          title: 'Prescriber Phone',
          dataIndex: 'phone',
          key: 'clinicPhone'
        },
        {
          title: 'Prescriber City',
          dataIndex: 'primaryCity',
          key: 'clinicCity'
        },
        {
          title: 'Prescriber Zip',
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
          title: 'Prescriber Type',
          dataIndex: 'prescriberType',
          key: 'prescriberType'
        },
        {
          title: 'Reward Rate',
          dataIndex: 'rewardRate',
          key: 'rewardRate'
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <Link to={'/clinic-edit/' + record.clinicsId}>Edit</Link>
              <Divider type="vertical" />
              <a onClick={() => this.delClinic(record.clinicsId)}>Delete</a>
            </span>
          )
        }
      ],
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
  delClinic = async (id) => {
    const { res } = await webapi.deleteClinic({
      clinicsId: id
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'delete success');
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    } else {
      message.error(res.message || 'delete faild');
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
    const { columns } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <Headline title="Prescriber List" />
          {/*搜索条件*/}
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="Prescriber ID"
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
                addonBefore="Prescriber Name"
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
                addonBefore="Prescriber Phone"
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
                label="Prescriber City"
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
                addonBefore="Prescriber Zip"
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
