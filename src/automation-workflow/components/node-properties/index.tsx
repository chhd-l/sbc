import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import ChooseEventForm from './ChooseEventForm';
import ChooseStartTimeForm from './ChooseStartTimeForm';
import ChooseWaitForm from './ChooseWaitForm';

const FormItem = Form.Item;

export default class NodeProperties extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      formParam: {
        id: '',
        name: '',
        eventType: undefined,
        startCampaignTime: null,
        templateId: '',
        waitCampaignTime: null
      }
    };
    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(type, value) {
    let data = this.state.formParam;
    data[type] = value;
    this.setState(
      {
        formParam: data
      },
      () => this.props.saveProperties(this.state.formParam)
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      model: {
        id,
        name,
        timeType,
        time,
        recurrenceType,
        recurrenceValue, // Start
        atSpecialTime,
        specialTime,
        timeAmountValue,
        timeAmountType, // Wait
        conditionDataList,
        chooseType,
        segmentList,
        abTestType,
        percentageValue,
        aCountValue,
        bCountValue, // Segment
        between,
        and,
        isOrderStatus,
        orderStatus,
        isBusinessType,
        businessType,
        isChannelType,
        channelType, // order
        days,
        beforeOrAfter,
        taskName,
        assistantId,
        assistantName,
        goldenMoment,
        contactPlan,
        priority,
        actionType,
        startTime,
        dueTimeNumber,
        dueTimeType,
        reminderNumber,
        reminderType,
        ...otherParam
      }
    } = nextProps;

    if (id !== prevState.formParam.id) {
      return {
        formParam: Object.assign(
          { name: name },
          { id: id },
          otherParam,
          { startCampaignTime: { timeType, time, recurrenceType, recurrenceValue } },
          { waitCampaignTime: { atSpecialTime, specialTime, timeAmountValue, timeAmountType } },
          { conditionDataList: conditionDataList },
          { segmentData: { chooseType, segmentList, abTestType, percentageValue, aCountValue, bCountValue } },
          { orderData: { between, and, isOrderStatus, orderStatus, isBusinessType, businessType, isChannelType, channelType } },
          { vetData: { days, beforeOrAfter } },
          { taskData: { taskName, assistantId, assistantName, goldenMoment, contactPlan, priority, actionType, startTime, dueTimeNumber, dueTimeType, reminderNumber, reminderType } }
        )
      };
    }

    return null;
  }

  render() {
    const { model } = this.props;
    const { formParam } = this.state;
    console.log(model);
    console.log(formParam);
    return (
      <div>
        <Form className="ui-form-custom">
          <FormItem label="Item Name" colon={false}>
            <Input
              placeholder="Item Name"
              value={formParam.name}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.updateValue('name', value);
              }}
            />
          </FormItem>
          {model.nodeType === 'EventTrigger' ? <ChooseEventForm updateValue={this.updateValue} eventType={formParam.eventType} /> : null}
          {model.nodeType === 'TimeTrigger' ? <ChooseStartTimeForm updateValue={this.updateValue} startCampaignTime={formParam.startCampaignTime} /> : null}
          {model.nodeType === 'Wait' ? <ChooseWaitForm updateValue={this.updateValue} startCampaignTime={formParam.waitCampaignTime} /> : null}
        </Form>
      </div>
    );
  }
}
