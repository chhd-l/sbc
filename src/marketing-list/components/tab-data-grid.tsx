import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import MarketingList from './list';
import { noop } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    form: 'form'
  };

  render() {
    const { onTabChange, form } = this.props.relaxProps;
    const key = form.get('queryTab');

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab={<FormattedMessage id="Marketing.All" />} key="0">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.InProcess" />} key="1">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.Pause" />} key="2">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.NotStart" />} key="3">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.Completed" />} key="4">
          <MarketingList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
