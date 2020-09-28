import React from 'react';
import { IMap, Relax } from 'plume2';
import { DatePicker, Icon, Select } from 'antd';
import '../index.less';
import { cache, noop } from 'qmkit';
import moment from 'moment';
//import { Link } from 'react-router-dom';
//import { FormattedMessage } from 'react-intl';
const { WeekPicker } = DatePicker;
const { Option } = Select;

@Relax
export default class Header extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      prescribers: ''
    };
  }

  props: {
    relaxProps?: {
      header: IMap;
      storeEvaluateSum: IMap;
      newInit: Function;
    };
  };

  static relaxProps = {
    header: 'header',
    storeEvaluateSum: 'storeEvaluateSum',
    newInit: noop
  };

  componentDidMount() {
    //console.log(JSON.parse(sessionStorage.getItem('s2b-employee@data')),11111111111111111);
    this.setState({
      prescribers: JSON.parse(sessionStorage.getItem('s2b-employee@data')).prescribers
    });
  }

  dateChange = (date, dateString) => {
    const { newInit } = this.props.relaxProps as any;
    let year = moment(new Date(sessionStorage.getItem('defaultLocalDateTime'))).format('YYYY');
    //console.log(JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)));
    let obj = {
      companyId: 2,
      weekNum: date.week(),
      year: Number(year)
    };
    newInit(obj);
  };

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
          {this.state.prescribers ? (
            <Select defaultValue={this.state.prescribers[0].prescriberName} onChange={this.prescriberChange}>
              {this.state.prescribers.map((item, index) => {
                return <Option value={item.prescriberId}>{item.prescriberName}</Option>;
              })}
            </Select>
          ) : null}
        </div>
      </div>
    );
  }
}
