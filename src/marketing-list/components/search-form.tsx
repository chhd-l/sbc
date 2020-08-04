import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { SelectGroup, noop, Const, util } from 'qmkit';
import { List } from 'immutable';
// import locale from 'antd/es/date-picker/locale/lv_LV';
import moment from 'moment';
import 'moment/locale/en-au';
moment.locale('en-au');
type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      customerLevels: TList;
      defaultLocalDateTime: any;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  static relaxProps = {
    customerLevels: ['customerLevels'],
    defaultLocalDateTime: 'defaultLocalDateTime',
    onFormChange: noop,
    onSearch: noop
  };

  render() {
    const {
      onFormChange,
      onSearch,
      customerLevels,
      defaultLocalDateTime
    } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="Promotion type"
            style={{ width: 170 }}
            defaultValue="All"
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'promotionType',
                value
              });
            }}
          >
            <Option value="">All</Option>
            <Option value="0">Normal promotion</Option>
            <Option value="1">Subscription promotion</Option>
            {/* <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option> */}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="Campaign Type"
            style={{ width: 160 }}
            defaultValue="All"
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'subType',
                value
              });
            }}
          >
            <Option value={null}>All</Option>
            <Option value="0">Full amount reduction</Option>
            <Option value="1">Full quantity reduction</Option>
            <Option value="2">Full amount discount</Option>
            <Option value="3">Full quantity discount</Option>
            {/* <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option> */}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <Input
            addonBefore="Campaign name"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'marketingName',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            // defaultValue={moment(new Date('2015-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss')}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={startValue}
            placeholder="Start time"
            onChange={this.onStartChange}
            showToday={false}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            // defaultValue={moment(new Date(defaultLocalDateTime), 'YYYY-MM-DD')}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={endValue}
            placeholder="End time"
            onChange={this.onEndChange}
            showToday={false}
          />
        </FormItem>

        {/*<FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="Promotion type"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'targetLevelId',
                value
              });
            }}
          >
            <Option value="">All</Option>
            <Option value="-1">Full platform consumer</Option>
            {util.isThirdStore() && <Option value="0">All Leave</Option>}
            {customerLevels.map((v) => (
              <Option
                key={v.get('customerLevelId').toString()}
                value={v.get('customerLevelId').toString()}
              >
                {v.get('customerLevelName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>*/}

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            Search
          </Button>
        </FormItem>
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'startTime', value: time });
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'endTime', value: time });
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
}
