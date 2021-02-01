import React, { Component } from 'react';

export default class TaskUpdate extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id
    };
  }
  render() {
    return <div></div>;
  }
}
