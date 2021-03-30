import React from 'react';
import { IMap, Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
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
        <FormattedMessage id="Product.overview" />：
        <FormattedMessage id="Product.overallRating" />
        &nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumCompositeScore ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2) : '-'}
        &nbsp;&nbsp;&nbsp; <FormattedMessage id="Product.productRating" />
        &nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumGoodsScore ? parseFloat(storeEvaluateSum.sumGoodsScore).toFixed(2) : '-'}
        &nbsp;&nbsp;&nbsp; <FormattedMessage id="Product.experienceRating" />
        &nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumServerScore ? parseFloat(storeEvaluateSum.sumServerScore).toFixed(2) : '-'}
        &nbsp;&nbsp;&nbsp; <FormattedMessage id="Product.logisticRating" />
        &nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumLogisticsScoreScore ? parseFloat(storeEvaluateSum.sumLogisticsScoreScore).toFixed(2) : '-'}
      </div>
    );
  }
}
