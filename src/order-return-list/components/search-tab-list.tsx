import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './search-list';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class SearchTabList extends React.Component<any, any> {
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
          <Tabs.TabPane tab={<FormattedMessage id="all" />} key="0">
            {tab.get('key') === '0' ? <List /> : null}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="pendingReview" />}
            key="flowState-INIT"
          >
            {tab.get('key') === 'flowState-INIT' ? <List /> : null}
          </Tabs.TabPane>
          {/*{<FormattedMessage id="pendingReview" />}*/}
          <Tabs.TabPane
            tab={<FormattedMessage id="toBeDelivered" />}
            key="flowState-AUDIT"
          >
            {tab.get('key') === 'flowState-AUDIT' ? <List /> : null}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <FormattedMessage id="toBeReceived" />
            }
            key="flowState-DELIVERED"
          >
            {tab.get('key') === 'flowState-DELIVERED' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="pendingRefund" />}
            key="flowState-RECEIVED"
          >
            {tab.get('key') === 'flowState-RECEIVED' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="order.completed" />}
            key="flowState-COMPLETED"
          >
            {tab.get('key') === 'flowState-COMPLETED' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="rejected" />}
            key="flowState-REJECT_RECEIVE"
          >
            {tab.get('key') === 'flowState-REJECT_RECEIVE' ? <List /> : null}
          </Tabs.TabPane>

          {/* <Tabs.TabPane
            tab={<FormattedMessage id="refusedToRefund" />}
            key="flowState-REJECT_REFUND"
          >
            {tab.get('key') === 'flowState-REJECT_REFUND' ? <List /> : null}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="order.outOfDate" />}
            key="flowState-VOID"
          >
            {tab.get('key') === 'flowState-VOID' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="refundFailed" />}
            key="flowState-REFUND_FAILED"
          >
            {tab.get('key') === 'flowState-REFUND_FAILED' ? <List /> : null}
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    );
  }
}
