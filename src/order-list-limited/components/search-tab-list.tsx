import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
          <Tabs.TabPane tab={<FormattedMessage id="Order.All" />} key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<FormattedMessage id="Order.Pendingreview" />} key="flowState-INIT">
            <List />
          </Tabs.TabPane>
          {/* <Tabs.TabPane
            tab={<FormattedMessage id="Order.toBeFormed" />}
            key="flowState-GROUPON"
          >
            <List />
          </Tabs.TabPane> */}

          <Tabs.TabPane tab={<FormattedMessage id="Order.Tobedelivered" />} key="flowState-AUDIT">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<FormattedMessage id="Order.Tobereceived" />} key="flowState-DELIVERED">
            <List />
          </Tabs.TabPane>

          {/* <Tabs.TabPane
            tab={<FormattedMessage id="Order.received" />}
            key="flowState-CONFIRMED"
          >
            <List />
          </Tabs.TabPane> */}

          <Tabs.TabPane tab={<FormattedMessage id="Order.Completed" />} key="flowState-COMPLETED">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<FormattedMessage id="Order.Outofdate" />} key="flowState-VOID">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
