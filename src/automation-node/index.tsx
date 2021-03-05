import React, { Component } from 'react';
import GGEditor, { withPropsAPI } from 'gg-editor';
import { Tabs, Breadcrumb } from 'antd';
import { BreadCrumb, Headline } from 'qmkit';
import './style.less';
import WorkFlow from './work-flow'



export default withPropsAPI(class AutomationNode extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Automation node'
    };
  }

  render() {
    const { title } = this.state;
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
            <WorkFlow />
          </GGEditor>
        </div>
      </div>
    );
  }
})
