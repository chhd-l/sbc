import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import CustomerList from './list';
import { noop } from 'qmkit';

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
    const key = form.get('enterpriseCheckState');
    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="All" key="-1">
          <CustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Audited" key="2">
          <CustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Pending" key="1">
          <CustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Audit failed" key="3">
          <CustomerList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
