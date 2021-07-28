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
            isShowBtn: false
        };
    }
    componentDidMount() {
        const { id } = this.props.match && this.props.match.params ? this.props.match.params : null;
        console.log('id', id);

    }

    handleTabChange = (tabKey) => {
        console.log('tabKey', tabKey)

        // 只有key不为Info， 显示按钮
        let isShowBtn = tabShowBtnKeys.includes(tabKey);
        this.setState({
            isShowBtn
        })
    }

    render() {
        let {
            title,
            tabTitle,
            isShowBtn
        } = this.state;
        return (
            <div className='DashboardDetails-wrap'>
                <BreadCrumb />
                <div className='DashboardDetails-title-wrap'>
                    <div className='DashboardDetails-title'>{title}</div>
                </div>

                <div className='DashboardDetails-main'>
                    <div className='title'><FormattedMessage id="Dashboard.Monitor" /></div>
                    <div className='DashboardDetails-flow-chart-hint'>
                        <h1>我是流程图</h1>
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
                            callBackTab={this.handleTabChange}
                        />
                    </div>
                </div>
            </div>

        );
    }
}