import React from 'react';
import { IMap, Relax } from 'plume2';
import { DatePicker, Icon, Select, Input, Button } from 'antd';
import '../index.less';
import { cache, noop } from 'qmkit';
import moment from 'moment';
import { Link } from 'react-router-dom';
//import { FormattedMessage } from 'react-intl';
const { WeekPicker } = DatePicker;
const { Option } = Select;

@Relax
export default class Header extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      prescribers: '',
      rc: '',
      searchData: '',
      prescriber: 'prescribersId',
      prescriberInput: '',
      aa: '11'
    };
  }

  props: {
    relaxProps?: {
      header: IMap;
      storeEvaluateSum: IMap;
      newInit: Function;
      search: any;
      searchData: any;
      onSearchData: Function;
    };
  };

  static relaxProps = {
    header: 'header',
    storeEvaluateSum: 'storeEvaluateSum',
    newInit: noop,
    search: 'search',
    searchData: 'searchData',
    onSearchData: noop
  };

  componentDidMount() {
    let prescribers = JSON.parse(sessionStorage.getItem('s2b-employee@data')).prescribers;
    this.setState({
      prescribers: sessionStorage.getItem('s2b-employee@data') ? prescribers : '',
      prescriber: prescribers && prescribers.length > 0 ? prescribers[0] : {}
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

  onSearch = () => {
    if (this.state.prescriberInput == '') {
      return;
    } else {
      const { onSearchData } = this.props.relaxProps as any;
      onSearchData({ prescriberName: this.state.prescriberInput });
      this.props.changePage(true);
    }
  };

  onSearch1 = (res) => {
    this.setState({
      prescriber: res
    });
  };

  onSearch2 = (res) => {
    this.setState({
      prescriberInput: res
    });
  };

  render() {
    return (
      <div className="shopHeader home space-between">
        <div className="Header-date flex-start-align">
          <Icon type="clock-circle" className="Header-date-icon" />
          <WeekPicker defaultValue={moment(sessionStorage.getItem(cache.CURRENT_YEAR))} onChange={this.dateChange} placeholder="Select week" />
          <div className="Header-date-text">* The data is updated every 15 minutes</div>
        </div>
        <div className="home-prescriber flex-start-end">
          <span style={{ marginRight: 8 }}>Prescriber: </span>
          <Input
            style={{ width: 200, marginRight: 8 }}
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onSearch2(value);
            }}
          />
          <Button shape="circle" icon="search" onClick={this.onSearch} />
        </div>
        {this.state.prescriber.id ? (
          <div>
            <Link style={{ textDecoration: 'underline' }} to={'/prescriber-edit/' + this.state.prescriber.id}>
              Manage Prescriber
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
