import React, { Component } from 'react';
import GGEditor from 'gg-editor';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import './style.less';
import WorkFlow from './work-flow';

export default class AutomationNode extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id
    };
  }

  render() {
    const { title, id } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <GGEditor>
          <WorkFlow id={id} />
        </GGEditor>
      </div>
    );
  }
}
