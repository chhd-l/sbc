import React from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Tabs } from 'antd';
import BasicInformation from './basic';

export default class MyvetrecoStoreSetting extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title="Store information" />
        </div>
        <div className="container">
          <Tabs activeKey="1">
            <Tabs.TabPane tab="Basic information" key="1"></Tabs.TabPane>
            <Tabs.TabPane tab="Representative" key="2"></Tabs.TabPane>
            <Tabs.TabPane tab="Bank information" key="3"></Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
