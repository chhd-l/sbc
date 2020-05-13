import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      employee: TList;
      customerLevels: TList;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    employee: ['employee'],
    customerLevels: ['customerLevels'],
    onFormChange: noop,
    onSearch: noop
  };

  render() {
    const { onFormChange, onSearch, customerLevels } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
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

        {/*省市区*/}
        <FormItem>
          <AreaSelect
            label={<FormattedMessage id="area" />}
            getPopupContainer={() => document.getElementById('page-content')}
            onChange={(value) => {
              onFormChange({
                field: 'area',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="platformLevel" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerLevelId',
                value
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="all" />
            </Option>
            {customerLevels.map((v) => (
              <Option
                key={v.get('storeLevelId').toString()}
                value={v.get('storeLevelId').toString()}
              >
                {v.get('levelName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="accountStatus" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerStatus',
                value
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="all" />
            </Option>
            <Option value="0">
              <FormattedMessage id="enable" />
            </Option>
            <Option value="1">
              <FormattedMessage id="disabled" />
            </Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="accountNumber" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerAccount',
                value
              });
            }}
          />
        </FormItem>

        {/*<FormItem>*/}
        {/*<SelectGroup*/}
        {/*getPopupContainer={() => document.getElementById('page-content')}*/}
        {/*label="业务员"*/}
        {/*style={{ width: 80 }}*/}
        {/*onChange={value => {*/}
        {/*value = value === '' ? null : value;*/}
        {/*onFormChange({*/}
        {/*field: 'employeeId',*/}
        {/*value*/}
        {/*})*/}
        {/*}}>*/}
        {/*<Option value=""><FormattedMessage id="all" /></Option>*/}
        {/*{employee.map(v =>*/}
        {/*<Option*/}
        {/*key={v.get('employeeId').toString()}*/}
        {/*value={v.get('employeeId').toString()}>*/}
        {/*{v.get('employeeName')}*/}
        {/*</Option>*/}
        {/*)}*/}
        {/*</SelectGroup>*/}
        {/*</FormItem>*/}

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
            <FormattedMessage id="search" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}
