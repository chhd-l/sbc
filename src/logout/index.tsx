import React, { Component } from 'react'
import {  cache, util, history } from 'qmkit';
import * as webapi from './webapi';

export default class Logout extends Component<any, any> {
    async componentWillMount() {
        util.logout()
        await webapi.logout()
        history.push('/login')
    }
    render() {
        return (
           null
        )
    }
}
