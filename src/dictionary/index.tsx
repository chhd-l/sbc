import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider, message } from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
const { Column } = Table;

const FormItem = Form.Item;
const Option = Select.Option;

export default class DitionaryList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'type',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: 'value',
          dataIndex: 'valueEn',
          key: 'value'
        },
        {
          title: 'discription',
          dataIndex: 'description',
          key: 'discription'
        },
        {
          title: 'priority',
          dataIndex: 'priority',
          key: 'priority'
        },
        {
          title: 'Option',
          dataIndex: 'option',
          key: 'option',
          render: (text, record) => (
            <span>
              <Link to={'/dictionary-edit/' + record.id}>Edit</Link>
              <Divider type="vertical" />
              <a onClick={() => this.deleteDictionary(record.id)}>Delete</a>
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
        keyword: '',
        type: ''
      },
      loading: false
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.queryClinicsDictionary();
    this.getDictionary();
  }
  getDictionary = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    this.setState({
      loading: true
    });
    const query = this.state.searchForm;
    const { res } = await webapi.fetchDictionaryList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let dictionaryData = res.context.clinicsDictionaryVOList;
      pagination.total = res.context.total;
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
        dictionaryTypes: res.context.typeList
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
      message.success(res.message || 'delete success');
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
        <div className="container">
          <Headline title="Dictionary" />
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="Keyword"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'keyword',
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
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'type',
                    value
                  });
                }}
                style={{ width: 80 }}
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
                onClick={(e) => {
                  e.preventDefault();
                  this.onSearch();
                }}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
          <Button>
            <Link to="/dictionary-add">Add</Link>
          </Button>
          <Table
            rowKey={(record) => record.id}
            dataSource={this.state.dictionaryData}
            columns={columns}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
