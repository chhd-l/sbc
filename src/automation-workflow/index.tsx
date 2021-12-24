import React, { Component } from 'react';
import GGEditor from 'gg-editor';
import { Breadcrumb, Card } from 'antd';
import { BreadCrumb } from 'qmkit';
import './style.less';
import WorkFlow from './work-flow';

export default class AutomationNode extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Workflow',
      name: this.props.location.state && this.props.location.state.name
    };
  }

  render() {
    const { title, id, name } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <GGEditor>
          <WorkFlow id={id} name={name} />
        </GGEditor>
      </div>
    );
  }
}
