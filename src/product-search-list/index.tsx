import React, { Component } from 'react';
import { BreadCrumb, Const, Headline, cache, util, AuthWrapper, history, QRScaner } from 'qmkit';
import {Spin, Row, Col, Button, message, Tooltip, Table, Tabs, DatePicker, Icon, Dropdown, Menu, Modal, Input, Space} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import './index.less';
import { RCi18n } from 'qmkit';
import SynonymsTable from '@/product-search-list/synonymsTable';

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const { confirm } = Modal;

export default class ProductSearchList extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.search" />,
      allSerchResults: [],
      allPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        visible: false
      },
      allSort: { order: 'descend' },
      allLoading: false,
      noSearchResult: [],
      noResultPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      noResultSort: { order: 'descend' },
      noResultLoading: false,
      dateRange: [],
      tabKey: '1',
      statistics: {},
      loading: true
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
    this.onExport = this.onExport.bind(this);
  }

  componentDidMount() {
    //保持当前选中tab状态
    if(sessionStorage.getItem('productSearchActive')){
      this.onTabChange(sessionStorage.getItem('productSearchActive'))
    }
    this.dateRangeChange([moment(sessionStorage.getItem(cache.CURRENT_YEAR)).add(-7, 'd'), moment(sessionStorage.getItem(cache.CURRENT_YEAR))]);
  }
  componentWillUnmount() {
    sessionStorage.removeItem('productSearchActive');
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
      dateRange: [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')],
      loading: false
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
            statistics: res.context,
            loading: false
          });
        } else {
        }
      })
      .catch((err) => {});
  }

  allTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        allPagination: pagination,
        allSort: sorter,
        loading: false
      },
      () => this.getAllSearchResult()
    );
  };

  onRepair= () => {
    this.setState({
      allLoading: true,
      loading: false
    });
    webapi
      .getRepair()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message);
          this.setState({
            allLoading: false
          });
        } else {
          this.setState({
            allLoading: false
          });
          message.success(res.message);
        }
      })
      .catch((err) => {
        this.setState({
          allLoading: false,
          loading: false
        });
      });
  }

  onRebuild = () => {
    this.setState({
      allLoading: true,
      loading: false
    });
    webapi
      .getRebuild()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message);
          this.setState({
            allLoading: false
          });
        } else {
          this.setState({
            allLoading: false
          });
          message.success(res.message);
        }
      })
      .catch((err) => {
        this.setState({
          allLoading: false,
          loading: false
        });
      });
  }

  showModal = (res) => {
    let _this = this
    confirm({
      title: 'Are you sure to '+ res +' index, which may affect the normal operation of shop',
      onOk() {
        if(res == 'repair') {
          _this.onRepair()
        }else {
          _this.onRebuild()
        }
      },
      onCancel() {},
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  _menu = () => {
    return (
      <Menu>
        {/* <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              onClick={()=>this.showModal('repair')}
            >
             <FormattedMessage id="Product.Repair index" />
            </a>
          </AuthWrapper>
        </Menu.Item> */}
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              onClick={() => this.showModal('rebuild') }
            >
              <FormattedMessage id="Product.Rebuild index" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
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
        //allSort: {},
        loading: false
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
      allLoading: true,
      loading: false
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
            allLoading: false,
            loading: false
          });
        } else {
          this.setState({
            allLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          allLoading: false,
          loading: false
        });
      });
  };

  noResultTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        noResultPagination: pagination,
        noResultSort: sorter,
        loading: false
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
        //noResultSort: {},
        loading: false
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
      noResultLoading: true,
      loading: false
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
            noResultLoading: false,
            loading: false
          });
        } else {
          this.setState({
            noResultLoading: false,
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          noResultLoading: false,
          loading: false
        });
      });
  };
  onExport = () => {
    return new Promise((resolve) => {
      const { dateRange, tabKey } = this.state;
      let params = {
        startDate: dateRange[0],
        endDate: dateRange[1],
        isNoResults: tabKey === '1' ? 0 : 1
      };
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result); // 新窗口下载

          const exportHref = Const.HOST + `/search/details/term/statistics/export/${encrypted}`;
          window.open(exportHref);
        }
        resolve();
      }, 500);
    });
  };
  render() {
    const { title, tabKey, dateRange, statistics, allSerchResults, allPagination, allLoading, noSearchResult, noResultPagination, noResultLoading } = this.state;
    const columnsAll = [
      {
        title: <FormattedMessage id="Product.SearchTerm" />,
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width: '20%'
      },
      {
        title: <FormattedMessage id="Product.SearchesWithResults" />,
        dataIndex: 'searchesCount',
        key: 'searchesCount',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.Percent" />,
        dataIndex: 'percent',
        key: 'percent',
        width: '15%',
        sorter: true,
        defaultSortOrder: 'descend',
        render: (text, record) => text.toFixed(2) + '%'
      },
      {
        title: <FormattedMessage id="Product.TotalFound" />,
        dataIndex: 'resultNo',
        key: 'resultNo',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.AvgSearch" />,
        dataIndex: 'resultCount',
        key: 'resultCount',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={RCi18n({id:'Product.Details'})}>
              <Link to={{ pathname: '/product-search-details', state: { type: 'all', searchTerm: record.searchTerm, startDate: dateRange[0], endDate: dateRange[1] } }} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    const columnsNoResult = [
      {
        title: <FormattedMessage id="Product.SearchTerm" />,
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width: '20%'
      },
      {
        title: <FormattedMessage id="Product.SearchesWithNoResult" />,
        dataIndex: 'searchesCount',
        key: 'searchesCount',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.Percent" />,
        dataIndex: 'percent',
        key: 'percent',
        width: '15%',
        sorter: true,
        defaultSortOrder: 'descend',
        render: (text, record) => text.toFixed(2) + '%'
      },
      {
        title: <FormattedMessage id="Product.LastNotFoundDate" />,
        dataIndex: 'lastNotFoundDate',
        key: 'lastNotFoundDate',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.LastFoundDate" />,
        dataIndex: 'lastFoundDate',
        key: 'lastFoundDate',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Details" />}>
              <Link to={{ pathname: '/product-search-details', state: { type: 'noResult', searchTerm: record.searchTerm, startDate: dateRange[0], endDate: dateRange[1] } }} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <div id="productSearch">
        <BreadCrumb />
        <Spin spinning={allLoading}>
          <div className="container-search">
            <Row>
              <Col span={8}>
                <Headline title={title} />
              </Col>
              <Col span={8}></Col>
              <Col span={8}>
                <RangePicker defaultValue={[moment(sessionStorage.getItem(cache.CURRENT_YEAR)).add(-7, 'd'), moment(sessionStorage.getItem(cache.CURRENT_YEAR))]} onChange={this.dateRangeChange} placeholder={['Start time', 'End time']} />
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
                      <strong>
                        <FormattedMessage id="Product.SearchesWithResults" />
                      </strong>
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
                      <strong>
                        <FormattedMessage id="Product.TotalFound" />
                      </strong>
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
                      <strong>
                        <FormattedMessage id="Product.AvgSearch" />
                      </strong>
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
                      <strong>
                        <FormattedMessage id="Product.SearchesWithNoResult" />
                      </strong>
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
                      <strong>
                        <FormattedMessage id="Product.NoResultRate" />
                      </strong>
                    </div>
                    <div className="resultValue">
                      <strong>{statistics.noResultRate}%</strong>
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
                      <strong>
                        <FormattedMessage id="Product.NoResultTermCount" />
                      </strong>
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
            <div className="exportContainer">
              <div className="flex-end">
                {
                  tabKey !== '3' ? (
                    <Button
                      style={{marginRight:'20px'}}
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        this.onExport();
                      }}
                    >
                      <FormattedMessage id="Product.Export" />
                    </Button>
                  ) : ''
                }

                <Dropdown overlay={this._menu()} getPopupContainer={() => document.getElementById('page-content')}>
                  <Button>
                  <FormattedMessage id="Product.Index operation" />
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>

            </div>
            <Tabs
              activeKey={tabKey}
              onChange={(key) => {
                this.onTabChange(key);
              }}
            >
              <TabPane tab={<FormattedMessage id="Product.All" />} key="1">
                <Table rowKey="id" columns={columnsAll} dataSource={allSerchResults} pagination={allPagination} scroll={{ x: '100%' }} onChange={this.allTableChange} />
              </TabPane>
              <TabPane tab={<FormattedMessage id="Product.NoResultsSearches" />} key="2">
                <Table rowKey="id" columns={columnsNoResult} dataSource={noSearchResult} pagination={noResultPagination} loading={noResultLoading} scroll={{ x: '100%' }} onChange={this.noResultTableChange} />
              </TabPane>
              <TabPane tab={<FormattedMessage id="Product.Synonyms" />} key="3">
                <SynonymsTable />
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </div>
    );
  }
}
