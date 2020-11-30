import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Form, Alert, Tabs, message } from 'antd';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import DropList from './components/drop-list';
import AddCustomizedFilter from './components/add-customized-filter';
import SelectAttribute from './components/select-attribute';

const { TabPane } = Tabs;

class FilterSortSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Filter & Sort setting',
      attributeFilterList: [],
      customizedFilterList: [],
      sortByList: [],
      selectedRowKeys: []
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
    webapi
      .findFilterList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let attributeFilterList = res.context;
          let selectedRowKeys = [];
          for (let i = 0; i < attributeFilterList.length; i++) {
            attributeFilterList[i].index = i;
            selectedRowKeys.push(attributeFilterList[i].attributeId);
          }
          this.setState({
            attributeFilterList: attributeFilterList,
            selectedRowKeys: selectedRowKeys
          });
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  findCustomizeFilterList = () => {
    let params = {
      filterType: '1'
    };
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
            customizedFilterList: customizedFilterList
          });
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  findSortList = () => {
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
            sortByList: sortByList
          });
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  //开关filter
  switchFilter = (params) => {
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
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  //开关sort
  switchSort = (params) => {
    webapi
      .updateSort(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.findSortList();
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  //filter删除
  deleteFilter = (id, filterType) => {
    let params = {
      id: id
    };
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
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  //filter排序
  updateFilterSort = (params, filterType) => {
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
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  //filter排序
  updateSortList = (params) => {
    webapi
      .updateSortList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.findSortList();
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  render() {
    const { title, attributeFilterList, customizedFilterList, sortByList, selectedRowKeys } = this.state;
    const description = (
      <div>
        <p>1. Filter attributes can be chosen from attributes, which are associated with product category</p>
        <p>2. The enabled filters will show in the ‘Filter’ section for customer to choose and filter out desired products.</p>
        <p>3. The enabled sort conditions will show in the ‘Sort by’ section for customer to sort products in desired orders.</p>
      </div>
    );

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Alert message={description} type="error" />
        </div>
        <div className="container-search">
          <Tabs defaultActiveKey="attributeFilter">
            <TabPane tab="Attribute filter" key="attributeFilter">
              <SelectAttribute refreshList={this.findAttributeFilterList} selectedRowKeys={selectedRowKeys}></SelectAttribute>
              <DropList sortFunction={this.updateFilterSort} deleteFunction={this.deleteFilter} switchFunction={this.switchFilter} type="filter" dataSource={attributeFilterList}></DropList>
            </TabPane>
            <TabPane tab="Customized filter" key="customizedFilter">
              {/* <AddCustomizedFilter type="add" refreshList={this.findCustomizeFilterList}></AddCustomizedFilter> */}
              <DropList sortFunction={this.updateFilterSort} deleteFunction={this.deleteFilter} switchFunction={this.switchFilter} refreshListFunction={this.findCustomizeFilterList} type="filter" dataSource={customizedFilterList}></DropList>
            </TabPane>
            <TabPane tab="Sort by" key="sortBy">
              <DropList sortFunction={this.updateSortList} switchFunction={this.switchSort} type="sort" dataSource={sortByList}></DropList>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Form.create()(FilterSortSetting);
