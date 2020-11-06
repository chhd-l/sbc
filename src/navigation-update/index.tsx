import React, { Component } from 'react';

export default class NavigationUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
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
