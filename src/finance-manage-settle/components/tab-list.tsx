import React from 'react';

import { IMap, Relax } from 'plume2';
import styled from 'styled-components';
import { Tabs } from 'antd';

import { noop } from 'qmkit';
import List from './list';
import { FormattedMessage } from 'react-intl';

@Relax
export default class TabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    queryParams: 'queryParams'
  };

  render() {
    const { onTabChange, queryParams } = this.props.relaxProps;

    return (
      <Tabs
        onChange={(key) => {
          onTabChange(key);
        }}
        activeKey={queryParams.get('settleStatus').toString()}
      >
        <Tabs.TabPane tab={<FormattedMessage id="unSettlement" />} key="0">
          <List />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="settlement" />} key="1">
          <List />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
