import React from 'react';
import { Tabs } from 'antd';
import { RCi18n, Headline } from 'qmkit';
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
        <Tabs.TabPane key="1" tab={RCi18n({id: 'Product.InventoryAlert'})}>
          <Headline title={RCi18n({id: 'Product.InventoryAlert'})} />
          <SearchForm />
          <GoodsList />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab={RCi18n({id: 'Product.InventoryForecast'})}>
          <Headline title={RCi18n({id: 'Product.InventoryForecast'})} />
          <ForcastList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
