import React, { Component } from 'react';
import { Form, Row, Col, Input, TreeSelect } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';
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
            title: RCi18n({ id: 'task.1stpurchasefororderconfirmation(Club)' }),
            value: '1stPurchaseForOrderConfirmation',
            key: '0-0-1'
          },
          {
            title: RCi18n({ id: 'task.After1stdelivery' }),
            value: 'after1stDelivery',
            key: '0-0-2'
          },
          {
            title: RCi18n({ id: 'task.After4thdelivery' }),
            value: 'After4thDelivery',
            key: '0-0-3'
          },
          { title: 'Promo offer Single Purchase', value: 'PromoOfferSinglePurchase', key: '0-1-4' },
          { title: 'Push subscription', value: 'PushSubscription', key: '0-1-5' }
        ]
      },
      {
        title: 'Subscription',
        value: '0-1',
        key: '0-1',
        selectable: false,
        children: [
          {
            title: RCi18n({ id: 'task.1stmonthofSubscription' }),
            value: '1stMonthOfSubscription',
            key: '0-1-1'
          },
          {
            title: RCi18n({ id: 'task.Half-yearsubscription' }),
            value: 'halfYearSubscription',
            key: '0-1-2'
          },
          {
            title: RCi18n({ id: 'task.1-yearsubscription' }),
            value: '1YearSubscription',
            key: '0-1-3'
          },
          {
            title: RCi18n({ id: 'task.SubscriptionprogramcancelationbyPO' }),
            value: 'SubscriptionProgramCancelationByPO',
            key: '0-1-4'
          },
          {
            title: RCi18n({ id: 'task.Foodtransition(newlife-stage)' }),
            value: 'foodTransition',
            key: '0-1-5'
          },
          {
            title: RCi18n({ id: 'task.3daysbeforenextrefillorder' }),
            value: '3DaysBeforeNextRefillOrder',
            key: '0-1-6'
          },
          { title: 'Create pet profile', value: 'createPetProfile', key: '0-1-7' },
          {
            title: RCi18n({ id: 'task.SterilizationTimeOnlyKitten' }),
            value: 'SterilizationTime',
            key: '0-1-8'
          },
          { title: 'Promo offer Unsubscription', value: 'PromoOfferUnsubscription', key: '0-1-9' },
          {
            title: 'Reminder restart subscription',
            value: 'ReminderRestartSubscription',
            key: '0-1-10'
          }
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
      {
        title: 'Cart',
        value: '0-3',
        key: '0-3',
        selectable: false,
        children: [
          {
            title: 'Abandoned Cart Club One',
            value: 'AbandonedCartClubOne',
            key: '0-3-1'
          },
          {
            title: 'Abandoned Cart Club More',
            value: 'AbandonedCartClubMore',
            key: '0-3-2'
          },
          {
            title: 'Abandoned Cart SP One',
            value: 'AbandonedCartSPOne',
            key: '0-3-3'
          },
          {
            title: 'Abandoned Cart SP More',
            value: 'AbandonedCartSPMore',
            key: '0-3-4'
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
