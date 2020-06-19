import React from 'react';
import { IMap, Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Header extends React.Component<any, any> {
  props: {
    relaxProps?: {
      header: IMap;
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    header: 'header',
    storeEvaluateSum: 'storeEvaluateSum'
  };

  render() {
    const { header, storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div className="shopHeader" style={{ justifyContent: 'left' }}>
        {/* <div className="two-text">
          <div style={{ marginBottom: 5 }}>
            {header.get('preTxt')}
            <span>{header.get('errTxt')}</span>
            {header.get('postTxt')}
            <span>{header.get('midErr')}</span>
            {header.get('lastTxt')}
          </div>
          <div>{header.get('text')}</div>
        </div> */}
        <div className="store-mess">
          <div className="store-score">
            <FormattedMessage id="overall" />
          </div>
          <div className="store-number">
            {storeEvaluateSum.sumCompositeScore
              ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
              : '-'}
          </div>
          <div className="store-date">
            <FormattedMessage id="last180" />
          </div>
        </div>
        <div className="store-mess">
          <div className="store-score">
            <FormattedMessage id="shopping" />
          </div>
          <div className="store-number">
            {storeEvaluateSum.sumCompositeScore
              ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
              : '-'}
          </div>
          <div className="store-date">
            <FormattedMessage id="last180" />
          </div>
        </div>
      </div>
    );
  }
}
