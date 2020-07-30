import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';
import '../style.css';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { WMChart } from 'biz';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      echarts: any;
      PeriodAmountTotal: any;
    };
    settleId: number;
  };

  constructor(props) {
    super(props);
  }

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop,
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    echarts: 'echarts',
    PeriodAmountTotal: 'PeriodAmountTotal'
  };

  UNSAFE_componentWillMount() {
    //const state = this.props.location.state;

    this.setState({ expandedRows: [] });
  }

  render() {
    const getEcharts = this.props.relaxProps.echarts
      ? this.props.relaxProps.echarts
      : [];
    const getPeriodAmount = this.props.relaxProps.PeriodAmountTotal
      ? this.props.relaxProps.PeriodAmountTotal
      : [];
    return (
      <div className="chart space-between">
        <div className="chartDetails1">
          <div className="chartDetailsList flex-content">
            <div className="btn">
              Reward amount <br /> $ {getPeriodAmount.totalRewardAmount}
            </div>
            <div className="btn">
              Order amount <br /> $ {getPeriodAmount.totalOrderAmount}
            </div>
            <div className="btn">
              Order quantity
              <br /> {getPeriodAmount.totalOrderQuantity}
            </div>
          </div>
        </div>
        <div className="chartDetails2">
          <WMChart
            title=""
            startTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
            endTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
            height="260"
            dataDesc={[
              { title: 'order Mount', key: 'orderMount' },
              { title: 'order Quantiry', key: 'orderQuantiry' }
            ]}
            radioClickBack={() => {}}
            content={[
              {
                key: 0,
                skuTotalPv: 0,
                skuTotalUv: 0,
                title: '2020/06/15Mon',
                totalPv: 2,
                totalUv: 1
              }
            ]}
            rangeVisible={false}
          />
        </div>

        <div className="chartDetails2">
          <WMChart
            title=""
            startTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
            endTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
            height="260"
            dataDesc={[{ title: 'Order number', key: 'orderCount' }]}
            radioClickBack={() => {}}
            content={[
              {
                key: 0,
                skuTotalPv: 0,
                skuTotalUv: 0,
                title: '2020/06/15Mon',
                totalPv: 2,
                totalUv: 1
              }
            ]}
            rangeVisible={false}
          />
        </div>
      </div>
    );
  }

  _onExpandedRowsChange = (expandedRows) => {
    this.setState({ expandedRows: expandedRows });
  };

  _handleRowSpan = (row, value) => {
    const { expandedRows } = this.state;
    if (expandedRows.length != 0) {
      if (row.key.startsWith('p_') && expandedRows.indexOf(row.key) != -1) {
        return {
          children: value,
          props: { rowSpan: row.children ? row.children.length + 1 : 1 }
        };
      } else if (row.key.startsWith('c_')) {
        let isChild = false;
        expandedRows.forEach((rowKey) => {
          if (rowKey.split('_')[1] == rowKey.split('_')[1]) {
            isChild = true;
          }
        });
        if (isChild) {
          return {
            props: { rowSpan: 0 }
          };
        }
      }
    }
    return value;
  };
}
