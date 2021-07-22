import React from 'react';
import {Breadcrumb} from 'antd';
import {FormattedMessage} from 'react-intl';

import {BreadCrumb} from 'qmkit';
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
                        <a onClick={() => this.props.history.push('/integration-dashboard-detail')}>我是流程图</a>
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