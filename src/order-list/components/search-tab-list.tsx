import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop, OrderStatus } from 'qmkit';
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
    let activeOrderStatus = OrderStatus.filter(x=>x.listShow === true)
    const obj = [
      <FormattedMessage id="Order.Created"/>,
      <FormattedMessage id="Order.PendingReview"/>,
      <FormattedMessage id="Order.ToBeDelivered"/>,
      <FormattedMessage id="Order.PartiallyShipped"/>,
      <FormattedMessage id="Order.Shipped"/>,
      <FormattedMessage id="Order.PartiallyDelivered"/>,
      <FormattedMessage id="Order.Delivered"/>,
      <FormattedMessage id="Order.Completed"/>,
      <FormattedMessage id="Order.Cancelled"/>,
      <FormattedMessage id="Order.Rejected"/>,
    ]
    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          <Tabs.TabPane tab={<FormattedMessage id="Order.all" />} key="0">
            <List />
          </Tabs.TabPane>

          {/* <Tabs.TabPane
            tab={<FormattedMessage id="order.pendingReview" />}
            key="flowState-INIT"
          >
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="order.toBeDelivered" />}
            key="flowState-AUDIT"
          >
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="order.toBeReceived" />}
            key="flowState-DELIVERED"
          >
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="order.completed" />}
            key="flowState-COMPLETED"
          >
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<FormattedMessage id="order.outOfDate" />}
            key="flowState-VOID"
          >
            <List />
          </Tabs.TabPane> */}
          { activeOrderStatus.map((item,index)=>(
             <Tabs.TabPane tab={obj.map((i,j)=>(j===index?i:''))}
             key={item.value}>
               <List />
             </Tabs.TabPane>
          )) }
        </Tabs>
      </div>
    );
  }
}
