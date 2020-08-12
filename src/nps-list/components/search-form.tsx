import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const customerTypeArr = [
  {
    value: 'Member',
    name: 'Member',
    id: 234
  },
  {
    value: 'Guest',
    name: 'Guest',
    id: 233
  }
];
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      onSelectOptionChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    onSelectOptionChange: noop,
    form: 'form'
  };

  constructor(props) {
    super(props);
    this.state = {
      customerOptions: 'customerName'
    };
  }

  render() {
    const { onFormChange, onSearch, form } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="orderNumber" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'orderNo',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            defaultValue=""
            label={<FormattedMessage id="consumerType" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'consumerType',
                value
              });
            }}
          >
            <Option value="">All</Option>
            {customerTypeArr.map((item) => (
              <Option value={item.value} key={item.id}>
                {item.name}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="consumerName" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerName',
                value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            defaultValue=""
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="ratingWithComment" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'commentStatus',
                value
              });
            }}
          >
            <Option value="">All</Option>
            <Option value="Y">Y</Option>
            <Option value="N">N</Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            defaultValue=""
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="rating" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'goodsScore',
                value
              });
            }}
            // value={form.get('goodsScore')}
          >
            <Option value="">All</Option>
            <Option value="5">5 star</Option>
            <Option value="4">4 star</Option>
            <Option value="3">3 star</Option>
            <Option value="2">2 star</Option>
            <Option value="1">1 star</Option>
          </SelectGroup>
        </FormItem>
        {/*本迭代未做,暂时注释,留到下个迭代*/}
        {/*<FormItem>
                    <SelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="是否修改"
                        style={{width: 80}}
                        onChange={value => {
                            value = value === '' ? null : value;
                            onFormChange({
                                field: 'isEdit',
                                value
                            });
                        }}
                        value={form.get('isEdit')}
                    >
                        <Option value="-1">全部</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </SelectGroup>
                </FormItem>*/}
        <FormItem style={{ marginTop: 2 }}>
          <RangePicker
            getCalendarContainer={() => document.getElementById('page-content')}
            onChange={(e) => {
              let beginTime = null;
              let endTime = null;
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              }
              onFormChange({
                field: 'createTimeBegin',
                value: beginTime + ' 00:00:00'
              });
              onFormChange({
                field: 'createTimeEnd',
                value: endTime + ' 23:59:59'
              });
            }}
          />
        </FormItem>

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
            <span>
              <FormattedMessage id="search" />
            </span>
          </Button>
        </FormItem>
      </Form>
    );
  }

  _renderCustomerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.props.relaxProps.onSelectOptionChange(
            this.state.customerOptions,
            val
          );
          this.setState({
            customerOptions: val
          });
        }}
        value={this.state.customerOptions}
        style={{ width: 100 }}
      >
        <Option value="customerName">会员名称</Option>
        <Option value="customerAccount">会员账号</Option>
      </Select>
    );
  };
}
