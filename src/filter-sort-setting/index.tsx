import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Form, Alert, Tabs } from 'antd';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import DropList from './components/drop-list';
import AddCustomizedFilter from './components/add-customized-filter';

const { TabPane } = Tabs;

class FilterSortSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Filter & Sort setting',
      attributeFilterList: [],
      customizedFilterList: [],
      sortByList: []
    };
  }
  componentDidMount() {}

  render() {
    const { title, attributeFilterList, customizedFilterList, sortByList } = this.state;
    const description = (
      <div>
        <p>The enabled filters will show in the ‘Filter’ section for customer to choose and filter out desired products.</p>
        <p>The enabled sort conditions will show in the ‘Sort by’ section for customer to sort products in desired orders.</p>
      </div>
    );
    const columns = [
      {
        title: 'Filter name',
        dataIndex: 'filterName',
        key: 'filterName'
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (rowInfo) => (
          <div>
            <Switch></Switch>
          </div>
        )
      }
    ];

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
              <DropList></DropList>
            </TabPane>
            <TabPane tab="Customized filter" key="customizedFilter">
              <AddCustomizedFilter></AddCustomizedFilter>
              <DropList></DropList>
            </TabPane>
            <TabPane tab="Sort by" key="sortBy">
              <DropList></DropList>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(FilterSortSetting);