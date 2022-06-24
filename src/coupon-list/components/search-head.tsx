import React from 'react';

import { Relax } from 'plume2';
import { DatePicker, Form, Input, Select, Button, Col } from 'antd';
import { Const, noop, SelectGroup } from 'qmkit';
import { IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { form, onFormFieldChange, search } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="Marketing.CouponName" />}
            value={form.get('likeCouponName')}
            onChange={(e: any) => {
              onFormFieldChange('likeCouponName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="Marketing.PromotionType" />}
            // style={{ width: 170 }}
            onChange={(value) => {
              onFormFieldChange('couponPurchaseType', value);
            }}
            value={form.get('couponPurchaseType')}
          >
            <Option value={null}><FormattedMessage id="Marketing.Alltype" /></Option>
            <Option value="0"><FormattedMessage id="Marketing.All" /></Option>
            <Option value="1"><FormattedMessage id="Marketing.Autoship" /></Option>
            {Const.SITE_NAME !== 'MYVETRECO' && <Option value="2"><FormattedMessage id="Marketing.Clubpromotion" /></Option>}
            <Option value="3"><FormattedMessage id="Marketing.Singlepurchase" /></Option>
            {/* <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option> */}
          </SelectGroup>
        </FormItem>
        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="Use range"
            defaultValue="Non-limitation"
            onChange={(value) => {
              onFormFieldChange('scopeType', value);
            }}
          >
            <Select.Option key="-1" value="-1">
              Non-limitation
            </Select.Option>
            <Select.Option key="0" value="0">
              {Const.couponScopeType[0]}
              All products
            </Select.Option>
            <Select.Option key="1" value="1">
              {Const.couponScopeType[1]}
              Brands
            </Select.Option>
            <Select.Option key="3" value="3">
              {Const.couponScopeType[3]}
              Product category
            </Select.Option>
            <Select.Option key="4" value="4">
              {Const.couponScopeType[4]}
              Partial products
            </Select.Option>
          </SelectGroup>
        </FormItem> */}
        <FormItem>
          <DatePicker allowClear={true} disabledDate={this.disabledStartDate} format={Const.DAY_FORMAT} value={startValue} placeholder="Start date" onChange={this.onStartChange} showToday={false} />
        </FormItem>
        <FormItem>
          <DatePicker allowClear={true} disabledDate={this.disabledEndDate} format={Const.DAY_FORMAT} value={endValue} placeholder="End date" onChange={this.onEndChange} showToday={false} />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="Marketing.createName" />}
            value={form.get('createName')}
            onChange={(e: any) => {
              onFormFieldChange('createName', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            icon="search"
            shape="round"
            htmlType="submit"
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
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
