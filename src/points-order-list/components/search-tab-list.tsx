import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    tab: 'tab'
  };

  render() {
    const { onTabChange, tab } = this.props.relaxProps;
    const key = tab.get('key');

    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          <Tabs.TabPane tab="All" key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Ready for shipping" key="flowState-AUDIT">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Ready for receiving" key="flowState-DELIVERED">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Accomplished" key="flowState-COMPLETED">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
