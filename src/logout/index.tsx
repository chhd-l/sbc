import React, { Component } from 'react';
import { cache, util, history } from 'qmkit';
import * as webapi from './webapi';

export default class Logout extends Component<any, any> {
  async componentWillMount() {
    // await webapi.logout()
    util.logout();
    history.push('/login');
  }
  render() {
    return null;
  }
}
