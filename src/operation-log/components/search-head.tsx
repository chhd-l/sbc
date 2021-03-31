import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select, Row, Col } from 'antd';
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
            <Row id="input-lable-wwidth">
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={
                      <p>
                        <FormattedMessage id="Setting.operatorAccount" />
                      </p>
                    }
                    onChange={(e) => {
                      search.opAccount = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={
                      <p>
                        <FormattedMessage id="Setting.operatorName" />
                      </p>
                    }
                    // addonBefore={<FormattedMessage id="operatorName" />}
                    onChange={(e) => {
                      search.opName = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span="8" id="select-group-width">
                <FormItem>
                  <SelectGroup
                    getPopupContainer={() => document.getElementById('page-content')}
                    defaultValue=""
                    label={<FormattedMessage id="Setting.module" />}
                    onChange={(value) => {
                      search.opModule = value;
                      this.setState({ search: search });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="Setting.All" />
                    </Option>
                    <Option value="Login">
                      <FormattedMessage id="Setting.Login" />
                    </Option>
                    <Option value="Goods">
                      <FormattedMessage id="Setting.Goods" />
                    </Option>
                    <Option value="Order">
                      <FormattedMessage id="Setting.Order" />
                    </Option>
                    <Option value="Prescriber">
                      <FormattedMessage id="Setting.Prescriber" />
                    </Option>
                    <Option value="Marketing">
                      <FormattedMessage id="Setting.Marketing" />
                    </Option>
                    <Option value="Finance">
                      <FormattedMessage id="Setting.Finance" />
                    </Option>
                    <Option value="Setting">
                      <FormattedMessage id="Setting.Setting" />
                    </Option>
                    <Option value="Customer Delivery">
                      <FormattedMessage id="Setting.CustomerDelivery" />
                    </Option>
                    <Option value="Customer Billing">
                      <FormattedMessage id="Setting.CustomerBilling" />
                    </Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={<FormattedMessage id="Setting.operatorType" />}
                    onChange={(e) => {
                      search.opCode = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={<FormattedMessage id="Setting.operatorContent" />}
                    onChange={(e) => {
                      search.opContext = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span="8" id="range-picker-width-mx">
                <FormItem>
                  <RangePicker
                    // style={{ width: '294px' }}
                    getCalendarContainer={() => document.getElementById('page-content')}
                    defaultValue={[search.beginTime, search.endTime]}
                    value={[search.beginTime, search.endTime]}
                    format={Const.DATE_FORMAT}
                    showTime={{ format: 'HH:mm' }}
                    open={pickOpen}
                    allowClear={false}
                    renderExtraFooter={() => pickErrorInfo != '' && <span style={{ color: 'red' }}>{pickErrorInfo}</span>}
                    onChange={this._handleDateParams}
                    onOk={this._dateOkBtn}
                    {...options}
                  />
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      //将搜索条件复制到导出条件
                      const { opAccount, opName, opCode, opModule, opContext, beginTime, endTime } = this.state.search;

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
                    <span>
                      <FormattedMessage id="Setting.search" />
                    </span>
                  </Button>
                </FormItem>
                <AuthWrapper functionName="f_operation_log_export">
                  <FormItem>
                    <Button
                      type="primary"
                      icon="download"
                      onClick={() => {
                        const { opAccount, opName, opCode, opModule, opContext, beginTime, endTime } = this.state.export;

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
                      <FormattedMessage id="Setting.export" />
                    </Button>
                  </FormItem>
                </AuthWrapper>
              </Col>
            </Row>
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
