import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SelectGroup, noop, Const, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
//const RangePicker = DatePicker.RangePicker;
const { RangePicker } = DatePicker;
@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      beginTime: moment(nextProps.relaxProps.dateRange.get('beginTime')),
      endTime: moment(nextProps.relaxProps.dateRange.get('endTime')),
      pickErrorInfo: ''
    });
  }

  state = {
    beginTime: moment(this.props.relaxProps.dateRange.get('beginTime')),
    endTime: moment(this.props.relaxProps.dateRange.get('endTime')),
    pickOpen: false,
    pickErrorInfo: ''
  };
  props: {
    form?: any;
    relaxProps?: {
      searchForm: any;
      onFormChange: Function;
      bulkExport: Function;
      onSearch: Function;
      dateRange: any;
      //改变日期范围
      changeDateRange: Function;
      //根据日期搜索
      searchByDate: Function;
      beginTime: any;
      endTime: any;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormChange: noop,
    onSearch: noop,
    dateRange: 'dateRange',
    changeDateRange: noop,
    searchByDate: noop,
    bulkExport: noop
  };

  render() {
    const {
      onFormChange,
      searchForm,
      onSearch,
      bulkExport
    } = this.props.relaxProps;
    const { searchByDate } = this.props.relaxProps;
    const { beginTime, endTime, pickOpen, pickErrorInfo } = this.state;
    const options = {
      onFocus: () => {
        this.setState({ pickOpen: true });
      },
      onBlur: () => {
        this.setState({ pickOpen: false });
      }
    };
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <RangePicker
            getCalendarContainer={() => document.getElementById('page-content')}
            allowClear={false}
            format="YYYY-MM-DD"
            placeholder={['Start Time', 'End Time']}
            onChange={(date, dateString) =>
              this._handleDateParams(date, dateString)
            }
            renderExtraFooter={() =>
              pickErrorInfo != '' && (
                <span style={{ color: 'red' }}>{pickErrorInfo}</span>
              )
            }
            value={[beginTime, endTime]}
            open={pickOpen}
            onOpenChange={() => this.setState({ pickErrorInfo: '' })}
            {...options}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="OrderNumber" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'id',
                value
              });
            }}
            value={searchForm.get('id')}
          />
        </FormItem>

        {/* <br /> */}

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
            {<FormattedMessage id="search" />}
          </Button>
        </FormItem>
        <FormItem>
          <AuthWrapper functionName={'rewardDetailListExport'}>
            <div style={{ paddingBottom: '16px' }}>
              <Button onClick={() => bulkExport()}>
                {<FormattedMessage id="bulkExport" />}
              </Button>
            </div>
          </AuthWrapper>
          {/*<Button
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            {<FormattedMessage id="BulkExport" />}
          </Button>*/}
        </FormItem>
      </Form>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date, _dateString) => {
    let startTime = date[0];
    let endTime = date[1];
    let endTimeClone: any = endTime.clone();
    if (startTime.valueOf() >= endTimeClone.subtract(3, 'months').valueOf()) {
      this.setState({ pickOpen: false, pickErrorInfo: '' });
      const { changeDateRange } = this.props.relaxProps;
      changeDateRange('beginTime', startTime.format('YYYY-MM-DD').toString());
      changeDateRange('endTime', endTime.format('YYYY-MM-DD').toString());
    } else {
      this.setState({
        pickOpen: true,
        pickErrorInfo: 'The start time and end time should be within three months'
      });
    }
  };
}
