import React from 'react';
import {FormattedMessage} from 'react-intl';

import {BreadCrumb} from 'qmkit';
import ModuleChart from './component/ModuleChart';

import TopologicalGraph from './component/TopologicalGraph';
import './index.less';

export default class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            country: 'France',
            latestTimeNum: 1
        }
    }


    render() {
        let {
            country,
            latestTimeNum
        } = this.state;
        return (
            <div className='Dashboard-wrap'>
                <BreadCrumb />

                <div className='Dashboard-title-wrap'>
                    <div className='Dashboard-title'><FormattedMessage id="Dashboard.Dashboard" /></div>
                </div>

                <div className='container Dashboard-main'>
                    <div className='title'><FormattedMessage id="Dashboard.Monitor" /></div>
                    <p><FormattedMessage id="Dashboard.Country" />{`: ${country}`}</p>
                    <div className='Dashboard-flow-chart-wrap'>
                        <TopologicalGraph/>
                    </div>

                    <div className='Dashboard-flow-chart-wrap'>
                        <ModuleChart/>
                    </div>
                    <div className='Dashboard-flow-chart-hint'>
                        <p>
                            <i className="iconfont iconjinggao"/>
                            <span>Technical Error Happened </span>
                        </p>
                        <p>
                            <i className="iconfont iconwarning"/>
                            <span><FormattedMessage id="Dashboard.Default Report Time" />{`: Latest ${latestTimeNum} hour`}</span>
                        </p>
                    </div>
                </div>



            </div>
        );
    }
}