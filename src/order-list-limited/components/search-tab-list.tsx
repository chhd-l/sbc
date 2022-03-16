import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const limitedTabList = [
  { langKey: 'Order.All', key: '0', listShow: true },
  { langKey: 'Order.Pendingreview', key: 'flowState-INIT', listShow: true },
  { langKey: 'Order.toBeFormed', key: 'flowState-GROUPON', listShow: false },
  { langKey: 'Order.Tobedelivered', key: 'flowState-AUDIT', listShow: true },
  { langKey: 'Order.Tobereceived', key: 'flowState-DELIVERED', listShow: true },
  { langKey: 'Order.received', key: 'flowState-CONFIRMED', listShow: false },
  { langKey: 'Order.Completed', key: 'flowState-COMPLETED', listShow: true },
  { langKey: 'Order.Outofdate', key: 'flowState-VOID', listShow: true }
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

    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          {limitedTabList
            .filter((item) => item.listShow)
            .map((el) => (
              <Tabs.TabPane tab={<FormattedMessage id={el.langKey} />} key={el.key}>
                <List />
              </Tabs.TabPane>
            ))}
        </Tabs>
      </div>
    );
  }
}
