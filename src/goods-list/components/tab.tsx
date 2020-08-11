import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import GoodsList from '../components/goods-list';
import Tool from './tool';
import { FormattedMessage } from 'react-intl';

const TabPane = Tabs.TabPane;

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      addedFlag: string;
      onStateTabChange: Function;
    };
  };

  static relaxProps = {
    addedFlag: 'addedFlag',
    onStateTabChange: noop
  };

  render() {
    const { addedFlag, onStateTabChange } = this.props.relaxProps;
    return (
      <Tabs
        defaultActiveKey={addedFlag}
        tabBarExtraContent={<Tool></Tool>}
        onChange={(key) => onStateTabChange(key)}
      >
        <TabPane tab={<FormattedMessage id="all" />} key="-1">
          <GoodsList />
        </TabPane>
        <TabPane tab={<FormattedMessage id="product.onShelves" />} key="1">
          <GoodsList />
        </TabPane>
        {/* <TabPane
          tab={<FormattedMessage id="product.partialOnShelves" />}
          key="2"
        >
          <GoodsList />
        </TabPane> */}
        <TabPane tab={<FormattedMessage id="product.offShelves" />} key="0">
          <GoodsList />
        </TabPane>
      </Tabs>
    );
  }
}
