import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Tag, Tabs, Descriptions, Empty, Modal } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import Overview from './components/overview';
import AutomationExecution from './components/automation-execution';
import PetOwnerCommunication from './components/pet-owner-communication';
import AuditLog from './components/audit-log';
import GGEditor, { Flow, Minimap } from 'gg-editor';
import ItemCommunicationNode from '@/automation-workflow/components/nodes/ItemCommunicationNode';
import ItemEndNode from '@/automation-workflow/components/nodes/ItemEndNode';
import ItemIfElseNode from '@/automation-workflow/components/nodes/ItemIfElseNode';
import ItemOrderNode from '@/automation-workflow/components/nodes/ItemOrderNode';
import ItemSegmentNode from '@/automation-workflow/components/nodes/ItemTaggingNode';
import ItemStartNode from '@/automation-workflow/components/nodes/ItemStartNode';
import ItemTaskNode from '@/automation-workflow/components/nodes/ItemTaskNode';
import ItemVetCheckUpNode from '@/automation-workflow/components/nodes/ItemVetCheckUpNode';
import ItemWaitNode from '@/automation-workflow/components/nodes/ItemWaitNode';
import _ from 'lodash';
import moment from 'moment';

const ButtonGroup = Button.Group;
const { TabPane } = Tabs;
const Option = Select.Option;

const subscriptionEventArr = [
  { title: '1st month of Subscription', value: '1stMonthOfSubscription', key: '0-0-2' },
  { title: 'Half-year subscription', value: 'halfYearSubscription', key: '0-0-3' },
  { title: '1-year subscription', value: '1YearSubscription', key: '0-0-4' },
  { title: 'Subscription program cancelation by PO', value: 'SubscriptionProgramCancelationByPO', key: '0-0-7' },
  { title: 'Food transition (new life-stage)', value: 'foodTransition', key: '0-0-8' },
  { title: '3 days before next refill order', value: '3DaysBeforeNextRefillOrder', key: '0-0-9' }
];
const orderEventArr = [
  {
    title: '1st purchase for order confirmation (Club)',
    value: '1stPurchaseForOrderConfirmation',
    key: '0-0-1'
  },
  { title: 'After 1st delivery', value: 'after1stDelivery', key: '0-0-5' },
  { title: 'After 4th delivery', value: 'After4thDelivery', key: '0-0-6' }
];

class AutomationDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      automationId: this.props.match.params.id ? this.props.match.params.id : '',
      title: 'Automation Detail',
      loading: false,
      automationDetail: {
        automationName: '',
        automationStatus: '',
        testStatus: '',
        automationType: '',
        automationGoal: '',
        automationDescription: '',
        automationOwner: '',
        eventStartTime: '',
        eventEndTime: '',
        trackingStartTime: '',
        trackingEndTime: '',
        communicationChannel: '',
        workflow: null
      },
      visibleTest: false,
      startTrigger: '',
      selectedObjectNo: '',
      isEvent: false,
      isOrderEvent: false,
      objectFetching: false,
      objectNoList: [],
      showTestTip:false
    };
  }
  componentDidMount() {
    this.getAutomationDetail(this.props.match.params.id);
  }
  init = () => {};

  getAutomationDetail = (id) => {
    webapi
      .getAutomationById(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let isEvent = false;
          const tmpFlow = res.context.workflow ? JSON.parse(res.context.workflow) : null;
          if (tmpFlow && tmpFlow.nodes) {
            let timeTriggerNodes = tmpFlow.nodes.find((x) => x.nodeType === 'TimeTrigger');
            let eventTriggerNodes = tmpFlow.nodes.find((x) => x.nodeType === 'EventTrigger');
            if (timeTriggerNodes) {
              isEvent = false;
            } else if (eventTriggerNodes) {
              isEvent = true;
            }
          }

          let automationDetail = {
            automationName: res.context.name,
            automationStatus: res.context.status,
            automationCategory: res.context.category,
            testStatus: res.context.testStatus,
            automationDescription: res.context.description,
            automationType: res.context.type,
            automationGoal: res.context.goal,
            eventStartTime: res.context.eventStartTime,
            eventEndTime: res.context.eventEndTime,
            trackingStartTime: res.context.trackingStartTime,
            trackingEndTime: res.context.trackingEndTime,
            communicationChannel: res.context.communicationChannel,
            workflow: tmpFlow
          };

          this.setState({
            loading: false,
            automationDetail,
            isEvent
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  testAutomation = () => {
    const { automationId, selectedObjectNo, isOrderEvent,isEvent } = this.state;
    if(isEvent && !selectedObjectNo){
      this.setState({
        showTestTip:true
      })
      return false
    }
    else{
      this.setState({
        showTestTip:false
      })
    }
    let params = {
      id: automationId,
      type: isOrderEvent ? 'Order' : 'Subscription',
      objectId: selectedObjectNo ? selectedObjectNo : ''
    };
    webapi
      .testAutomation(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visibleTest: false
          });
          this.getAutomationDetail(automationId);
          message.success(res.message || <FormattedMessage id="Marketing.OperationSuccessful" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  terminateAutomation = () => {
    const { automationId } = this.state;
    webapi
      .terminateAutomation({ id: automationId })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getAutomationDetail(automationId);
          message.success(res.message || <FormattedMessage id="Marketing.OperationSuccessful" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  publishAutomation = () => {
    const { automationId } = this.state;
    webapi
      .publishAutomation({ id: automationId })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getAutomationDetail(automationId);
          message.success(res.message || <FormattedMessage id="Marketing.OperationSuccessful" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  openTestModal = () => {
    const { isEvent, automationDetail } = this.state;
    let startTrigger = '';
    let isOrderEvent = false;
    if (isEvent) {
      const tempArr = automationDetail.workflow && automationDetail.workflow.nodes && automationDetail.workflow.nodes.filter((item) => item.nodeType === 'EventTrigger');
      if (tempArr[0].eventType) {
        startTrigger = tempArr[0].eventType;

        let OrderEvent = orderEventArr.find((item) => item.value === startTrigger);
        if (OrderEvent) {
          isOrderEvent = true;
        } else {
          isOrderEvent = false;
        }
      }
    }
    this.setState({
      visibleTest: true,
      startTrigger: startTrigger,
      selectedObjectNo: '',
      isOrderEvent: isOrderEvent
    },()=>{
      this.getObjectNoList('')
    });
  };
  handleClose = () => {
    this.setState({
      visibleTest: false,
      showTestTip:false,
      startTrigger: '',
      selectedObjectNo: ''
    });
  };

  getObjectNoList = (value) => {
    const { isOrderEvent } = this.state;
    this.setState({
      objectFetching: true
    });
    if (isOrderEvent) {
      let params = {
        id: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getOrderList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            objectNoList: res.context.content,
            objectFetching: false
          });
        }
      });
    } else {
      let params = {
        subscribeId: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getSubscriptionList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            objectNoList: res.context.subscriptionResponses,
            objectFetching: false
          });
        }
      });
    }
  };

  render() {
    const { loading, title, automationId, automationDetail, visibleTest, startTrigger, isOrderEvent, objectFetching, selectedObjectNo, isEvent, objectNoList,showTestTip } = this.state;
    const testStatusList = [
      { name: 'Not Tested', value: 'NotTested' },
      { name: 'Testing', value: 'Testing' },
      { name: 'Tested', value: 'Tested' }
    ];
    const cardTitle = (
      <div>
        <span style={{ marginRight: 10 }}>{automationDetail.automationName}</span>
        {automationDetail.automationStatus === 'Draft' ? <Tag color="#A6A6A6">{automationDetail.automationStatus}</Tag> : null}
        {automationDetail.automationStatus === 'Published' ? <Tag color="#00B0F0">{automationDetail.automationStatus}</Tag> : null}
        {automationDetail.automationStatus === 'Executing' ? <Tag color="#92D050">{automationDetail.automationStatus}</Tag> : null}
        {automationDetail.automationStatus === 'Completed' ? <Tag color="#333F50">{automationDetail.automationStatus}</Tag> : null}
        {automationDetail.automationStatus === 'Terminated' ? <Tag color="#EF1C33">{automationDetail.automationStatus}</Tag> : null}
        {automationDetail.testStatus === 'NotTested' ? <Tag color="#A6A6A6">{testStatusList.find((item) => item.value === automationDetail.testStatus).name}</Tag> : null}
        {automationDetail.testStatus === 'Tested' ? <Tag color="#92D050">{testStatusList.find((item) => item.value === automationDetail.testStatus).name}</Tag> : null}
        {automationDetail.testStatus === 'Testing' ? <Tag color="#00B0F0">{testStatusList.find((item) => item.value === automationDetail.testStatus).name}</Tag> : null}
      </div>
    );
    const testStautsObject = testStatusList.find(x=>x.value === automationDetail.testStatus)

    return (
      <AuthWrapper functionName="f_automation_detail">
        <div>
          <Spin spinning={loading}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>

            <Card
              title={cardTitle}
              bordered={false}
              bodyStyle={{ paddingBottom: 0 }}
              style={{ margin: 12 }}
              extra={
                <ButtonGroup>
                  <Button disabled={!(automationDetail.automationStatus === 'Draft')} onClick={this.openTestModal}>
                    <FormattedMessage id="Marketing.Test" />
                  </Button>
                  <Popconfirm placement="topLeft" title={<FormattedMessage id="Marketing.ThisCampaignWillBeTerminated" />} onConfirm={this.terminateAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Terminated' || automationDetail.automationStatus === 'Draft'}>Terminate</Button>
                  </Popconfirm>
                  <Popconfirm placement="topLeft" title={<FormattedMessage id="Marketing.ThisCampaignWillBePublished" />} onConfirm={this.publishAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Published' || automationDetail.automationStatus === 'Executing'}>Publish</Button>
                  </Popconfirm>
                </ButtonGroup>
              }
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab={<FormattedMessage id="Marketing.BasicInformation" />} key="1">
                  <Descriptions title={<FormattedMessage id="Marketing.AutomationInformation" />}>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationName" />} span={1}>
                      {automationDetail.automationName}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationStatus" />} span={1}>
                      {automationDetail.automationStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.TestStatus" />} span={1}>
                      {testStautsObject ? testStautsObject.name : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationCategory" />} span={1}>
                      {automationDetail.automationCategory}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationType" />} span={1}>
                      {automationDetail.automationType}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationGoal" />} span={1}>
                      {automationDetail.automationGoal}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationDescription" />} span={3}>
                      {automationDetail.automationDescription}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.CommunicationChannel" />} span={1.5}>
                      {automationDetail.communicationChannel}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.AutomationOwner" />} span={1.5}>
                      {automationDetail.automationOwner}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.EventStartTime" />} span={1.5}>
                      {automationDetail.eventStartTime ? moment(automationDetail.eventStartTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.EventEndTime" />} span={1.5}>
                      {automationDetail.eventEndTime ? moment(automationDetail.eventEndTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.TrackingStartTime" />} span={1.5}>
                      {automationDetail.trackingStartTime ? moment(automationDetail.trackingStartTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id="Marketing.TrackingEndTime" />} span={1.5}>
                      {automationDetail.trackingEndTime ? moment(automationDetail.trackingEndTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                  </Descriptions>
                  <Card title={<FormattedMessage id="Marketing.Workflow" />} headStyle={{ padding: 0, fontWeight: 'bold' }} bordered={false}>
                    {this.state.automationDetail.workflow ? (
                      <GGEditor>
                        <Flow
                          graph={
                            { edgeDefaultShape: 'flow-polyline-round' } // 连线方式
                          }
                          style={{ height: '600px', display: 'none' }}
                          data={this.state.automationDetail.workflow}
                        />
                        <Row type="flex" justify="center">
                          <Minimap width={300} height={300} />
                        </Row>
                        <ItemCommunicationNode />
                        <ItemEndNode />
                        <ItemIfElseNode />
                        <ItemOrderNode />
                        <ItemSegmentNode />
                        <ItemStartNode />
                        <ItemTaskNode />
                        <ItemVetCheckUpNode />
                        <ItemWaitNode />
                      </GGEditor>
                    ) : (
                      <Empty />
                    )}
                  </Card>
                </TabPane>
                <TabPane tab={<FormattedMessage id="Marketing.ExecutingTracking" />} key="2">
                  <Card title={<FormattedMessage id="Marketing.ActivityChart" />} headStyle={{ padding: 0 }} bordered={false}>
                    <Overview automationId={automationId}></Overview>
                  </Card>
                  <AutomationExecution automationId={automationId} />
                  <PetOwnerCommunication automationId={automationId} />
                </TabPane>
                <TabPane tab={<FormattedMessage id="Marketing.AuditLog" />} key="3">
                  <AuditLog automationId={automationId} />
                </TabPane>
              </Tabs>
            </Card>
          </Spin>
        </div>
        <Modal
          title={<FormattedMessage id="Marketing.TestAutomation" />}
          maskClosable={false}
          width={600}
          visible={visibleTest}
          onCancel={() => this.handleClose()}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.handleClose();
              }}
            >
              {<FormattedMessage id="cancel" />}
            </Button>,
            <Button key="submit" type="primary" onClick={this.testAutomation}>
              {<FormattedMessage id="Marketing.Comfirm" />}
            </Button>
          ]}
        >
          {isEvent ? (
            <div>
              <p style={{ marginBottom: 10 }}>
                Start Trigger: <span style={{ marginLeft: 10, color: '#a6a6a6' }}>{startTrigger}</span>
              </p>
              <span
                style={{
                  color: 'red',
                  fontFamily: 'SimSun',
                  marginRight: '4px',
                  fontSize: '12px'
                }}
              >
                *
              </span>
              <label
                style={{
                  minWidth: '200px',
                  marginRight: '10px',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                {isOrderEvent ? <FormattedMessage id="Marketing.SelectOrder" /> : <FormattedMessage id="Marketing.SelectSubscription" />}
              </label>
              <Select
                showSearch
                placeholder={isOrderEvent ? <FormattedMessage id="Marketing.SelectAOrderNo" /> : <FormattedMessage id="Marketing.SelectASubscriptionNo" />}
                style={{ minWidth: '300px', marginLeft: 10, marginBottom: 10 }}
                optionFilterProp="children"
                value={selectedObjectNo}
                getPopupContainer={(trigger: any) => trigger.parentNode}
                onChange={(value) => {
                  this.setState({
                    selectedObjectNo: value
                  });
                }}
                onSearch={_.debounce(this.getObjectNoList, 500)}
                notFoundContent={objectFetching ? <Spin size="small" /> : null}
                filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {objectNoList &&
                  objectNoList.map((item, index) => (
                    <Option value={isOrderEvent ? item.id : item.subscribeId} key={index}>
                      {isOrderEvent ? item.id : item.subscribeId}
                    </Option>
                  ))}
              </Select>
              {
                showTestTip?<p style={{marginLeft: '125px',marginTop:'-10px',color:'#e2001a'}}>
                  {isOrderEvent ? <FormattedMessage id="Marketing.PleaseSelectOrder" /> : <FormattedMessage id="Marketing.PleaseSelectSubscription" />}</p>:null
              }
              
            </div>
          ) : null}
          <p style={{ display: 'inline-block', color: '#a6a6a6' }}>This automation (start with time trigger) will be tested immediately.</p>
        </Modal>
        <div className="bar-button">
          <Button type="primary" disabled={automationDetail.automationStatus === 'Published' || automationDetail.automationStatus === 'Executing'}>
            <Link to={`/automation-edit/${automationId}`}>{<FormattedMessage id="edit" />}</Link>
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationDetail);
