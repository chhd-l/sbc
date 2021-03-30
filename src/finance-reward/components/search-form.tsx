import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;

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
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(sessionStorage.getItem('s2b-supplier@employee'));

      if (employee.roleName.indexOf('Prescriber') !== -1) {
        let prescribers = this.state.listData;
        prescribers.PrescriberList = employee.prescribers;
        this.setState({ listData: prescribers });
      }
    }
  }
  render() {
    const { onFormChange, searchForm, onSearch } = this.props.relaxProps;

    const employeeData = JSON.parse(sessionStorage.getItem('PrescriberSelect'));

    return (
      <Form className="filter-content" layout="inline">
        <Row>
          <Col span="5">
            <FormItem>
              <Select
                getPopupContainer={() => document.getElementById('page-content')}
                style={{ width: 180 }}
                onChange={(e) => {
                  onFormChange({
                    field: 'period',
                    value: e
                  });
                }}
                allowClear
                defaultValue={'60'}
              >
                <Option value={null}></Option>
                <Option value="180">
                  <FormattedMessage id="Finance.LastDays180" />
                </Option>
                <Option value="90">
                  <FormattedMessage id="Finance.LastDays90" />
                </Option>
                <Option value="60">
                  <FormattedMessage id="Finance.LastDays60" />
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="Finance.PrescriberID" />}
                disabled={employeeData ? true : false}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'prescriberId',
                    value: value
                  });
                }}
                value={employeeData ? employeeData.prescriberId : searchForm.get('prescriberId')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="Finance.PrescriberName" />}
                disabled={employeeData ? true : false}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'prescriberName',
                    value: value
                  });
                }}
                value={employeeData ? employeeData.prescriberName : searchForm.get('prescriberName')}
              />
            </FormItem>
          </Col>

          <Col span="3">
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
              >
                <FormattedMessage id="Finance.search" />
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
