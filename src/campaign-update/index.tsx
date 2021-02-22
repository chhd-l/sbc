import React, { Component } from 'react';
import GGEditor, { Flow, RegisterEdge } from 'gg-editor';
import './style.less'

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
                  grid={gird}
                  // onNodeDoubleClick="handleNodeDoubleClick"
                  // onNodeClick="handleNodeClick"
                  // noEndEdge="false"
                  // onAfterChange="onAfterChange"
                />
              </div>
              <div className="demo-chart__sidebar user-select-none"></div>
            </div>
          </div>
        </GGEditor>
      </div>
    );
  }
}
