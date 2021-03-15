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
            title: 'First Club Order Created',
            value: 'FirstClubOrderCreated',
            key: '0-0-1'
          },
          {
            title: 'First Club Order Delivery Confirmed',
            value: 'FirstClubOrderDeliveryConfirmed',
            key: '0-0-2'
          },
          {
            title: 'First Club Order Shipped',
            value: 'firstClubOrderShipped',
            key: '0-0-15'
          },
          {
            title: 'New Refill Order Created',
            value: 'NewRefillOrderCreated',
            key: '0-0-3'
          },
          {
            title: 'New Refill Order Delivery Confirmed',
            value: 'NewRefillOrderDeliveryConfirmed',
            key: '0-0-4'
          },
          {
            title: 'New Refill Order Shipped',
            value: 'newRefillOrderShipped',
            key: '0-0-16'
          },
          {
            title: 'Order Created',
            value: 'orderCreated',
            key: '0-0-5'
          },
          {
            title: 'Order Confirmed',
            value: 'orderConfirmed',
            key: '0-0-6'
          },
          {
            title: 'Order Canceled',
            value: 'orderCanceled',
            key: '0-0-7'
          },
          {
            title: 'Order Paid',
            value: 'orderPaid',
            key: '0-0-8'
          },
          {
            title: 'Order Shipped',
            value: 'orderShipped',
            key: '0-0-9'
          },
          {
            title: 'Delivery Confirmed',
            value: 'deliveryConfirmed',
            key: '0-0-10'
          },
          {
            title: 'Order Completed',
            value: 'orderCompleted',
            key: '0-0-12'
          },
          {
            title: 'Order Replaced',
            value: 'orderReplaced',
            key: '0-0-13'
          },
          {
            title: 'Order Failed',
            value: 'orderFailed',
            key: '0-0-14'
          },
          {
            title: 'Order Shipment Date Change',
            value: 'orderShipmentDateChange',
            key: '0-0-17'
          },
          {
            title: 'Order Skipped',
            value: 'orderSkipped',
            key: '0-0-18'
          }
        ]
      },
      {
        title: 'Contact',
        value: '0-1',
        key: '0-1',
        selectable: false,
        children: [
          {
            title: 'Pet Owner Created',
            value: 'contactCreated',
            key: '0-1-1'
          },
          {
            title: 'Pet Owner Deleted',
            value: 'contactDeleted',
            key: '0-1-2'
          }
        ]
      },
      {
        title: 'Pet',
        value: '0-2',
        key: '0-2',
        selectable: false,
        children: [
          {
            title: 'Pet Created',
            value: 'petCreated',
            key: '0-2-1'
          },
          {
            title: 'Pet Deleted',
            value: 'petDeleted',
            key: '0-2-2'
          },
          {
            title: 'Pet Sterilized',
            value: 'petSterilized',
            key: '0-2-3'
          }
        ]
      },
      {
        title: 'Subscription',
        value: '0-3',
        key: '0-3',
        selectable: false,
        children: [
          {
            title: 'Subscription Cancelation',
            value: 'subscriptionCancelation',
            key: '0-3-1'
          },
          {
            title: 'First Month Of Subscription',
            value: 'firstMonthOfSubscription',
            key: '0-3-2'
          },
          {
            title: 'Half Year Of Subscription',
            value: 'halfYearOfSubscription',
            key: '0-3-3'
          }
        ]
      }
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
