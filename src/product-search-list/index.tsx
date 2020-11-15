import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Tabs, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as webapi from './webapi';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

export default class ProductSearchList extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: 'Search',
      allSerchResults: [],
      allPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      allLoading: false,
      noSearchResult: [],
      noResultPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      noResultLoading: false,
      dateRange: []
    };
    this.dateRangeChange = this.dateRangeChange.bind(this);
    this.allTableChange = this.allTableChange.bind(this);
    this.getAllSearchResult = this.getAllSearchResult.bind(this);
    this.noResultTableChange = this.noResultTableChange.bind(this);
    this.getNoSearchResults = this.getNoSearchResults.bind(this);
  }
  dateRangeChange(dateRange) {}

  allTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAllSearchResult()
    );
  };
  getAllSearchResult = () => {
    const { dateRange, allPagination } = this.state;
    let params = {
      startDate: dateRange[0],
      endDate: dateRange[1],
      pageNum: allPagination.current - 1,
      pageSize: allPagination.pageSize
    };
    this.setState({
      loading: true
    });
    webapi
      .getAllSearchData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          allPagination.total = res.context.total;
          this.setState({
            allSerchResults: res.context.content,
            allPagination: allPagination,
            allLoading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            allLoading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          allLoading: false
        });
      });
  };

  noResultTableChange = (pagination: any) => {
    this.setState(
      {
        noResultPagination: pagination
      },
      () => this.getNoSearchResults()
    );
  };
  getNoSearchResults = () => {
    const { dateRange, noResultPagination } = this.state;
    let params = {
      startDate: dateRange[0],
      endDate: dateRange[1],
      pageNum: noResultPagination.current - 1,
      pageSize: noResultPagination.pageSize
    };
    this.setState({
      loading: true
    });
    webapi
      .getNoResultsData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          noResultPagination.total = res.context.total;
          this.setState({
            noSearchResult: res.context.content,
            noResultPagination: noResultPagination,
            noResultLoading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            noResultLoading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          noResultLoading: false
        });
      });
  };
  render() {
    const { title, allSerchResults, allPagination, allLoading, noSearchResult, noResultPagination, noResultLoading } = this.state;
    const columnsAll = [
      {
        title: 'Search Term',
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width: '15%'
      },
      {
        title: 'Searches With Results',
        dataIndex: 'searchesWithResults',
        key: 'searchesWithResults',
        width: '15%'
      },
      {
        title: 'Percent',
        dataIndex: 'percent',
        key: 'percent',
        width: '15%'
      },
      {
        title: 'Result N0.',
        dataIndex: 'resultNo',
        key: 'resultNo',
        width: '15%'
      },
      {
        title: 'Result Count',
        dataIndex: 'resultCount',
        key: 'resultCount',
        width: '15%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={{ pathName: '/product-search-details/' + record.id, state: { type: 'all' } }} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    const columnsNoResult = [
      {
        title: 'Search Term',
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width: '15%'
      },
      {
        title: 'Searches With No-Result',
        dataIndex: 'searchesWithResults',
        key: 'searchesWithResults',
        width: '15%'
      },
      {
        title: 'Percent',
        dataIndex: 'percent',
        key: 'percent',
        width: '15%'
      },
      {
        title: 'Last Not Found Date',
        dataIndex: 'lastNoFoundDate',
        key: 'lastNoFoundDate',
        width: '15%'
      },
      {
        title: 'Last Found Date',
        dataIndex: 'lastFoundDate',
        key: 'lastFoundDate',
        width: '15%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={{ pathName: '/product-search-details/' + record.id, state: { type: 'noResult' } }} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
          <RangePicker renderExtraFooter={() => 'extra footer'} onChange={this.dateRangeChange} />
        </div>
        <div className="container">
          <Tabs defaultActiveKey="1">
            <TabPane tab="All" key="1">
              <Table rowKey="id" columns={columnsAll} dataSource={allSerchResults} pagination={allPagination} loading={allLoading} scroll={{ x: '100%' }} onChange={this.allTableChange} />
            </TabPane>
            <TabPane tab="No result searches" key="2">
              <Table rowKey="id" columns={columnsNoResult} dataSource={noSearchResult} pagination={noResultPagination} loading={noResultLoading} scroll={{ x: '100%' }} onChange={this.noResultTableChange} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
