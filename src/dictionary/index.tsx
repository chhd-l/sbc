import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider, message, Tooltip, Popconfirm, Spin } from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

export default class DitionaryList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: 'Value',
          dataIndex: 'valueEn',
          key: 'value'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: 'Priority',
          dataIndex: 'priority',
          key: 'priority'
        },
        {
          title: 'Operation',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => (
            <span>
              <Tooltip placement="top" title="Edit">
                <Link to={'/dictionary-edit/' + record.id} className="iconfont iconEdit"></Link>
              </Tooltip>

              <Divider type="vertical" />

              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteDictionary(record.id)} okText="Confirm" cancelText="Cancel">
                <Tooltip placement="top" title="Delete">
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </span>
          )
        }
      ],
      dictionaryData: [],
      dictionaryTypes: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        keywords: '',
        type: ''
      },
      loading: true
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.queryClinicsDictionary();
    this.getDictionary();
  }
  getDictionary = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state.searchForm;
    this.setState({
      loading: true
    });
    const { res } = await webapi.fetchDictionaryList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let dictionaryData = res.context.sysDictionaryPage.content;
      pagination.total = res.context.sysDictionaryPage.total;
      this.setState({
        pagination: pagination,
        dictionaryData: dictionaryData,
        loading: false
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
  queryClinicsDictionary = async () => {
    const { res } = await webapi.getDictionaryTypes();
    if (res.code === 'K-000000') {
      this.setState({
        dictionaryTypes: res.context
      });
    } else {
      message.error(res.message);
    }
  };
  onSearch = () => {
    this.getDictionary({ pageNum: 0, pageSize: 10 });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.getDictionary({ pageNum: pagination.current - 1, pageSize: 10 });
  }
  deleteDictionary = async (id) => {
    const { res } = await webapi.deleteDictionary({
      id: id
    });
    if (res.code === 'K-000000') {
      message.success('Operate successfully');
      this.getDictionary({
        pageNum: this.state.pagination.current - 1,
        pageSize: 10
      });
    } else {
      message.error(res.message || 'delete faild');
    }
  };
  render() {
    const { columns, dictionaryTypes } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title="Dictionary" />
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="Keyword"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'keywords',
                    value
                  });
                }}
                placeholder="Please input name or discription"
                style={{ width: 300 }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                defaultValue="All"
                label="Type"
                showSearch
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'type',
                    value
                  });
                }}
                style={{ width: 300 }}
              >
                <Option value="">All</Option>
                {dictionaryTypes.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  this.onSearch();
                }}
              >
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>
            </Form.Item>
          </Form>
          <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }}>
            <Link to="/dictionary-add">Add</Link>
          </Button>
        </div>
        <div className="container">
          <Spin spinning={this.state.loading}  indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <Table rowKey={(record, index) => index} dataSource={this.state.dictionaryData} columns={columns} pagination={this.state.pagination} onChange={this.handleTableChange} />
          </Spin>
        </div>
      </div>
    );
  }
}
