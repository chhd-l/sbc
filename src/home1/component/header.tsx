import React from 'react';
import { IMap, Relax } from 'plume2';
import { DatePicker, Icon, Select } from 'antd';
import '../index.less';

//import { Link } from 'react-router-dom';
//import { FormattedMessage } from 'react-intl';
const { WeekPicker } = DatePicker;
const { Option } = Select;

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

  dateChange = () => {};

  prescriberChange = () => {};

  render() {
    const { header, storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div className="shopHeader home space-between">
        <div className="Header-date flex-start-align">
          <Icon type="clock-circle" className="Header-date-icon" />
          <WeekPicker onChange={this.dateChange} placeholder="Select week" />
          <div className="Header-date-text">* The data is updated every 15 minutes</div>
        </div>
        <div className="home-prescriber flex-start-end">
          <div className="prescriber">Prescriber</div>
          <Select defaultValue="Prescriber" style={{ width: 120 }} onChange={this.prescriberChange}>
            <Option value="Prescriber">Prescriber</Option>
          </Select>
        </div>
        {/*<div className="two-text">
          <div style={{ marginBottom: 5 }}>
            {header.get('preTxt')}
            <span>{header.get('errTxt')}</span>
            {header.get('postTxt')}
            <span>{header.get('midErr')}</span>
            {header.get('lastTxt')}
          </div>
          <div>{header.get('text')}</div>
        </div>
        <div className="store-mess">
          <div className="store-score">
            <FormattedMessage id="overall" />
          </div>
          <div className="store-date">
            <FormattedMessage id="last180" />
          </div>
          <div className="store-number">
            {storeEvaluateSum.sumCompositeScore
              ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
              : '-'}
          </div>
        </div>
        <div className="store-mess">
          <div className="store-score">
            <FormattedMessage id="shopping" />
          </div>
          <div className="store-date">
            <FormattedMessage id="last180" />
          </div>
          <div className="store-number">
            {storeEvaluateSum.sumCompositeScore
              ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
              : '-'}
          </div>
        </div>*/}
      </div>
    );
  }
}
