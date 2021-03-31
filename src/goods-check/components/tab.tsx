import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import GoodsList from '../components/goods-list';
import { FormattedMessage } from 'react-intl';
import Tool from './tool';

const TabPane = Tabs.TabPane;

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tabIndex: string;
      onStateTabChange: Function;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    tabIndex: 'tabIndex',
    onStateTabChange: noop
  };

  render() {
    const { tabIndex, onStateTabChange } = this.props.relaxProps;
    return (
      <Tabs activeKey={tabIndex} onChange={(key) => onStateTabChange(key)} tabBarExtraContent={<Tool></Tool>}>
        <TabPane tab={<FormattedMessage id="Product.all" />} key="1">
          <GoodsList />
        </TabPane>
        <TabPane tab={<FormattedMessage id="Product.pendingReview" />} key="2">
          <GoodsList />
        </TabPane>
        <TabPane tab={<FormattedMessage id="Product.reviewFailed" />} key="3">
          <GoodsList />
        </TabPane>
        <TabPane tab={<FormattedMessage id="Product.banned" />} key="4">
          <GoodsList />
        </TabPane>
      </Tabs>
    );
  }
}
