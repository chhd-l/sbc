import React, { Component } from 'react';

export default class ChooseOrderForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    const { updateValue } = this.props;
    updateValue('eventType', value);
  }
  render() {
    return <div></div>;
  }
}
