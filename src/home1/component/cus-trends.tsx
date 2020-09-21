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
        startTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
        endTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
        dataDesc={[
          { title: 'Total active consumer number', key: 'cusAllCount' },
          { title: 'New  active consumer number', key: 'cusDayGrowthCount' },
          {
            title: 'Registered active consumers number',
            key: 'cusDayRegisterCount'
          }
        ]}
        radioClickBack={() => {}}
        content={customerGrowTrendData.toJS()}
        rangeVisible={false}
      />
    );
  }
}
