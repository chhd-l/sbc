import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { Const, noop, SelectGroup, AuthWrapper } from 'qmkit';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 日志查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onExportByParams: Function;
      dataList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onExportByParams: noop,
    dataList: 'dataList'
  };

  constructor(props) {
    super(props);

    this.state = {
      search: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      export: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      pickOpen: false,
      pickErrorInfo: ''
    };
  }

  render() {
    const { onSearch, onExportByParams } = this.props.relaxProps;
    const { search, pickOpen, pickErrorInfo } = this.state;
    const options = {
      onFocus: () => {
        this.setState({ pickOpen: true });
      },
      onBlur: () => {
        this.setState({ pickOpen: false });
      }
    };
    return (
      <div>
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="operatorAccount" />}
                onChange={(e) => {
                  search.opAccount = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="operatorName" />}
                onChange={(e) => {
                  search.opName = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue=""
                label={<FormattedMessage id="module" />}
                onChange={(value) => {
                  search.opModule = value;
                  this.setState({ search: search });
                }}
              >
                <Option value="">All</Option>
                <Option value="登录">Login</Option>
                <Option value="商品">Product</Option>
                <Option value="订单">Order</Option>
                <Option value="客户">Client</Option>
                <Option value="营销">Marketing</Option>
                <Option value="财务">Finance</Option>
                <Option value="设置">Setting</Option>
                <Option value="账户管理">Account management</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="operatorType" />}
                onChange={(e) => {
                  search.opCode = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="operatorContent" />}
                onChange={(e) => {
                  search.opContext = (e.target as any).value;
                  this.setState({ search: search });
                }}
              />
            </FormItem>
            <FormItem>
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue={[search.beginTime, search.endTime]}
                value={[search.beginTime, search.endTime]}
                format={Const.DATE_FORMAT}
                showTime={{ format: 'HH:mm' }}
                open={pickOpen}
                allowClear={false}
                renderExtraFooter={() =>
                  pickErrorInfo != '' && (
                    <span style={{ color: 'red' }}>{pickErrorInfo}</span>
                  )
                }
                onChange={this._handleDateParams}
                onOk={this._dateOkBtn}
                {...options}
              />
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  //将搜索条件复制到导出条件
                  const {
                    opAccount,
                    opName,
                    opCode,
                    opModule,
                    opContext,
                    beginTime,
                    endTime
                  } = this.state.search;

                  this.setState({
                    export: {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    }
                  });

                  const params = {
                    opAccount,
                    opName,
                    opCode,
                    opModule,
                    opContext,
                    beginTime,
                    endTime
                  };

                  onSearch(params);
                }}
              >
                <FormattedMessage id="search" />
              </Button>
            </FormItem>
            <AuthWrapper functionName="f_operation_log_export">
              <FormItem>
                <Button
                  type="primary"
                  icon="download"
                  onClick={() => {
                    const {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    } = this.state.export;

                    const params = {
                      opAccount,
                      opName,
                      opCode,
                      opModule,
                      opContext,
                      beginTime,
                      endTime
                    };
                    onExportByParams(params);
                  }}
                >
                  <FormattedMessage id="export" />
                </Button>
              </FormItem>
            </AuthWrapper>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date) => {
    let beginTime = date[0];
    let endTime = date[1];
    let endTimeClone = endTime.clone().subtract(3, 'months');
    //时间相差3个月以内
    const search = this.state.search;
    if (moment(beginTime).isSameOrAfter(moment(endTimeClone))) {
      search.beginTime = beginTime;
      search.endTime = endTime;
      this.setState({ pickErrorInfo: '', search: search });
    } else {
      search.beginTime = beginTime;
      search.endTime = beginTime.clone().add(3, 'months');
      this.setState({
        pickErrorInfo: 'The start time and end time should be within three months',
        search: search
      });
    }
  };

  _dateOkBtn = () => {
    const { pickErrorInfo } = this.state;
    if (pickErrorInfo === '') {
      this.setState({ pickOpen: false });
    } else {
      this.setState({ pickOpen: true });
    }
  };
}
