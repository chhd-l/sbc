import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AuthWrapper, BreadCrumb, Const, RCi18n } from 'qmkit';
import ModuleChart from './component/ModuleChart';

import TopologicalGraph from './component/TopologicalGraph';
import './index.less';
import * as webapi from './webapi'

export default class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }


    render() {
        const {
            country,
        } = this.state;
        return (
            <AuthWrapper functionName="f_integration_dashboard">
                <div className='Dashboard-wrap'>
                    <BreadCrumb />

                    <div className='Dashboard-title-wrap'>
                        <div className='Dashboard-title'><FormattedMessage id="Dashboard.Dashboard" /></div>
                    </div>
                    <TopologicalGraph />
                </div>
            </AuthWrapper>
        );
    }
}