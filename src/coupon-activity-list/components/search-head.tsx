import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { Const, noop, SelectGroup, util } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      levelList: IList;

      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    levelList: 'levelList',

    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { form, onFormFieldChange, search, levelList } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="Marketing.ActivityName"/>}
            value={form.get('activityName')}
            onChange={(e: any) => {
              onFormFieldChange('activityName', e.target.value);
            }}
          />
        </FormItem>

        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="活动类型"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('couponActivityType', value);
            }}
          >
            <Select.Option key="-1" value="-1">
              不限
            </Select.Option>
            <Select.Option key="0" value="0">
              全场赠券
            </Select.Option>
            <Select.Option key="1" value="1">
              精准发券
            </Select.Option>
            <Select.Option key="2" value="2">
              进店赠券
            </Select.Option>
          </SelectGroup>
        </FormItem> */}

        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="目标客户"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('joinLevel', value);
            }}
          >
            <Select.Option key="-3" value="-3">
              不限
            </Select.Option>
            <Select.Option key="-1" value="-1">
              {util.isThirdStore() ? '全部客户' : '全平台客户'}
            </Select.Option>
            {util.isThirdStore() && (
              <Select.Option key="0" value="0">
                全部等级
              </Select.Option>
            )}
            {levelList &&
              levelList.map((item) => {
                return (
                  <Select.Option key={item.get('key')} value={item.get('key')}>
                    {item.get('value')}
                  </Select.Option>
                );
              })}
            <Select.Option key="-2" value="-2">
              指定客户
            </Select.Option>
          </SelectGroup>
        </FormItem> */}

        <FormItem>
          <DatePicker allowClear={true} disabledDate={this.disabledStartDate} showTime={{ format: 'HH:mm' }} format={Const.DATE_FORMAT} value={startValue} placeholder="Start time" onChange={this.onStartChange} showToday={false} />
        </FormItem>
        <FormItem>
          <DatePicker allowClear={true} disabledDate={this.disabledEndDate} showTime={{ format: 'HH:mm' }} format={Const.DATE_FORMAT} value={endValue} placeholder="End time" onChange={this.onEndChange} showToday={false} />
        </FormItem>

        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            shape="round"
            onClick={(e) => {
              e.preventDefault();
              search();
            }}
          >
            <FormattedMessage id="Marketing.Search" />
          </Button>
        </FormItem>
      </Form>
    );
  }

  /**
   * 不可选择的开始日期
   */
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  /**
   * 不可选择的结束日期
   */
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  /**
   *改变表单字段
   */
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  /**
   * 改变开始日期
   */
  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  /**
   * 改变结束日期
   */
  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
