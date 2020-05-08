import React from 'react';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

export default class SearchForm extends React.Component<any, any> {
  render() {
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input addonBefore="Clinic ID" />
        </FormItem>

        <FormItem>
          <Input addonBefore="Clinic Name" />
        </FormItem>

        <FormItem>
          <Input addonBefore="Clinic Phone" />
        </FormItem>

        <FormItem>
          <SelectGroup label="Clinic City" style={{ width: 80 }}>
            <Option value="">All</Option>
            <Option value="0">Mexico City</Option>
            <Option value="1">Monterrey</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input addonBefore="Clinic Zip" />
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" icon="search">
            Search
          </Button>
        </FormItem>
      </Form>
    );
  }
}
