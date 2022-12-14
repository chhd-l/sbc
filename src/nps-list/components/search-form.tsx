import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker, Row, Col } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const customerTypeArr = [
  {
    value: 'Member',
    name: 'Member',
    id: 234
  },
  {
    value: 'Guest',
    name: 'Guest',
    id: 233
  }
];
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      onSelectOptionChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    onSelectOptionChange: noop,
    form: 'form'
  };

  constructor(props) {
    super(props);
    this.state = {
      customerOptions: 'customerName'
    };
  }

  render() {
    const { onFormChange, onSearch, form } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <Row id="input-lable-wwidth">
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={
                  <p>
                    <FormattedMessage id="orderNumber" />
                  </p>
                }
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'orderNo',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={
                  <p>
                    <FormattedMessage id="consumerName" />
                  </p>
                }
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'customerName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                defaultValue=""
                label={<FormattedMessage id="consumerType" />}
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'consumerType',
                    value
                  });
                }}
              >
                <Option value="">All</Option>
                {customerTypeArr.map((item) => (
                  <Option value={item.value} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup  
                defaultValue=""
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={<FormattedMessage id="ratingWithComment" />}
                style={{ minWidth: 80 }}
               
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'commentStatus',
                    value
                  });
                }}
              >
                <Option value="">All</Option>
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                defaultValue=""
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={<FormattedMessage id="rating" />}

                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'goodsScore',
                    value
                  });
                }}
              // value={form.get('goodsScore')}
              >
                <Option value="">All</Option>
                <Option value="5">5 star</Option>
                <Option value="4">4 star</Option>
                <Option value="3">3 star</Option>
                <Option value="2">2 star</Option>
                <Option value="1">1 star</Option>
              </SelectGroup>
            </FormItem>
            {/*???????????????,????????????,??????????????????*/}
            {/*<FormItem>
                    <SelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="????????????"
                        style={{width: 80}}
                        onChange={value => {
                            value = value === '' ? null : value;
                            onFormChange({
                                field: 'isEdit',
                                value
                            });
                        }}
                        value={form.get('isEdit')}
                    >
                        <Option value="-1">??????</Option>
                        <Option value="1">???</Option>
                        <Option value="0">???</Option>
                    </SelectGroup>
                </FormItem>*/}
          </Col>
          <Col span="8" id="Range-picker-width-zuixiao">
            <FormItem>
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = null;
                  let endTime = null;
                  if (e.length > 0) {
                    beginTime = e[0].format(Const.DAY_FORMAT);
                    endTime = e[1].format(Const.DAY_FORMAT);
                  }
                  onFormChange({
                    field: 'createTimeBegin',
                    value: beginTime + ' 00:00:00'
                  });
                  onFormChange({
                    field: 'createTimeEnd',
                    value: endTime + ' 23:59:59'
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="24" style={{ textAlign: 'center' }}>
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

  _renderCustomerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.props.relaxProps.onSelectOptionChange(
            this.state.customerOptions,
            val
          );
          this.setState({
            customerOptions: val
          });
        }}
        value={this.state.customerOptions}
        style={{ width: 100 }}
      >
        <Option value="customerName">????????????</Option>
        <Option value="customerAccount">????????????</Option>
      </Select>
    );
  };
}
