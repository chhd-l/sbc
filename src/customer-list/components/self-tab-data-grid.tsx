import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';
import SelfCustomerList from './self-list';
import { FormattedMessage } from 'react-intl';

@Relax
export default class SelfTabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSelfTabChange: Function;
      selfForm: IMap;
    };
  };

  static relaxProps = {
    onSelfTabChange: noop,
    selfForm: 'selfForm'
  };

  render() {
    const { onSelfTabChange, selfForm } = this.props.relaxProps;
    const key = selfForm.get('checkState');

    return (
      <Tabs onChange={(key) => onSelfTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab={<FormattedMessage id="all" />} key="-1">
          <SelfCustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="audited" />} key="1">
          <SelfCustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="pendingReview" />} key="0">
          <SelfCustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="reviewFailed" />} key="2">
          <SelfCustomerList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
