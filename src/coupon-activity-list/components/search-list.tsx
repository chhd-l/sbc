import React from 'react';

import { Tabs } from 'antd';
import { Const, noop } from 'qmkit';
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
          <Tabs.TabPane tab={Const.activityStatus[0]} key="0">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Const.activityStatus[1]} key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Const.activityStatus[2]} key="2">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Const.activityStatus[3]} key="3">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Const.activityStatus[4]} key="4">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Const.activityStatus[5]} key="5">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
