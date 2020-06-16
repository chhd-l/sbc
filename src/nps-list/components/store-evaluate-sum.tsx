import React from 'react';
import { IMap, Relax } from 'plume2';

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    storeEvaluateSum: 'storeEvaluateSum'
  };

  render() {
    const { storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div>
        Overview:Product rating&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumGoodsScore
          ? parseFloat(storeEvaluateSum.sumGoodsScore).toFixed(2)
          : '-'}
      </div>
    );
  }
}
