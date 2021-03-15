import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
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
      objectNoList: []
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
          const tmpFlow = res.context.workflow ? JSON.parse(res.context.workflow) : {};
          if (tmpFlow.nodes) {
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
    const { automationId, selectedObjectNo } = this.state;
    let params = {
      id: automationId,
      orderEventIds: [],
      orderIds: selectedObjectNo ? [selectedObjectNo] : []
    };
    webapi
      .testAutomation(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getAutomationDetail(automationId);
          message.success(res.message || 'Operation successful');
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
          message.success(res.message || 'Operation successful');
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
          message.success(res.message || 'Operation successful');
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
    });
  };
  handleClose = () => {
    this.setState({
      visibleTest: false,
      startTrigger: '',
      selectedObjectNo: '',
      isEvent: false
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
    const { loading, title, automationId, automationDetail, visibleTest, startTrigger, isOrderEvent, objectFetching, selectedObjectNo, isEvent, objectNoList } = this.state;
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

    return (
      <AuthWrapper functionName="f_automation_detail">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
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
                    Test
                  </Button>

                  <Popconfirm placement="topLeft" title="This campaign will be terminated." onConfirm={this.terminateAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Terminate' || automationDetail.automationStatus === 'Draft'}>Terminate</Button>
                  </Popconfirm>
                  <Popconfirm placement="topLeft" title="This campaign will be published." onConfirm={this.publishAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Published' || automationDetail.automationStatus === 'Executing'}>Publish</Button>
                  </Popconfirm>
                </ButtonGroup>
              }
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab="Basic information" key="1">
                  <Descriptions title={'Automation info'}>
                    <Descriptions.Item label="Automation name" span={1}>
                      {automationDetail.automationName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation status" span={1}>
                      {automationDetail.automationStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label="Test status" span={1}>
                      {automationDetail.testStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation category" span={1}>
                      {automationDetail.automationCategory}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation type" span={1}>
                      {automationDetail.automationType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation goal" span={1}>
                      {automationDetail.automationGoal}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation description" span={3}>
                      {automationDetail.automationDescription}
                    </Descriptions.Item>
                    <Descriptions.Item label="Communication channel" span={1.5}>
                      {automationDetail.communicationChannel}
                    </Descriptions.Item>
                    <Descriptions.Item label="Automation owner" span={1.5}>
                      {automationDetail.automationOwner}
                    </Descriptions.Item>
                    <Descriptions.Item label="Event start time" span={1.5}>
                      {automationDetail.eventStartTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Event end time" span={1.5}>
                      {automationDetail.eventEndTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tracking start time" span={1.5}>
                      {automationDetail.trackingStartTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tracking end time" span={1.5}>
                      {automationDetail.trackingEndTime}
                    </Descriptions.Item>
                  </Descriptions>
                  <Card title={'Workflow'} headStyle={{ padding: 0 }} bordered={false}>
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
                <TabPane tab="Executing & Tracking" key="2">
                  <Card title={'Activity Chart'} headStyle={{ padding: 0 }} bordered={false}>
                    <Overview></Overview>
                  </Card>
                  <AutomationExecution automationId={automationId} />
                  <PetOwnerCommunication automationId={automationId} />
                </TabPane>
                <TabPane tab="Audit Log" key="3">
                  <AuditLog />
                </TabPane>
              </Tabs>
            </Card>
          </Spin>
        </div>
        <Modal
          title={'Test automation'}
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
              Cancle
            </Button>,
            <Button key="submit" onClick={this.testAutomation}>
              Comfirm
            </Button>
          ]}
        >
          {isEvent ? (
            <div>
              <p>
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
                {isOrderEvent ? 'Select Order:' : 'Select Subscription'}
              </label>
              <Select
                showSearch
                placeholder={isOrderEvent ? 'Select a Order No' : 'Select a Subscription No'}
                style={{ minWidth: '200px', marginLeft: '10px' }}
                optionFilterProp="children"
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
