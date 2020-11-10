import React, { Component } from 'react';

export default class Interaction extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h3>Step3</h3>
        <h4>Interaction Type</h4>
      </div>
    );
  }
}
