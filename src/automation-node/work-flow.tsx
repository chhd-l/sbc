import React, { Component } from 'react';
import { Flow, withPropsAPI } from 'gg-editor';
import { Tabs, message, Row, Col, Button } from 'antd';
import FlowItemPanel from './components/flow-item-panel';
import ItemCommunicationNode from './components/nodes/ItemCommunicationNode';
import ItemEndNode from './components/nodes/ItemEndNode';
import ItemIfElseNode from './components/nodes/ItemIfElseNode';
import ItemOrderNode from './components/nodes/ItemOrderNode';
import ItemSegmentNode from './components/nodes/ItemSegmentNode';
import ItemStartNode from './components/nodes/ItemStartNode';
import ItemTaskNode from './components/nodes/ItemTaskNode';
import ItemVetCheckUpNode from './components/nodes/ItemVetCheckUpNode';
import ItemWaitNode from './components/nodes/ItemWaitNode';
import NodeProperties from './components/node-properties/index';
import { history, Headline } from 'qmkit';
import * as webapi from './webapi';

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
        saveLoading: false,
        title: 'Automation node'
      };
      this.handleNodeDoubleClick = this.handleNodeDoubleClick.bind(this);
      this.saveProperties = this.saveProperties.bind(this);
      this.doSave = this.doSave.bind(this);
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
        let tmpParam = { name: formData.name };
        switch (formData.nodeType) {
          case 'TimeTrigger':
            tmpParam = { ...tmpParam, ...formData.startCampaignTime };
            break;
          case 'EventTrigger':
            tmpParam.eventType = formData.eventType;
            break;
          case 'SendEmail':
            tmpParam.templateId = formData.templateId;
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
          case 'Segment':
            tmpParam = { ...tmpParam, ...formData.segmentData };
            break;
          case 'Order':
            tmpParam = { ...tmpParam, ...formData.orderData };
            break;
          case 'VetCheckUp':
            tmpParam = { ...tmpParam, ...formData.vetData };
            break;
        }
        console.log(tmpParam);
        this.props.propsAPI.update(currentItem, tmpParam);
      }
    }
    doSave() {
      let flowdata = this.props.propsAPI.save();
      this.setState({
        flowdata: flowdata,
        saveLoading: true
      });
      console.log(flowdata);
      console.log(JSON.stringify(flowdata));
      webapi
        .updateAutomationNodes({ workflow: flowdata, id: this.props.id })
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
    render() {
      const { flowdata, activeKey, currentItem, title } = this.state;
      return (
        <div>
          <div className="container-search">
            <Row>
              <Col span={12}>
                <Headline title={title} />
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
                    style={{ height: '620px' }}
                    className="flow"
                    data={flowdata}
                    graphConfig={{ defaultNode: { type: 'customNode' } }}
                    grid={{ cell: 10 }}
                    graph={
                      { edgeDefaultShape: 'flow-polyline-round' } // 连线方式
                    }
                    onNodeDoubleClick={this.handleNodeDoubleClick}
                    // onNodeClick="handleNodeClick"
                    noEndEdge={false}
                    // onAfterChange="onAfterChange"
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
                    <TabPane tab="Item Properties" key="Item Properties">
                      <NodeProperties model={currentItem && currentItem.model} saveProperties={this.saveProperties} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
            <ItemCommunicationNode />
            <ItemEndNode />
            <ItemIfElseNode />
            <ItemOrderNode />
            <ItemSegmentNode />
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
