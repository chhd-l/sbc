import React from 'react';
import { WMChart } from 'biz';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';

@Relax
export default class TradeTrendsCharts extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeTrendData: IList;
    };
  };

  static relaxProps = {
    tradeTrendData: 'tradeTrendData'
  };

  render() {
    const { tradeTrendData } = this.props.relaxProps;

    return (
      <WMChart
        multiYAxis={true}
        title=""
        startTime={new Date('2017/10/00')}
        endTime={new Date('2017/10/10')}
        dataDesc={[
          { title: 'Order number', key: 'orderCount' },
          { title: 'Order amount', key: 'orderAmt' },
          { title: 'Number of payment orders', key: 'payOrderCount' },
          { title: 'Payment amount', key: 'payOrderAmt' }
        ]}
        radioClickBack={() => {}}
        content={tradeTrendData.size > 0 ? tradeTrendData.toJS() : null}
        rangeVisible={false}
      />
    );
  }
}
