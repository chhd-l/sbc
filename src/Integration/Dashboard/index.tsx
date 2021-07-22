import React from 'react';
import {Breadcrumb} from 'antd';
import {FormattedMessage} from 'react-intl';

import {BreadCrumb} from 'qmkit';
import './index.less';

export default class Dashboard extends React.Component<any, any> {


    render() {
        return (
            <div className='Dashboard-wrap'>
                <BreadCrumb />

                <div className='Dashboard-title-wrap'>
                    <div className='Dashboard-title'><FormattedMessage id="Dashboard.Dashboard" /></div>
                </div>

                <div className='container'>
                    <div className=''><FormattedMessage id="Dashboard.Dashboard" /></div>
                </div>
            </div>
        );
    }
}