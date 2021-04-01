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
          <Tabs.TabPane tab={<FormattedMessage id="Order.all" />} key="0">
            {tab.get('key') === '0' ? <List /> : null}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="Order.pendingReview" />}
            key="PENDING_REVIEW"
          >
            {tab.get('key') === 'PENDING_REVIEW' ? <List /> : null}
          </Tabs.TabPane>
          {/*{<FormattedMessage id="pendingReview" />}*/}
          <Tabs.TabPane
            tab={<FormattedMessage id="Order.toBeDelivered" />}
            key="TO_BE_DELIVERED"
          >
            {tab.get('key') === 'TO_BE_DELIVERED' ? <List /> : null}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <FormattedMessage id="Order.toBeReceived" />
            }
            key="TO_BE_RECEIVED"
          >
            {tab.get('key') === 'TO_BE_RECEIVED' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="Order.pendingRefund" />}
            key="PENDING_REFUND"
          >
            {tab.get('key') === 'PENDING_REFUND' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="Order.completed" />}
            key="COMPLETED"
          >
            {tab.get('key') === 'COMPLETED' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="Order.rejected" />}
            key="REJECTED"
          >
            {tab.get('key') === 'REJECTED' ? <List /> : null}
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
