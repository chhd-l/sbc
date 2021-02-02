import React, { Component } from 'react';
import GGEditor, { Flow, RegisterEdge } from 'gg-editor';

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
    return (
      <div className="container-search">
        <GGEditor>
          <div className="demo-chart">
            <div className="demo-chart__container">
              <div className="demo-chart__main">
                <Flow
                  style={{ height: '600px' }}
                  data={flowdata}
                  // onNodeDoubleClick="handleNodeDoubleClick"
                  // onNodeClick="handleNodeClick"
                  // noEndEdge="false"
                  // onAfterChange="onAfterChange"
                />
              </div>
            </div>
          </div>
        </GGEditor>
      </div>
    );
  }
}
