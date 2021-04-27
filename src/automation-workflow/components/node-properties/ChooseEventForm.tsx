import React, { Component } from 'react';
import { Form, Row, Col, Input, TreeSelect } from 'antd';

const FormItem = Form.Item;

export default class ChooseEventForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      eventType: undefined,
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
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
    this.setState({
      eventType: nextProps.eventType
    });
  }

  onChange(value) {
    const { updateValue } = this.props;
    this.setState({ eventType: value });
    updateValue('eventType', value);
  }
  render() {
    const { eventType } = this.state;
    const treeData = [
      {
        title: 'Order',
        value: '0-0',
        key: '0-0',
        selectable: false,
        children: [
          {
            title: '1st purchase for order confirmation (Club)',
            value: '1stPurchaseForOrderConfirmation',
            key: '0-0-1'
          },
          { title: 'After 1st delivery', value: 'after1stDelivery', key: '0-0-2' },
          { title: 'After 4th delivery', value: 'After4thDelivery', key: '0-0-3' }
        ]
      },
      {
        title: 'Subscription',
        value: '0-1',
        key: '0-1',
        selectable: false,
        children: [
          { title: '1st month of Subscription', value: '1stMonthOfSubscription', key: '0-1-1' },
          { title: 'Half-year subscription', value: 'halfYearSubscription', key: '0-1-2' },
          { title: '1-year subscription', value: '1YearSubscription', key: '0-1-3' },
          { title: 'Subscription program cancelation by PO', value: 'SubscriptionProgramCancelationByPO', key: '0-1-4' },
          { title: 'Food transition (new life-stage)', value: 'foodTransition', key: '0-1-5' },
          { title: '3 days before next refill order', value: '3DaysBeforeNextRefillOrder', key: '0-1-6' },
          { title: 'Create pet profile', value: 'createPetProfile', key: '0-1-7' }
        ]
      },
      {
        title: 'Goods',
        value: '0-2',
        key: '0-2',
        selectable: false,
        children: [
          {
            title: 'Inventory warning',
            value: 'inventoryWarning',
            key: '0-2-1'
          }
        ]
      },

    ];
    return (
      <FormItem label="Choose an event" colon={false}>
        <TreeSelect
          value={eventType ? eventType : undefined}
          placeholder="Please select a event"
          onChange={this.onChange}
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
          treeData={treeData}
          treeDefaultExpandAll
          showSearch
          allowClear
          searchPlaceholder="Search"
        ></TreeSelect>
      </FormItem>
    );
  }
}
