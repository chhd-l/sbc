import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from '../store';
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
      rewardList: Function;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormChange: noop,
    onSearch: noop,
    rewardList: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      listData: {
        lastDay: '',
        PrescriberID: '',
        PrescriberName: ''
      }
    };
  }

  render() {
    const {
      onFormChange,
      searchForm,
      onSearch,
      rewardList
    } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Select
            getPopupContainer={() => document.getElementById('page-content')}
            style={{ width: 180 }}
            onChange={(e) => {
              onFormChange({
                field: 'payOrderStatus',
                value: e
              });
            }}
            defaultValue={'2'}
          >
            <Option value={null}></Option>
            <Option value="0">Last 180 days</Option>
            <Option value="1">Last 90 days</Option>
            <Option value="2">Last 60 days</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="PrescriberID" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'prescriberID',
                value
              });
            }}
            value={searchForm.get('prescriberID')}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="PrescriberName" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'prescriberName',
                value
              });
            }}
            value={searchForm.get('prescriberName')}
          />
        </FormItem>

        {/* <br /> */}

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              /*rewardList({
                field: 'search',
                value: '11111111111111111111111122222222222222'
              })*/
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
