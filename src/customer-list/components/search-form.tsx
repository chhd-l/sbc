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
    const customerTypeArr = [
      {
        value: 'Member',
        name: 'Member',
        id: 1
      },
      {
        value: 'Visitor',
        name: 'Visitor',
        id: 1
      }
    ];

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="customerAccount" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerAccount',
                value
              });
            }}
          />
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
            label="Customer type"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerType',
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
            addonBefore={<FormattedMessage id="email" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'email',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="phoneNumber" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'phoneNumber',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            shape="round"
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
}
