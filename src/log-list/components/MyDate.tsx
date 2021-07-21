import React from 'react';
import { DatePicker } from 'antd';
import {Const} from 'qmkit';
// import { RangePickerProps } from 'antd/lib/date-picker/interface';

const RangerPicker = DatePicker.RangePicker;

export default class DatePickerLaber extends React.PureComponent<any, any> {

  render() {
    const { label, children, ...rest } = this.props;
    return (
      <div
        className="ant-input-wrapper ant-input-group select-group"
        style={{ lineHeight: '0.5', display: 'table'}}
      >
        <span className="ant-input-group-addon" style={{width:143,textAlign:'center'}}>{this.props.label}</span>
        <DatePicker format={Const.DATE_FORMAT} {...rest}>{children}</DatePicker>
      </div>
    );
  }
}
