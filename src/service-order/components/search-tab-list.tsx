import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

 const OrderStatus = [
  { langKey: 'Order.all', name: 'All', value: '0', listShow: true },
  { langKey: 'Order.created', name: 'Created', value: 'INIT', listShow: true },
  { langKey: 'Order.pendingReview', name: 'Pending review', value: 'PENDING_REVIEW', listShow: true },
   { langKey: 'Order.Confirmed', name: 'Confirmed', value: 'TO_BE_DELIVERED', listShow: true },
  { langKey: 'Order.Completed', name: 'Completed', value: 'COMPLETED', listShow: true },
  { langKey: 'Order.cancelled', name: 'Cancelled', value: 'VOID', listShow: true },
];

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
    let activeOrderStatus = OrderStatus.filter((x) => x.listShow === true);

    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          {activeOrderStatus.map((item) => (
            <Tabs.TabPane tab={<FormattedMessage id={item.langKey} />} key={item.value}>
              <List />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
