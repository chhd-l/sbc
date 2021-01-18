import React from 'react';

import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';

@Relax
export default class CouponList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponInfoList: IMap;
      couponActivity: IMap;
    };
  };

  static relaxProps = {
    couponInfoList: ['activityInfo', 'couponInfoList'],
    couponActivity: ['activityInfo', 'couponActivity']
  };

  render() {
    const { couponInfoList, couponActivity } = this.props.relaxProps;
    return (
      <Table dataSource={couponInfoList.toJS()} pagination={false} scroll={{ x: true, y: 500 }} rowKey="couponId">
        <Table.Column title="Coupon name" dataIndex="couponName" key="couponName" width="20%" />
        <Table.Column title="Coupon value" dataIndex="price" key="price" width="10%" />
        <Table.Column title="Valid period" dataIndex="time" key="time" width="40%" />
        <Table.Column title={couponActivity.get('couponActivityType') == 2 ? 'Number of free sheets per group' : 'Total number of sheets'} dataIndex="totalCount" key="totalCount" width="10%" />
      </Table>
    );
  }
}
