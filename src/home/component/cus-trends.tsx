import React from 'react';
import { WMChart } from 'biz';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';

@Relax
export default class CustomerGrowTrendsCharts extends React.Component<
  any,
  any
> {
  props: {
    relaxProps?: {
      customerGrowTrendData: IList;
    };
  };

  static relaxProps = {
    customerGrowTrendData: 'customerGrowTrendData'
  };

  render() {
    const { customerGrowTrendData } = this.props.relaxProps;

    return (
      <WMChart
        title=""
        startTime={new Date()}
        endTime={new Date()}
        dataDesc={[
          { title: 'Customer total number', key: 'cusAllCount' },
          { title: 'New customer number', key: 'cusDayGrowthCount' },
          { title: 'Registered customers number', key: 'cusDayRegisterCount' }
        ]}
        radioClickBack={() => {}}
        content={customerGrowTrendData.toJS()}
        rangeVisible={false}
      />
    );
  }
}
