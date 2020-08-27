import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Tooltip
} from 'antd';
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
          title: 'Discription',
          dataIndex: 'description',
          key: 'discription'
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
                <Link
                  to={'/dictionary-edit/' + record.id}
                  className="iconfont iconEdit"
                ></Link>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip placement="top" title="Delete">
                <a
                  onClick={() => this.deleteDictionary(record.id)}
                  className="iconfont iconDelete"
                ></a>
              </Tooltip>
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
    const query = this.state.searchForm;
    const { res } = await webapi.fetchDictionaryList({
      ...query,
      pageNum,
      pageSize
    });

    this.setState({
      loading: true
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
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginBottom: '10px' }}
          >
            <Link to="/dictionary-add">Add</Link>
          </Button>
        </div>
        <div className="container">
          <Table
            rowKey={(record, index) => index}
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
