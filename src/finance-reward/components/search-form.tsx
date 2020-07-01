import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      searchForm: any;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormChange: noop,
    onSearch: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onFormChange, searchForm, onSearch } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Select
            getPopupContainer={() => document.getElementById('page-content1')}
            style={{ width: 180 }}
            onChange={(e) => {
              onFormChange({
                field: 'payOrderStatus',
                value: e
              });
            }}
            defaultValue={''}
          >
            <Option value={null}></Option>
            <Option value="0">Last 180 days</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="PrescriberID" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'orderNo',
                value
              });
            }}
            value={searchForm.get('orderNo')}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="PrescriberName" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'orderNo',
                value
              });
            }}
            value={searchForm.get('orderNo')}
          />
        </FormItem>

        {/* <br /> */}

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
            {<FormattedMessage id="search" />}
          </Button>
        </FormItem>
      </Form>
    );
  }
}
