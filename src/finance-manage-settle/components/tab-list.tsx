import React from 'react';

import { IMap, Relax } from 'plume2';
import styled from 'styled-components';
import { Tabs } from 'antd';

import { noop } from 'qmkit';
import List from './list';
import { FormattedMessage } from 'react-intl';

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    padding: 16px 5px;
  }
`;

@Relax
export default class TabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    queryParams: 'queryParams'
  };

  render() {
    const { onTabChange, queryParams } = this.props.relaxProps;

    return (
      <TableBox>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={queryParams.get('settleStatus').toString()}
        >
          <Tabs.TabPane tab={<FormattedMessage id="Finance.unSettlement" />} key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<FormattedMessage id="Finance.settlement" />} key="1">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </TableBox>
    );
  }
}
