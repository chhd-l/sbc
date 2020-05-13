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
export default class SelfSearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      employee: TList;
      customerLevels: TList;
      onSelfFormChange: Function;
      onSelfSearch: Function;
    };
  };

  static relaxProps = {
    employee: ['employee'],
    customerLevels: ['customerLevels'],
    onSelfFormChange: noop,
    onSelfSearch: noop
  };

  render() {
    const {
      onSelfFormChange,
      onSelfSearch,
      employee,
      customerLevels
    } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="consumerName" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onSelfFormChange({
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
              onSelfFormChange({
                field: 'area',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="consumerType" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onSelfFormChange({
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
                key={v.get('customerLevelId').toString()}
                value={v.get('customerLevelId').toString()}
              >
                {v.get('customerLevelName')}
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
              onSelfFormChange({
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
              onSelfFormChange({
                field: 'customerAccount',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="auditors" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onSelfFormChange({
                field: 'employeeId',
                value
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="all" />
            </Option>
            {employee.map((v) => (
              <Option
                key={v.get('employeeId').toString()}
                value={v.get('employeeId').toString()}
              >
                {v.get('employeeName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              onSelfSearch();
            }}
          >
            <FormattedMessage id="search" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}
