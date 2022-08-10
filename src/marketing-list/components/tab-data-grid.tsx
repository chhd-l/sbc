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
          <MarketingList tabkey={'0'} />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.InProcess" />} key="1">
          <MarketingList tabkey={'1'} />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.Pause" />} key="2">
          <MarketingList tabkey={'2'} />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.NotStart" />} key="3">
          <MarketingList tabkey={'3'} />
        </Tabs.TabPane>

        <Tabs.TabPane tab={<FormattedMessage id="Marketing.Completed" />} key="4">
          <MarketingList tabkey={'4'} />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
