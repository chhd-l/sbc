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
        startTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
        endTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
        dataDesc={[
          { title: 'UV', key: 'totalUv' },
          { title: 'PV', key: 'totalPv' }
        ]}
        radioClickBack={() => {}}
        content={flowTrendData.toJS()}
        rangeVisible={false}
      />
    );
  }
}
