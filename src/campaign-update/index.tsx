import React, { Component } from 'react';
import GGEditor, { Flow, RegisterEdge } from 'gg-editor';
import { Tabs } from 'antd';
import './style.less'
import FlowItemPanel from './components/flow-item-panel' 
import ItemCommunicationNode from './components/nodes/ItemCommunicationNode'

const { TabPane } = Tabs;

export default class CampaignUpdate extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      flowdata: {
        nodes: [],
        edges: []
      }
    };
  }
  render() {
    const { flowdata } = this.state;
    const gird = {
      cell:20,
      type:'line',
      line:{
        color:'#f7f7f7',
        fill:'#f7f7f7',
        stroke: '#f7f7f7',
        lineWidth: 0.1
      }
}
    return (
      <div className="container-search">
        <GGEditor>
          <div className="demo-chart">
            <div className="demo-chart__container">
              <div className="demo-chart__main">
                <Flow
                  style={{ height: '600px' }}
                  className='flow'
                  data={flowdata}
                  // onNodeDoubleClick="handleNodeDoubleClick"
                  // onNodeClick="handleNodeClick"
                  // noEndEdge="false"
                  // onAfterChange="onAfterChange"
                />
              </div>
              <div className="demo-chart__sidebar user-select-none">
              <Tabs
                style={{width: '100%'}}
                tabPosition="top"
                className="tabs-custom"
              >
                <TabPane tab="Builder" key="Builder">
                  <FlowItemPanel />
                </TabPane>
                <TabPane
                  tab="Item Properties"
                  key="Item Properties"
                >
                </TabPane>
              </Tabs>
              </div>
            </div>
          </div>
          <ItemCommunicationNode />
        </GGEditor>
      </div>
    );
  }
}
