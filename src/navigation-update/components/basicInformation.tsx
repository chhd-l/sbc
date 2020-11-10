import React, { Component } from 'react';

export default class BasicInformation extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h3>Step2</h3>
        <h4>Basic Information</h4>
      </div>
    );
  }
}
