import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Spin, Form, Alert, Tabs, message } from 'antd';
import * as webapi from './webapi';
//import { FormattedMessage } from 'react-intl';
import DropList from './components/drop-list';
//import AddCustomizedFilter from './components/add-customized-filter';
import SelectAttribute from './components/select-attribute';
import { FormattedMessage } from 'react-intl';

const { TabPane } = Tabs;

class FilterSortSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.FilterSortSetting" />,
      attributeFilterList: [],
      customizedFilterList: [],
      sortByList: [],
      selectedRowKeys: [],
      selectedRowList: [],
      loading: true
    };
  }
  componentDidMount() {
    this.findAttributeFilterList();
    this.findCustomizeFilterList();
    this.findSortList();
  }

  findAttributeFilterList = () => {
    let params = {
      filterType: '0'
    };
    this.setState({
      loading: true
    });
    webapi
      .findFilterList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let attributeFilterList = res.context;
          let selectedRowKeys = [];
          let selectedRowList = [];
          for (let i = 0; i < attributeFilterList.length; i++) {
            attributeFilterList[i].index = i;
            selectedRowKeys.push(attributeFilterList[i].attributeId);
            selectedRowList.push({
              id: attributeFilterList[i].attributeId,
              attributeName: attributeFilterList[i].attributeName,
              filterType: '0',
              filterStatus: '1'
            });
          }
          this.setState({
            attributeFilterList: attributeFilterList,
            selectedRowKeys: selectedRowKeys,
            selectedRowList: selectedRowList,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  findCustomizeFilterList = () => {
    let params = {
      filterType: '1'
    };
    this.setState({
      loading: true
    });
    webapi
      .findFilterList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let customizedFilterList = res.context;
          for (let i = 0; i < customizedFilterList.length; i++) {
            customizedFilterList[i].index = i;
          }
          this.setState({
            customizedFilterList: customizedFilterList,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  findSortList = () => {
    this.setState({
      loading: true
    });
    webapi
      .findSortList()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let sortByList = res.context;
          for (let i = 0; i < sortByList.length; i++) {
            sortByList[i].index = i;
          }
          this.setState({
            sortByList: sortByList,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  //开关filter
  switchFilter = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateFilter(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (params.filterType === '0') {
            this.findAttributeFilterList();
          }
          if (params.filterType === '1') {
            this.findCustomizeFilterList();
          }
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  //开关sort
  switchSort = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateSort(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.findSortList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  //filter删除
  deleteFilter = (id, filterType) => {
    let params = {
      id: id
    };
    this.setState({
      loading: true
    });
    webapi
      .deleteFilter(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (filterType === '0') {
            this.findAttributeFilterList();
          }
          if (filterType === '1') {
            this.findCustomizeFilterList();
          }
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  //filter排序
  updateFilterSort = (params, filterType) => {
    this.setState({
      loading: true
    });
    webapi
      .updateFilterSort(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (filterType === '0') {
            this.findAttributeFilterList();
          } else {
            this.findCustomizeFilterList();
          }
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  //filter排序
  updateSortList = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateSortList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.findSortList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { title, attributeFilterList, customizedFilterList, sortByList, selectedRowKeys, selectedRowList } = this.state;
    const description = (
      <div>
        <p>
          1. <FormattedMessage id="Product.FilterAttributes" />
        </p>
        <p>
          2. <FormattedMessage id="Product.TheEnabledFilters" />
        </p>
        <p>
          3. <FormattedMessage id="Product.TheEnabledSort" />
        </p>
      </div>
    );

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />
            <Alert message={description} type="error" />
          </div>
          <div className="container-search">
            <Tabs defaultActiveKey="attributeFilter">
              <TabPane tab={<FormattedMessage id="Product.AttributeFilter" />} key="attributeFilter">
                <SelectAttribute refreshList={this.findAttributeFilterList} selectedRowKeys={selectedRowKeys} selectedRowList={selectedRowList}></SelectAttribute>
                <DropList sortFunction={this.updateFilterSort} deleteFunction={this.deleteFilter} switchFunction={this.switchFilter} type="filter" dataSource={attributeFilterList}></DropList>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Product.CustomizedFilter" />} key="customizedFilter">
                {/* <AddCustomizedFilter type="add" refreshList={this.findCustomizeFilterList}></AddCustomizedFilter> */}
                <DropList sortFunction={this.updateFilterSort} deleteFunction={this.deleteFilter} switchFunction={this.switchFilter} refreshListFunction={this.findCustomizeFilterList} type="filter" dataSource={customizedFilterList}></DropList>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Product.SortBy" />} key="sortBy">
                <DropList sortFunction={this.updateSortList} switchFunction={this.switchSort} type="sort" dataSource={sortByList}></DropList>
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(FilterSortSetting);
