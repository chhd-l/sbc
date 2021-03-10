import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Tag, Tabs, Descriptions } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import Overview from './components/overview';
import AutomationExecution from './components/automation-execution';
import PetOwnerCommunication from './components/pet-owner-communication';
import AuditLog from './components/audit-log';

const ButtonGroup = Button.Group;
const { TabPane } = Tabs;

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
        communicationChannel: ''
      }
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
            communicationChannel: res.context.communicationChannel
          };
          this.setState({
            loading: false,
            automationDetail
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
    const { automationId } = this.state;
    webapi
      .testAutomation({ id: automationId })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
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

  render() {
    const { loading, title, automationId, automationDetail } = this.state;
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
                  <Popconfirm placement="topLeft" title="This automation (start with time trigger) will be tested immediately." onConfirm={this.testAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={!(automationDetail.automationStatus === 'Draft')}>Test</Button>
                  </Popconfirm>
                  <Popconfirm placement="topLeft" title="This campaign will be terminated." onConfirm={this.terminateAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Terminate' || automationDetail.automationStatus === 'Draft'}>Terminate</Button>
                  </Popconfirm>
                  <Popconfirm placement="topLeft" title="This campaign will be published." onConfirm={this.publishAutomation} okText="Confirm" cancelText="Cancel">
                    <Button disabled={automationDetail.automationStatus === 'Published' || automationDetail.automationStatus === 'Executing'}>Published</Button>
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
                  <Card title={'Workflow'} headStyle={{ padding: 0 }} bordered={false}></Card>
                </TabPane>
                <TabPane tab="Executing & Tracking" key="2">
                  <Card title={'Activity Chart'} headStyle={{ padding: 0 }} bordered={false}>
                    <Overview></Overview>
                  </Card>
                  <AutomationExecution />
                  <PetOwnerCommunication />
                </TabPane>
                <TabPane tab="Audit Log" key="3">
                  <AuditLog />
                </TabPane>
              </Tabs>
            </Card>
          </Spin>
        </div>
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
