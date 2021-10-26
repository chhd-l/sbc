import React from 'react';
import { Tabs } from 'antd';
import SearchForm from './search-form';
import GoodsList from './goods-list';
import ForcastList from './forcast-list';

export default class Tab extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: '1'
    };
  }

  onTabChange = (step: string) => {
    this.setState({
      current: step
    });
  }

  render() {
    const { current } = this.state;
    return (
      <Tabs activeKey={current} onChange={this.onTabChange}>
        <Tabs.TabPane key="1" tab="Inventory alert">
          <SearchForm />
          <GoodsList />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Inventory forecast">
          <ForcastList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
