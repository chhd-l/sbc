import React from 'react';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop, Const } from 'qmkit';
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';

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
    if (res.code === Const.SUCCESS_CODE) {
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
            addonBefore="Prescriber ID"
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
            addonBefore="Prescriber name"
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
            addonBefore="Prescriber phone"
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
            label={<FormattedMessage id="Prescriber.PrescriberCity" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              this.onFormChange({
                field: 'clinicCity',
                value
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="Prescriber.All" />
            </Option>
            <Option value="0">
              <FormattedMessage id="Prescriber.MexicoCity" />
            </Option>
            <Option value="1">
              <FormattedMessage id="Prescriber.Monterrey" />
            </Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="Prescriber zip"
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
            label={<FormattedMessage id="Prescriber.PrescriberType" />}
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              this.onFormChange({
                field: 'clinicType',
                value
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="Prescriber.All" />
            </Option>
            <Option value="0">
              <FormattedMessage id="Prescriber.MexicoCity" />
            </Option>
            <Option value="1">
              <FormattedMessage id="Prescriber.Monterrey" />
            </Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              this.onSearch();
            }}
          >
            <FormattedMessage id="Prescriber.Search" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}
