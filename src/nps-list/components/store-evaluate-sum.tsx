import React from 'react';
import { IMap, Relax } from 'plume2';
import * as webapi from '../webapi';

@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      evaluateCount: '',
      compositeScore: ''
    };
  }
  props: {
    relaxProps?: {
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    storeEvaluateSum: 'storeEvaluateSum'
  };
  async componentDidMount() {
    let res = await webapi.getCompositeScore({ scoreCycle: 0, numType: 1 });
    let data = res.res.context;
    this.setState({
      evaluateCount: data.evaluateCount,
      compositeScore: data.compositeScore
    });
  }
  render() {
    const { storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div>
        Overview:Overall rating&nbsp;&nbsp;&nbsp;
        {this.state.compositeScore
          ? parseFloat(this.state.compositeScore).toFixed(2)
          : '-'}
        &nbsp;&nbsp;&nbsp; Shopping rating&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumGoodsScore
          ? parseFloat(storeEvaluateSum.sumGoodsScore).toFixed(2)
          : '-'}
        &nbsp;&nbsp;&nbsp; Number of survey&nbsp;&nbsp;&nbsp;
        {this.state.evaluateCount}&nbsp;&nbsp;&nbsp;
      </div>
    );
  }
}
