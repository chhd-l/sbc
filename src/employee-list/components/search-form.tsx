import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select, Row, Col } from 'antd';
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
        <Row id="input-lable-wwidth">
          <Col span="8">
            <FormItem>
              <Input  
              // style={{width:'100% !important'}}
                addonBefore={<FormattedMessage id="employeeName"  />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'userName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="employeeEmail" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'email',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          {/*<Col span="8">
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
          </Col>*/}

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

          {/* <FormItem>
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
        </FormItem> */}

          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<FormattedMessage id="status" />}
                // style={{ width: 300 }}
                defaultValue={null}
                onChange={(e) => {
                  onFormChange({
                    field: 'accountState',
                    value: e
                  });
                }}
              >
                <Option value={null} key={null}>
                  {'All'}
                </Option>
                <Option value={'3'}>Inactivated</Option>
                <Option value={'4'}>To be audit</Option>
                <Option value={'0'}>Enable</Option>
                <Option value={'1'}>Disabled</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          {/* <FormItem>
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
            <Option value="">??????</Option>
            <Option value="1">???</Option>
            <Option value="0">???</Option>
          </SelectGroup>
        </FormItem> */}

          {/* <FormItem>
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
            <Option value="">??????</Option>
            <Option value="0">???</Option>
            <Option value="1">???</Option>
          </SelectGroup>
        </FormItem> */}

          {/* <FormItem>
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
            <Option value="">??????</Option>
            <Option value="1">???</Option>
            <Option value="0">???</Option>
          </SelectGroup>
        </FormItem> */}

          <Col span="24" style={{ textAlign: 'center' }}>
            <FormItem>
              <Button icon="search" type="primary" shape="round" onClick={() => onSearch()} htmlType="submit">
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * ????????????
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
