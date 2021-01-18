import React from 'react';

import { Tabs } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import List from './list';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      queryTab: string;

      onTabChange: Function;
    };
  };

  static relaxProps = {
    queryTab: 'queryTab',

    onTabChange: noop
  };

  render() {
    const { onTabChange, queryTab } = this.props.relaxProps;
    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={queryTab}
        >
          <Tabs.TabPane tab="All" key="0">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="In process" key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Pause" key="2">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Not start" key="3">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Completed" key="4">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
