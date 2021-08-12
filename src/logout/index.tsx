import React, { Component } from 'react';
import { cache, util, history, Const } from 'qmkit';
import * as webapi from './webapi';

export default class Logout extends Component<any, any> {
  async componentWillMount() {
    // await webapi.logout()
    util.logout();
    history.push(Const.SITE_NAME === 'MYVETRECO' ? '/login-admin' : '/login');
  }
  render() {
    return null;
  }
}
