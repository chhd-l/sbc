import React from 'react';

import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';

import List from './components/list';

export default class MarketingCenter extends React.Component<any, any> {
  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>营销设置</Breadcrumb.Item>
          <Breadcrumb.Item>营销中心</Breadcrumb.Item>
        </Breadcrumb> */}
        {/*各种营销*/}
        <List />
      </div>
    );
  }
}
