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
          key: 'clinicID',
          width: 140
        },
        {
          title: 'Prescriber Name',
          dataIndex: 'clinicsName',
          key: 'clinicName',
          width: 180
        },
        {
          title: 'Prescriber Phone',
          dataIndex: 'phone',
          key: 'clinicPhone',
          width: 140
        },
        {
          title: 'Prescriber City',
          dataIndex: 'primaryCity',
          key: 'clinicCity',
          width: 140
        },
        {
          title: 'Prescriber Zip',
          dataIndex: 'primaryZip',
          key: 'clinicZip',
          width: 140
        },
        {
          title: 'Latitude',
          dataIndex: 'latitude',
          key: 'latitude',
          width: 120
        },
        {
          title: 'Longitude',
          dataIndex: 'longitude',
          key: 'longitude',
          width: 120
        },

        {
          title: 'Prescriber Type',
          dataIndex: 'clinicsType',
          key: 'clinicsType',
          width: 140
        },
        {
          title: 'Reward Period',
          dataIndex: 'rewardType',
          key: 'rewardRate',
          width: 140
        },
        {
          title: 'Prescriber Status',
          dataIndex: 'enabled',
          key: 'enabled',
          width: 140,
          render: (text, record) => (
            <p>{record.enabled ? 'Enabled' : 'Disabled'}</p>
          )
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          width: 200,
          render: (text, record) => (
            <span>
              <Link to={'/clinic-edit/' + record.clinicsId}>Edit</Link>
              <Divider type="vertical" />
              <a onClick={() => this.enableAndDisable(record.clinicsId)}>
                {record.enabled ? 'Disable' : 'Enable'}
              </a>
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
        primaryZip: '',
        clinicsType: '',
        enabled: true
      },
      cityArr: [],
      typeArr: [],
      loading: false
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.queryClinicsDictionary('city');
    this.queryClinicsDictionary('clinicType');
    this.init();
  }
  init = async ({ pageNum, pageSize } = { pageNum: 1, pageSize: 10 }) => {
    const query = this.state.searchForm;
    query.enabled =
      query.enabled === 'true'
        ? true
        : query.enabled === 'false'
        ? false
        : null;
    pageNum = pageNum - 1;
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
  queryClinicsDictionary = async (type: String) => {
    const { res } = await webapi.queryClinicsDictionary({
      type: type
    });
    if (res.code === 'K-000000') {
      if (type === 'city') {
        this.setState({
          cityArr: res.context
        });
      }
      if (type === 'clinicType') {
        this.setState({
          typeArr: res.context
        });
      }
    } else {
      message.error('Unsuccessful');
    }
  };
  delClinic = async (id) => {
    const { res } = await webapi.deleteClinic({
      clinicsId: id
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'Successful');
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    } else {
      message.error('Unsuccessful');
    }
  };
  enableAndDisable = async (id) => {
    // message.info('API under development');
    const { res } = await webapi.enableAndDisable(id);
    if (res.code === 'K-000000') {
      message.success(res.message || 'Successful');
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    } else {
      message.error('Unsuccessful');
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
    const { pagination } = this.state;
    pagination.pageNum = 1;
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: 1, pageSize: 10 });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: pagination.current, pageSize: 10 });
  }

  render() {
    const { columns, cityArr, typeArr, searchForm } = this.state;
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
                defaultValue=""
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
                {cityArr.map((item) => (
                  <Option value={item.valueEn} key={item.id}>
                    {item.name}
                  </Option>
                ))}
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
              <SelectGroup
                defaultValue=""
                label="Prescriber Type"
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'clinicsType',
                    value
                  });
                }}
              >
                <Option value="">All</Option>
                {typeArr.map((item) => (
                  <Option value={item.valueEn} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>

            <FormItem>
              <SelectGroup
                defaultValue="true"
                label="Prescriber Status"
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'enabled',
                    value
                  });
                }}
              >
                <Option value="">All</Option>
                <Option value="true" key="enabled">
                  Enabled
                </Option>
                <Option value="false" key="disabled">
                  Disabled
                </Option>
              </SelectGroup>
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
          <Button style={{ backgroundColor: '#e2001a', color: '#FFFFFF' }}>
            <Link to="/clinic-add">Add</Link>
          </Button>
          <Table
            columns={columns}
            rowKey={(record) => record.clinicsId}
            dataSource={this.state.clinicList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
