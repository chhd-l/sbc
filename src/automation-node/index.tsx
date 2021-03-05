import React, { Component } from 'react';
import GGEditor, { Flow, RegisterEdge } from 'gg-editor';
import { Tabs, Card, Breadcrumb } from 'antd';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import './style.less';
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

import { withPropsAPI } from 'gg-editor';

const { TabPane } = Tabs;

class AutomationNode extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Automation node',
      flowdata: {
        nodes: [],
        edges: []
      },
      currentItem: null,
      activeKey: 'Builder'
    };
    this.handleNodeDoubleClick = this.handleNodeDoubleClick.bind(this);
    this.saveProperties = this.saveProperties.bind(this);
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
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    debugger

    const { currentItem } = this.state;
    if (currentItem) {
      var tmpParam = { name: formData.name };
      switch (formData.nodeType) {
        case 'TimeTrigger':
          tmpParam = { ...tmpParam, ...formData.startCampaignTime };
          break;
        case 'EventTrigger':
          tmpParam.eventType = formData.eventType;
          break;
        case 'SendEmail':
        case 'SendSMS':
        case 'SendMMS':
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
      debugger
      this.props.propsAPI.update(currentItem, tmpParam);
    }
  }
  render() {
    const { flowdata, title, activeKey, currentItem } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container">
          <GGEditor>
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
                      <NodeProperties model={currentItem && currentItem.model} saveProperties={this.saveProperties}/>
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
          </GGEditor>
        </div>
      </div>
    );
  }
}

export default withPropsAPI(AutomationNode);
