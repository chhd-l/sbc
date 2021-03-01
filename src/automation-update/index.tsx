import React, { Component } from 'react';
import GGEditor, { Flow, RegisterEdge } from 'gg-editor';
import { Tabs, Card, Breadcrumb } from 'antd';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import './style.less';
import FlowItemPanel from './components/flow-item-panel';
import ItemCommunicationNode from './components/nodes/ItemCommunicationNode';

const { TabPane } = Tabs;

export default class AutomationUpdate extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: this.props.match.params.id ? 'Edit Automation' : 'Add Automation',
      flowdata: {
        nodes: [],
        edges: []
      }
    };
  }
  render() {
    const { flowdata, title } = this.state;
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
                    // onNodeDoubleClick="handleNodeDoubleClick"
                    // onNodeClick="handleNodeClick"
                    // noEndEdge="false"
                    // onAfterChange="onAfterChange"
                  />
                </div>
                <div className="demo-chart__sidebar user-select-none">
                  <Tabs style={{ width: '100%' }} tabPosition="top" className="tabs-custom">
                    <TabPane tab="Builder" key="Builder">
                      <FlowItemPanel />
                    </TabPane>
                    <TabPane tab="Item Properties" key="Item Properties"></TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
            <ItemCommunicationNode />
          </GGEditor>
        </div>
      </div>
    );
  }
}
