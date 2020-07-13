import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';
import { List } from 'immutable';
import '../style.css';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { WMChart } from 'biz';
import AppStore from '../store';
const chartData = [
  /*{
      key: 0,
      skuTotalPv: 0,
      skuTotalUv: 0,
      title: '2020/06/15Mon',
      totalPv: 2,
      totalUv: 1
    }*/
];
@Relax
export default class ListChart extends React.Component<any, any> {
  store: AppStore;

  props: {
    relaxProps?: {
      getEcharts: Function;
      PeriodAmountTotal: any;
      echartsData: IList;
    };
    settleId: number;
  };

  constructor(props) {
    super(props);
    this.state = {
      chartData: []
    };
  }

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop,
    getEcharts: noop,
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    echartsData: 'echartsData',
    PeriodAmountTotal: 'PeriodAmountTotal'
  };
  componentDidMount() {
    this.setState({ chartData: chartData });
  }

  UNSAFE_componentWillMount() {
    //const state = this.props.location.state;

    //console.log(state,11111111111111111111111);
    this.setState({ expandedRows: [] });
  }

  render() {
    const echartsData = this.props.relaxProps.echartsData
      ? this.props.relaxProps.echartsData
      : [];
    const getPeriodAmount = this.props.relaxProps.PeriodAmountTotal
      ? this.props.relaxProps.PeriodAmountTotal
      : [];

    let echartsVal = [];

    setTimeout(() => {
      echartsData.forEach((v, i) => {
        chartData.push({
          key: i,
          skuTotalPv: v.orderMount,
          skuTotalUv: v.orderQuantiry,
          title: v.date,
          totalPv: 2,
          totalUv: 1
        });
      });
      /*this.setState({
        chartData:echartsVal,
      });*/
    });
    console.log(this.state.chartData);

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
            startTime={new Date()}
            endTime={new Date()}
            height="260"
            dataDesc={this.state.chartData}
            radioClickBack={() => {}}
            content={this.state.chartData}
            rangeVisible={false}
          />
        </div>

        <div className="chartDetails2">
          <WMChart
            title=""
            startTime={new Date()}
            endTime={new Date()}
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
