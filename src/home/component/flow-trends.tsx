import React from 'react';
import { WMChart } from 'biz';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';

@Relax
export default class FlowTrendsCharts extends React.Component<any, any> {
  props: {
    relaxProps?: {
      flowTrendData: IList;
    };
  };

  static relaxProps = {
    flowTrendData: 'flowTrendData'
  };

  render() {
    const { flowTrendData } = this.props.relaxProps;

    return (
      <WMChart
        title=""
        startTime={new Date()}
        endTime={new Date()}
        dataDesc={[
          { title: 'visitor number UV', key: 'totalUv' },
          { title: 'page view PV', key: 'totalPv' },
          { title: 'Product visitor number', key: 'skuTotalUv' },
          { title: 'Products page view', key: 'skuTotalPv' }
        ]}
        radioClickBack={() => {}}
        content={flowTrendData.toJS()}
        rangeVisible={false}
      />
    );
  }
}
