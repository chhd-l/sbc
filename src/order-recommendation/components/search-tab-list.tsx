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
            console.log(key, 1111111111);
          }}
          activeKey={key}
        >
          <Tabs.TabPane tab={<FormattedMessage id="all" />} key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Invalid" key="1">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Valid" key="2">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
