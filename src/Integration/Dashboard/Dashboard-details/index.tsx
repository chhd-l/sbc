import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Button} from 'antd';

import {BreadCrumb} from 'qmkit';
import TabDataGrid from './TabDataGrid';
import './index.less';

const tabShowBtnKeys = ['Statistics', 'Log', 'Error']
export default class DashboardDetails extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            title: 'Product Finder Details',
            tabTitle: 'Price Synchronization',
            isShowBtn: false,
            activeKey: 'Info',
            currentModule: '',
            upTime: '',
            apiList: [
                {
                    name: 'Price Synchronization',
                    Uptime: '',
                    Provider: 'FGS',
                    Invoker: ' Navision',
                    DataFlow: 'Navision to FGS',

                },
                {
                    name: 'Price Synchronization',
                    Uptime: '',
                    Provider: 'FGS',
                    Invoker: ' Navision',
                    DataFlow: 'Navision to FGS',

                },
                {
                    name: 'Price Synchronization',
                    Uptime: '',
                    Provider: 'FGS',
                    Invoker: ' Navision',
                    DataFlow: 'Navision to FGS',
                },
            ]
        };
    }
    componentDidMount() {
        const { id } = this.props.match && this.props.match.params ? this.props.match.params : null;
        console.log('id', id);
        this.setState({
            currentModule: id || ''
        })

    }

    handleTabChange = (activeKey) => {
        console.log('activeKey', activeKey)

        // 只有key不为Info， 显示按钮
        let isShowBtn = tabShowBtnKeys.includes(activeKey);
        this.setState({
            isShowBtn,
            activeKey,
        })
    }

    renderApiList = (list) => {
        if (!list) return null;
        if (!Array.isArray(list)) return null;
        if (list.length < 1) return null;

        return (
            <ul className='interface-api-list'>
                {
                    list.map(item => (
                        <li className='api-item'>
                            <div className='apiName api-item-box'>
                                {`${item.name} >`}
                            </div>
                            <div className='Uptime api-item-box'>
                                {`Uptime: ${item.Uptime}`}
                            </div>
                            <div className='Provider api-item-box'>
                                {`Provider: ${item.Provider}`}
                            </div>
                            <div className='Invoker api-item-box'>
                                {`Invoker: ${item.Invoker}`}
                            </div>
                            <div className='DataFlow api-item-box'>
                                {`Data Flow: ${item.DataFlow}`}
                            </div>
                        </li>
                    ))
                }
            </ul>
        )
    }

    render() {
        let {
            title,
            apiList,
            tabTitle,
            upTime,
            isShowBtn,
            activeKey,
            currentModule,
        } = this.state;
        return (
            <div className='DashboardDetails-wrap'>
                <BreadCrumb />
                <div className='DashboardDetails-title-wrap'>
                    <div className='DashboardDetails-title'>{title}</div>
                </div>

                <div className='DashboardDetails-main'>
                    <div className='title'><FormattedMessage id="Dashboard.Monitor" /></div>
                    <div className='DashboardDetails-flow-chart-wrap'>
                        <div className='interface-list-wrap'>
                            {this.renderApiList(apiList)}
                        </div>
                        <div className='interface-module-wrap'>
                            <div className='interface-module-left'>
                                <div className='interface-module-name-wrap'>
                                    <div className='interface-module-name'>
                                        {currentModule}
                                        <div className='arrows-box arrows-left'/>
                                        <div className='arrows-box arrows-right'/>
                                    </div>
                                    <div className='upTime'>
                                        {`upTime : ${upTime}`}
                                    </div>
                                </div>
                            </div>
                            <div className='interface-module-right'>
                                <div className='interface-module-FGS-wrap'>
                                    <div className='interface-module-FGS-box'>FGS</div>
                                    <div className='interface-module-FGS-hint'>
                                        <i className="icon-hint iconfont iconwarning"/>
                                        <p>
                                            <span>:</span><FormattedMessage id="Dashboard.Technical Error Happened Default Report Time: Latest 1 hour" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container DashboardDetails-tab-wrap'>
                    <div className='DashboardDetails-tab-title'>
                        <div className='tab-title-left'>
                            <span>{`${tabTitle}`}</span>
                            <a><i className="iconfont iconDetails"/></a>
                        </div>
                        {
                            isShowBtn
                                ? (
                                    <div className='tab-title-right'>
                                        <Button className='tab-title-right-btn'>
                                            <FormattedMessage id="Dashboard.Show More" />
                                        </Button>
                                    </div>
                                )
                                : null
                        }
                    </div>
                    <div>
                        <TabDataGrid
                            activeKey={activeKey}
                            callBackTab={this.handleTabChange}
                        />
                    </div>
                </div>
            </div>

        );
    }
}