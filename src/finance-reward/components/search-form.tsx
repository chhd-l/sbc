import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from '../store';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      searchForm: any;
      onFormChange: Function;
      onSearch: Function;
      rewardList: Function;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormChange: noop,
    onSearch: noop,
    rewardList: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      listData: {
        lastDay: '',
        prescriberId: Number,
        PrescriberName: '',
        PrescriberList: []
      }
    };
  }
  componentDidMount() {
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(
        sessionStorage.getItem('s2b-supplier@employee')
      );

      if (employee.roleName.indexOf('Prescriber') !== -1) {
        const { listData } = this.state;
        listData.PrescriberList = employee.prescribers;
      } else {
        //this.onSearch();
      }
    }
  }
  onFormChange = ({ field, value }) => {
    let data = this.state.listData.PrescriberName;
    data[field] = value;
    this.setState({
      PrescriberName: data
    });
  };
  render() {
    const {
      onFormChange,
      searchForm,
      onSearch,
      rewardList
    } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Select
            getPopupContainer={() => document.getElementById('page-content')}
            style={{ width: 180 }}
            onChange={(e) => {
              onFormChange({
                field: 'payOrderStatus',
                value: e
              });
            }}
            defaultValue={'2'}
          >
            <Option value={null}></Option>
            <Option value="0">Last 180 days</Option>
            <Option value="1">Last 90 days</Option>
            <Option value="2">Last 60 days</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            addonBefore={<FormattedMessage id="PrescriberID" />}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'prescriberId',
                value: value
              });
            }}
            value={searchForm.get('prescriberId')}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={
              <Select
                // style={{ width: 140 }}
                defaultValue={searchForm.consumerOption}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'consumerOption',
                    value
                  });
                }}
              >
                {this.state.listData.PrescriberName}
                {/*{this.state.listData.PrescriberName.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}*/}
              </Select>
            }
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'prescriberName',
                value
              });
            }}
            value={searchForm.get('prescriberName')}
          />
        </FormItem>

        {/* <br /> */}

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              /*rewardList({
                field: 'search',
                value: '11111111111111111111111122222222222222'
              })*/
              e.preventDefault();
              onSearch();
            }}
          >
            {<FormattedMessage id="search" />}
          </Button>
        </FormItem>
      </Form>
    );
  }
}
