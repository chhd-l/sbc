import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';
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
        prescriberId: '',
        PrescriberName: '',
        PrescriberList: []
      }
    };
  }
  componentDidMount() {
    console.log(JSON.parse(sessionStorage.getItem('PrescriberType')), 22122);
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(
        sessionStorage.getItem('s2b-supplier@employee')
      );

      if (employee.roleName.indexOf('Prescriber') !== -1) {
        let prescribers = this.state.listData;
        prescribers.PrescriberList = employee.prescribers;
        this.setState({ listData: prescribers });
      } else {
        //this.onSearch();
      }
    }
  }
  onFormChange = ({ field, value }) => {
    /*let data = this.state.listData.PrescriberName;
    data[field] = value;
    this.setState({
      PrescriberName: data
    });*/
  };
  render() {
    const {
      onFormChange,
      searchForm,
      onSearch,
      rewardList
    } = this.props.relaxProps;
    {
      console.log(sessionStorage.getItem('s2b-employee@data'));
    }
    return (
      <Form className="filter-content" layout="inline">
        <Row>
          <Col span="4" style={{ marginTop: '3px' }}>
            <FormItem>
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
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
          </Col>
          <Col span="7">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="PrescriberID" />}
                disabled={
                  JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                    .clinicsIds != null
                    ? true
                    : null
                }
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'prescriberId',
                    value: value
                  });
                }}
                value={
                  JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                    .clinicsIds != null
                    ? JSON.parse(sessionStorage.getItem('PrescriberType')).value
                    : searchForm.get('prescriberId')
                }
              />
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="prescriberName" />}
                disabled={
                  JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                    .clinicsIds != null
                    ? true
                    : null
                }
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'prescriberName',
                    value: value
                  });
                }}
                value={
                  JSON.parse(sessionStorage.getItem('s2b-employee@data'))
                    .clinicsIds != null
                    ? JSON.parse(sessionStorage.getItem('PrescriberType'))
                        .children
                    : searchForm.get('prescriberName')
                }
              />
            </FormItem>
          </Col>
          {/*<FormItem>
          <SelectGroup
            defaultValue=""
            label="Prescriber name"
            onChange={(e) => {
              onFormChange({
                field: 'prescriberName',
                value: e
              });
            }}
          >
            <Option value="">
              <FormattedMessage id="all" />
            </Option>
            {this.state.listData.PrescriberList.map((item) => (
              <Option value={item.prescriberName} key={item}>
                {item.prescriberName}
              </Option>
            ))}
          </SelectGroup>
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
                style={{width:100}}
              >
                {this.state.listData.PrescriberList.map((item) => (
                  <Option value={item.prescriberName} key={item}>
                    {item.prescriberName}
                  </Option>
                ))}
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
        </FormItem>*/}

          {/* <br /> */}
          <Col span="6">
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  /*rewardList({
                field: 'search',
                value: '11111111111111111111111122222222222222'
              })*/
                  e.preventDefault();
                  onSearch();
                }}
              >
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
}
