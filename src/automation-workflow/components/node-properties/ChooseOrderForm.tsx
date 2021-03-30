import React, { Component } from 'react';
import { Form, Input, Col, Row, Select, message, InputNumber, Radio, Icon } from 'antd';
import { OrderStatus } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;

export default class ChooseOrderForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        between: 0,
        and: 0,
        isOrderStatus: true,
        orderStatus: []
      },
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(field, value) {
    let data = this.state.form;
    data[field] = value;
    this.setState(
      {
        form: data
      },
      () => this.updateParentValue()
    );
  }

  updateParentValue() {
    const { updateValue } = this.props;
    const { form } = this.state;
    updateValue('orderData', form);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }
  initData(nextProps) {
    if (this.state.nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    const { orderData } = nextProps;
    const { form } = this.state;
    if (orderData.between === undefined) {
      this.setState({
        form: {
          between: 0,
          and: 0,
          isOrderStatus: true,
          orderStatus: []
        }
      });
    } else {
      form.between = orderData.between ? orderData.between : 0;
      form.and = orderData.and ? orderData.and : 0;
      if (orderData.isOrderStatus === false) {
        form.isOrderStatus = orderData.isOrderStatus;
      } else {
        form.isOrderStatus = true;
      }
      form.orderStatus = orderData.orderStatus;
      this.setState({
        form
      });
    }
  }
  render() {
    const { form } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Order creation date is" style={{ lineHeight: 2.8 }}>
          <div>
            <p>
              {' '}
              Between{' '}
              <InputNumber
                onChange={(value) => {
                  this.onChange('between', value);
                }}
                placeholder="Number"
                min={0}
                max={10000}
                value={form.between}
                size="small"
              />{' '}
              Days Ago
            </p>
            <p>
              {' '}
              And <InputNumber placeholder="Number" min={0} max={10000} value={form.and} size="small" /> Days Ago{' '}
            </p>
          </div>
          <Row>
            <Col span={10}>Order Status</Col>
            <Col span={14}>
              <Radio.Group
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onChange('isOrderStatus', value);
                }}
                value={form.isOrderStatus}
              >
                <Radio value={true}>is(are)</Radio>
                <Radio value={false}>is(are) not</Radio>
              </Radio.Group>
            </Col>
            <Col span={24} style={{ margin: '10px 0' }}>
              <Select
                allowClear
                dropdownClassName="normalSelect"
                onChange={(value) => {
                  this.onChange('orderStatus', value);
                }}
                mode="multiple"
                placeholder="Please select order status"
                value={form.orderStatus}
                style={{ width: '100%' }}
              >
                {OrderStatus.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
