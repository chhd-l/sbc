import React, { Component } from 'react';
import { BreadCrumb } from 'qmkit';
export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
      </div>
    );
  }
}
