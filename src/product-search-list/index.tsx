import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Tabs, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as webapi from './webapi';
import './index.less';

const TabPane = Tabs.TabPane;
const { WeekPicker } = DatePicker;

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
      allSort: {},
      allLoading: false,
      noSearchResult: [],
      noResultPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      noResultSort: {},
      noResultLoading: false,
      dateRange: [],
      tabKey: '1',
      statistics: {}
    };
    this.dateRangeChange = this.dateRangeChange.bind(this);
    this.allTableChange = this.allTableChange.bind(this);
    this.getAllSearchResult = this.getAllSearchResult.bind(this);
    this.noResultTableChange = this.noResultTableChange.bind(this);
    this.getNoSearchResults = this.getNoSearchResults.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onAllSerch = this.onAllSerch.bind(this);
    this.onNoResultSerch = this.onNoResultSerch.bind(this);
    this.getStatisticsResult = this.getStatisticsResult.bind(this);
    this.getSortOrder = this.getSortOrder.bind(this);
  }

  componentDidMount() {
    this.dateRangeChange(moment(sessionStorage.getItem(cache.CURRENT_YEAR)));
  }

  onTabChange(key) {
    this.setState({
      tabKey: key
    });
    if (key === '1') {
      this.onAllSerch();
    } else if (key === '2') {
      this.onNoResultSerch();
    }
  }
  dateRangeChange(date) {
    this.setState({
      dateRange: [moment().week(moment(date).week()).startOf('week').format('YYYY-MM-DD'), moment().week(moment(date).week()).endOf('week').format('YYYY-MM-DD')]
    });
    this.setState({}, () => this.getStatisticsResult());
    if (this.state.tabKey === '1') {
      this.onAllSerch();
    } else if (this.state.tabKey === '2') {
      this.onNoResultSerch();
    }
  }

  getSortOrder(sortOrder) {
    if (sortOrder === 'ascend') {
      return 'ASC';
    } else if (sortOrder === 'descend') {
      return 'DESC';
    }
    return null;
  }

  getStatisticsResult() {
    const { dateRange } = this.state;
    webapi
      .getStatisticsData(dateRange[0], dateRange[1])
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            statistics: res.context
          });
        } else {
          message.error(res.message || 'Get Data Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
      });
  }

  allTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        allPagination: pagination,
        allSort: sorter
      },
      () => this.getAllSearchResult()
    );
  };
  onAllSerch() {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        allSort: {}
      },
      () => this.getAllSearchResult()
    );
  }
  getAllSearchResult = () => {
    const { dateRange, allPagination, allSort } = this.state;
    let sortOrder = this.getSortOrder(allSort.order);
    let params = {
      startDate: dateRange[0],
      endDate: dateRange[1],
      isNoResults: 0,
      pageNum: allPagination.current - 1,
      pageSize: allPagination.pageSize,
      sortName: allSort.field,
      sortOrder: sortOrder
    };
    this.setState({
      allLoading: true
    });
    webapi
      .getAllSearchData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          allPagination.total = res.context.totalElements;
          this.setState({
            allSerchResults: res.context.searchTermStatisticsViews,
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

  noResultTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        noResultPagination: pagination,
        noResultSort: sorter
      },
      () => this.getNoSearchResults()
    );
  };
  onNoResultSerch() {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        noResultSort: {}
      },
      () => this.getNoSearchResults()
    );
  }
  getNoSearchResults = () => {
    const { dateRange, noResultPagination, noResultSort } = this.state;
    let sortOrder = this.getSortOrder(noResultSort.order);
    let params = {
      startDate: dateRange[0],
      endDate: dateRange[1],
      isNoResults: 1,
      pageNum: noResultPagination.current - 1,
      pageSize: noResultPagination.pageSize,
      sortName: noResultSort.field,
      sortOrder: sortOrder
    };
    this.setState({
      noResultLoading: true
    });
    webapi
      .getNoResultsData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          noResultPagination.total = res.context.totalElements;
          this.setState({
            noSearchResult: res.context.searchTermStatisticsViews,
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
    const { title, tabKey, dateRange, statistics, allSerchResults, allPagination, allLoading, noSearchResult, noResultPagination, noResultLoading } = this.state;
    const columnsAll = [
      {
        title: 'Search Term',
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width: '20%'
      },
      {
        title: 'Searches With Results',
        dataIndex: 'searchesCount',
        key: 'searchesCount',
        width: '15%'
      },
      {
        title: 'Percent',
        dataIndex: 'percent',
        key: 'percent',
        width: '15%',
        sorter: true
      },
      {
        title: 'Result No.',
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
              <Link to={{ pathname: '/product-search-details', state: { type: 'all', searchTerm: record.searchTerm, startDate: dateRange[0], endDate: dateRange[1] } }} className="iconfont iconDetails"></Link>
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
        width: '20%'
      },
      {
        title: 'Searches With No-Result',
        dataIndex: 'searchesCount',
        key: 'searchesCount',
        width: '15%'
      },
      {
        title: 'Percent',
        dataIndex: 'percent',
        key: 'percent',
        width: '15%',
        sorter: true
      },
      {
        title: 'Last Not Found Date',
        dataIndex: 'lastNotFoundDate',
        key: 'lastNotFoundDate',
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
              <Link to={{ pathname: '/product-search-details', state: { type: 'noResult', searchTerm: record.searchTerm, startDate: dateRange[0], endDate: dateRange[1] } }} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <div id="productSearch">
        <BreadCrumb />
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <WeekPicker defaultValue={moment(sessionStorage.getItem(cache.CURRENT_YEAR))} onChange={this.dateRangeChange} placeholder="Select week" />
            </Col>
          </Row>
          <Row className="searchHeader">
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>Searches With Results</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.searchesWithResults}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>Result No.</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.resultNo}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>Result count</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.resultCount}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="searchHeader">
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>Searches With No-Result</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.searchesWithNoResults}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>No-result Rate</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.noResultRate}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={1}>
                  <div className="redTag"></div>
                </Col>
                <Col span={23}>
                  <div className="resultTitle">
                    <strong>No-Result Term Count</strong>
                  </div>
                  <div className="resultValue">
                    <strong>{statistics.noResultTermCount}</strong>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="container">
          <Tabs
            defaultActiveKey={tabKey}
            onChange={(key) => {
              this.onTabChange(key);
            }}
          >
            <TabPane tab="All" key="1">
              <Table rowKey="id" columns={columnsAll} dataSource={allSerchResults} pagination={allPagination} loading={allLoading} scroll={{ x: '100%' }} onChange={this.allTableChange} />
            </TabPane>
            <TabPane tab="No results searches" key="2">
              <Table rowKey="id" columns={columnsNoResult} dataSource={noSearchResult} pagination={noResultPagination} loading={noResultLoading} scroll={{ x: '100%' }} onChange={this.noResultTableChange} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
