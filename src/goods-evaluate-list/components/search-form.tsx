import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker, Row, Col } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <Form className="filter-content" layout="inline">
        <Row>
          <Col span={8}>
            <FormItem label={<FormattedMessage id="orderNumber" />}>
              <Input
                style={{ width: 200 }}
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
          <Col span={8}>
            {/*会员名称、会员账号*/}
            <FormItem>
              <Input
                addonBefore={this._renderCustomerOptionSelect()}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: this.state.customerOptions,
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={<FormattedMessage id="anonymousStatus" />}>
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                style={{ width: 200 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'isAnonymous',
                    value
                  });
                }}
                value={form.get('isAnonymous')}
              >
                <Option value={null}>
                  <FormattedMessage id="all" />
                </Option>
                <Option value="1">
                  <FormattedMessage id="yes" />
                </Option>
                <Option value="0">
                  <FormattedMessage id="no" />
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={<FormattedMessage id="productRatings" />}>
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                style={{ width: 200 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'evaluateScore',
                    value
                  });
                }}
                value={form.get('evaluateScore')}
              >
                <Option value="-1">
                  <FormattedMessage id="all" />
                </Option>
                <Option value="5">
                  5 <FormattedMessage id="star" />
                </Option>
                <Option value="4">
                  4 <FormattedMessage id="star" />
                </Option>
                <Option value="3">
                  3 <FormattedMessage id="star" />
                </Option>
                <Option value="2">
                  2 <FormattedMessage id="star" />
                </Option>
                <Option value="1">
                  1 <FormattedMessage id="star" />
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem style={{ marginTop: 2 }}>
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
                    field: 'beginTime',
                    value: beginTime
                  });
                  onFormChange({
                    field: 'endTime',
                    value: endTime
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
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

        {/*<FormItem>*/}
        {/*  <SelectGroup*/}
        {/*    getPopupContainer={() => document.getElementById('page-content')}*/}
        {/*    label="是否晒单"*/}
        {/*    style={{ width: 80 }}*/}
        {/*    onChange={(value) => {*/}
        {/*      value = value === '' ? null : value;*/}
        {/*      onFormChange({*/}
        {/*        field: 'isUpload',*/}
        {/*        value*/}
        {/*      });*/}
        {/*    }}*/}
        {/*    value={form.get('isUpload')}*/}
        {/*  >*/}
        {/*    <Option value="-1">全部</Option>*/}
        {/*    <Option value="1">是</Option>*/}
        {/*    <Option value="0">否</Option>*/}
        {/*  </SelectGroup>*/}
        {/*</FormItem>*/}

        {/*本迭代未做,暂时注释,留到下个迭代*/}
        {/*<FormItem>
                    <SelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="是否修改"
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
                        <Option value="-1">全部</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </SelectGroup>
                </FormItem>*/}
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
        style={{ width: 150 }}
      >
        <Option value="customerName">
          <FormattedMessage id="consumerName" />
        </Option>
        <Option value="customerAccount">
          <FormattedMessage id="consumerAccount" />
        </Option>
      </Select>
    );
  };
}
