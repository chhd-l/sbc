import React, { Component } from 'react';
import { Flow, withPropsAPI } from 'gg-editor';
import { Tabs, message, Row, Col, Button } from 'antd';
import FlowItemPanel from './components/flow-item-panel';
import ItemCommunicationNode from './components/nodes/ItemCommunicationNode';
import ItemEndNode from './components/nodes/ItemEndNode';
import ItemIfElseNode from './components/nodes/ItemIfElseNode';
import ItemOrderNode from './components/nodes/ItemOrderNode';
import ItemTaggingNode from './components/nodes/ItemTaggingNode';
import ItemStartNode from './components/nodes/ItemStartNode';
import ItemTaskNode from './components/nodes/ItemTaskNode';
import ItemVetCheckUpNode from './components/nodes/ItemVetCheckUpNode';
import ItemWaitNode from './components/nodes/ItemWaitNode';
import NodeProperties from './components/node-properties/index';
import { history, Headline } from 'qmkit';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const { TabPane } = Tabs;

export default withPropsAPI(
  class WorkFlow extends Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        flowdata: {
          nodes: [],
          edges: []
        },
        currentItem: null,
        activeKey: 'Builder',
        saveLoading: false
      };
      this.handleNodeDoubleClick = this.handleNodeDoubleClick.bind(this);
      this.saveProperties = this.saveProperties.bind(this);
      this.doSave = this.doSave.bind(this);
    }

    componentDidMount() {
      webapi
        .getAutomationById(this.props.id)
        .then((data) => {
          const res = data.res;
          if (res.code === Const.SUCCESS_CODE) {
            if (res.context.workflow) {
              this.setState({
                flowdata: JSON.parse(res.context.workflow)
              });
            }
          } else {
            message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
          }
        })
        .catch(() => {
          message.error('Get data failed');
        });
    }

    handleNodeDoubleClick(e) {
      if (e.item.model.nodeType === 'End') {
        return;
      }
      this.setState({
        activeKey: 'Item Properties',
        currentItem: e.item
      });
    }

    saveProperties(formData) {
      const { currentItem } = this.state;
      if (currentItem) {
        let tmpParam = { name: formData.name, eventType: null, templateId: null, templateName: null, conditionDataList: null };
        switch (formData.nodeType) {
          case 'TimeTrigger':
            tmpParam = { ...tmpParam, ...formData.startCampaignTime };
            break;
          case 'EventTrigger':
            tmpParam.eventType = formData.eventType;
            break;
          case 'SendEmail':
            tmpParam.templateId = formData.templateId;
            tmpParam.templateName = formData.templateName;
            break;
          case 'Wait':
            tmpParam = { ...tmpParam, ...formData.waitCampaignTime };
            break;
          case 'IfAndElse':
            tmpParam.conditionDataList = formData.conditionDataList;
            break;
          case 'Task':
            tmpParam = { ...tmpParam, ...formData.taskData };
            break;
          case 'Tagging':
            tmpParam = { ...tmpParam, ...formData.taggingData };
            break;
          case 'Order':
            tmpParam = { ...tmpParam, ...formData.orderData };
            break;
          case 'VetCheckUp':
            tmpParam = { ...tmpParam, ...formData.vetData };
            break;
        }
        this.props.propsAPI.update(currentItem, tmpParam);
      }
    }
    doSave() {
      let flowdata = this.props.propsAPI.save();
      this.setState({
        flowdata: flowdata,
        saveLoading: true
      });
      webapi
        .updateAutomationNodes({ workflow: JSON.stringify(flowdata), id: this.props.id, updateWorkflow: true })
        .then((data) => {
          const { res } = data;
          if (res.code === 'K-000000') {
            message.success('Operate successfully');
            this.setState({
              saveLoading: false
            });
            history.push('/automations');
          } else {
            message.error(res.message || 'Update Failed');
            this.setState({
              saveLoading: false
            });
          }
        })
        .catch((err) => {
          message.error(err || 'Update Failed');
          this.setState({
            saveLoading: false
          });
        });
    }
    onAfterChange(e) {
      if (e.action === 'add' && e.item.type === 'edge' && e.item.source.model.nodeType === 'IfAndElse') {
        if (e.item.source._anchorPoints[0].id) {
          e.item.model.lable = 'true';
        } else {
          e.item.model.lable = 'false';
        }
      }
    }
    render() {
      const { flowdata, activeKey, currentItem } = this.state;
      const { name } = this.props;
      return (
        <div>
          <div className="container-search">
            <Row>
              <Col span={12}>
                <Headline title={name} />
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => this.doSave()}>
                  Save
                </Button>
                <Button onClick={() => history.push('/automations')}>Cancel</Button>
              </Col>
            </Row>
          </div>
          <div className="container">
            <div className="demo-chart">
              <div className="demo-chart__container">
                <div className="demo-chart__main">
                  <Flow
                    style={{ height: '720px' }}
                    className="flow"
                    data={flowdata}
                    graphConfig={{ defaultNode: { type: 'customNode' } }}
                    grid={{ cell: 10 }}
                    graph={
                      { edgeDefaultShape: 'flow-polyline-round' } // 连线方式
                    }
                    onNodeDoubleClick={this.handleNodeDoubleClick}
                    noEndEdge={false}
                    onAfterChange={this.onAfterChange}
                  />
                </div>
                <div className="demo-chart__sidebar user-select-none">
                  <Tabs
                    activeKey={activeKey}
                    onChange={(key) => {
                      this.setState({ activeKey: key });
                    }}
                    style={{ width: '100%' }}
                    tabPosition="top"
                    className="tabs-custom"
                  >
                    <TabPane tab="Builder" key="Builder">
                      <FlowItemPanel />
                    </TabPane>
                    {activeKey === 'Item Properties' ? (
                      <TabPane tab="Item Properties" key="Item Properties">
                        <NodeProperties model={currentItem && currentItem.model} saveProperties={this.saveProperties} />
                      </TabPane>
                    ) : null}
                  </Tabs>
                </div>
              </div>
            </div>
            <ItemCommunicationNode />
            <ItemEndNode />
            <ItemIfElseNode />
            <ItemOrderNode />
            <ItemTaggingNode />
            <ItemStartNode />
            <ItemTaskNode />
            <ItemVetCheckUpNode />
            <ItemWaitNode />
          </div>
        </div>
      );
    }
  }
);
