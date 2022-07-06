import React, { Component } from 'react';
import { Form, Row, Col, Input, message } from 'antd';
import ChooseEventForm from './ChooseEventForm';
import ChooseStartTimeForm from './ChooseStartTimeForm';
import ChooseWaitForm from './ChooseWaitForm';
import ChooseIfElseForm from './ChooseIfElseForm';
import ChooseOrderForm from './ChooseOrderForm';
import ChooseTaggingForm from './ChooseTaggingForm';
import ChooseTaskForm from './ChooseTaskForm';
import ChooseTemplateForm from './ChooseTemplateForm';
import * as webapi from '@/automation-workflow/webapi';
import { Const } from 'qmkit';
import ChooseProductForm from './ChooseProductForm';

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
      },
      taggingSource: [],
      goldenMomentList: [],
      templateList: []
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
        conditionDataList, //if-else
        chooseType,
        taggingList,
        abTestType,
        percentageValue,
        aCountValue,
        bCountValue, // Tagging
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
        variableType,
        variableValue, // task
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
          {
            taggingData: {
              chooseType,
              taggingList,
              abTestType,
              percentageValue,
              aCountValue,
              bCountValue
            }
          },
          {
            orderData: {
              between,
              and,
              isOrderStatus,
              orderStatus,
              isBusinessType,
              businessType,
              isChannelType,
              channelType
            }
          },
          { vetData: { days, beforeOrAfter } },
          {
            taskData: {
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
              variableType,
              variableValue
            }
          }
        )
      };
    }

    return null;
  }

  componentDidMount() {
    Promise.all([
      webapi.getAllPetOwnerTaggings(),
      webapi.getGlodenMomentList(),
      webapi.getSendGirdTemplates()
    ])
      .then((data) => {
        const tagignRes = data[0].res;
        const goldenMomentRes = data[1].res;
        const templateRes = data[2].res;
        if (
          tagignRes.code === Const.SUCCESS_CODE &&
          goldenMomentRes.code === Const.SUCCESS_CODE &&
          templateRes.code === Const.SUCCESS_CODE
        ) {
          this.setState({
            taggingSource: tagignRes.context.segmentList,
            goldenMomentList: goldenMomentRes.context.sysDictionaryVOS,
            templateList: templateRes.context.messageTemplateResponseList
              ? templateRes.context.messageTemplateResponseList
              : []
          });
        } else {
          message.error('Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  render() {
    const { model } = this.props;
    const { formParam, taggingSource, goldenMomentList, templateList } = this.state;

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
          {model.nodeType === 'EventTrigger' ? (
            <ChooseEventForm
              nodeId={model.id}
              updateValue={this.updateValue}
              eventType={formParam.eventType}
            />
          ) : null}
          {model.nodeType === 'TimeTrigger' ? (
            <ChooseStartTimeForm
              nodeId={model.id}
              updateValue={this.updateValue}
              startCampaignTime={formParam.startCampaignTime}
            />
          ) : null}
          {model.nodeType === 'Wait' ? (
            <ChooseWaitForm
              nodeId={model.id}
              updateValue={this.updateValue}
              waitCampaignTime={formParam.waitCampaignTime}
            />
          ) : null}
          {model.nodeType === 'IfAndElse' ? (
            <ChooseIfElseForm
              nodeId={model.id}
              updateValue={this.updateValue}
              conditionData={formParam.conditionDataList}
            />
          ) : null}
          {model.nodeType === 'Task' ? (
            <ChooseTaskForm
              nodeId={model.id}
              updateValue={this.updateValue}
              taskData={formParam.taskData}
              goldenMomentList={goldenMomentList}
            />
          ) : null}
          {model.nodeType === 'Tagging' ? (
            <ChooseTaggingForm
              nodeId={model.id}
              updateValue={this.updateValue}
              taggingData={formParam.taggingData}
              taggingSource={taggingSource}
            />
          ) : null}
          {model.nodeType === 'Order' ? (
            <ChooseOrderForm
              nodeId={model.id}
              updateValue={this.updateValue}
              orderData={formParam.orderData}
            />
          ) : null}
          {model.nodeType === 'SendEmail' ? (
            <ChooseTemplateForm
              nodeId={model.id}
              updateValue={this.updateValue}
              templateId={formParam.templateId}
              templateList={templateList}
            />
          ) : null}
          {model.nodeType === 'Products' ? (
            <ChooseProductForm
              nodeId={model.id}
              updateValue={this.updateValue}
              // templateId={formParam.templateId}
              // templateList={templateList}
            />
          ) : null}
        </Form>
      </div>
    );
  }
}
