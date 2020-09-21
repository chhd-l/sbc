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
          <div className="Header-date-text">
            * The data is updated every 15 minutes
          </div>
        </div>
        <div className="home-prescriber flex-start-end">
          <div className="prescriber">Prescriber</div>
          <Select
            defaultValue="Prescriber"
            style={{ width: 120 }}
            onChange={this.prescriberChange}
          >
            <Option value="Prescriber">Prescriber</Option>
          </Select>
        </div>
      </div>
    );
  }
}
