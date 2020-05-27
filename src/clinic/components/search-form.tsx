import React from 'react';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop } from 'qmkit';
import * as webapi from './../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        clinicId: '',
        clinicName: '',
        clinicPhone: '',
        clinicCity: '',
        clinicZip: '',
        clinicType: ''
      }
    };
    this.init();
  }
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state.searchForm;
    const { res } = await webapi.fetchClinicList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      this.props.getClinicList(res.context);
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };
  render() {
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="Clinic ID"
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onFormChange({
                field: 'clinicId',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore="Clinic Name"
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onFormChange({
                field: 'clinicName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore="Clinic Phone"
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onFormChange({
                field: 'clinicPhone',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            label="Clinic City"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              this.onFormChange({
                field: 'clinicCity',
                value
              });
            }}
          >
            <Option value="">All</Option>
            <Option value="0">Mexico City</Option>
            <Option value="1">Monterrey</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="Clinic Zip"
            onChange={(e) => {
              const value = (e.target as any).value;
              this.onFormChange({
                field: 'clinicZip',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            label="Clinic Type"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              this.onFormChange({
                field: 'clinicType',
                value
              });
            }}
          >
            <Option value="">All</Option>
            <Option value="0">Mexico City</Option>
            <Option value="1">Monterrey</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              this.onSearch();
            }}
          >
            Search
          </Button>
        </FormItem>
      </Form>
    );
  }
}
