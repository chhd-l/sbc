import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      roles: List<any>;
      // searchForm: Map<string, any>
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    roles: 'roles'
    // searchForm: 'searchForm'
  };

  render() {
    const { onFormChange, onSearch, roles } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="employeeName" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'userName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="employeePhone" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'userPhone',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="employeeNo" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'jobNo',
                value
              });
            }}
          />
        </FormItem>

        {/* <FormItem>
          <Input
            addonBefore={<FormattedMessage id="basicSetting" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'departmentIds',
                value
              });
            }}
          />
        </FormItem> */}

        {/* <FormItem>
          <Input
            addonBefore={<FormattedMessage id="basicSetting" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'accountName',
                value
              });
            }}
          />
        </FormItem> */}

        <FormItem>
          <SelectGroup
            label={<FormattedMessage id="roles" />}
            mode="multiple"
            showSearch
            getPopupContainer={() => document.getElementById('page-content')}
            style={{ width: 300 }}
            onChange={(e) => {
              onFormChange({
                field: 'roleIds',
                value: e
              });
            }}
          >
            {this._renderOption(roles)}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="status" />}
            style={{ width: 80 }}
            defaultValue={null}
            onChange={(e) => {
              onFormChange({
                field: 'accountState',
                value: e
              });
            }}
          >
            <Option value={null} key={null}>
              {'全部'}
            </Option>
            <Option value={'0'}>正常</Option>
            <Option value={'1'}>停用</Option>
            <Option value={'2'}>离职</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="supervisor" />}
            style={{ width: 80 }}
            defaultValue={''}
            onChange={(value) => {
              onFormChange({
                field: 'isLeader',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="assistant" />}
            style={{ width: 80 }}
            defaultValue={''}
            onChange={(value) => {
              onFormChange({
                field: 'isEmployee',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="0">是</Option>
            <Option value="1">否</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label={<FormattedMessage id="whetherToActivateTheMemberAccount" />}
            style={{ width: 80 }}
            defaultValue={''}
            onChange={(value) => {
              onFormChange({
                field: 'becomeMember',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            icon="search"
            type="primary"
            onClick={() => onSearch()}
            htmlType="submit"
          >
            <FormattedMessage id="search" />
          </Button>
        </FormItem>
      </Form>
    );
  }

  /**
   * 系统角色
   * @param roles
   * @returns {Iterable<number, any>}
   * @private
   */
  _renderOption(roles: List<any>) {
    return roles.map((option) => {
      return (
        <Option value={option.get('roleInfoId')} key={option.get('roleInfoId')}>
          {option.get('roleName')}
        </Option>
      );
    });
  }
}
