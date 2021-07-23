import React from 'react';
import { Tabs } from 'antd';

import {FormattedMessage} from 'react-intl';
import './index.less';


export default class TabDataGrid extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            key: 'Info'
        }
    }


    handleChange = (key) => {
        this.props.callBackTab && this.props.callBackTab(key);

        this.setState({
            key
        })
    }
    render() {
        let { key } = this.state;
        return (
            <div className='TabDataGrid-wrap'>
                <Tabs onChange={this.handleChange} activeKey={key}>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Info" />} key="Info">
                        <div>Info</div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Statistics" />} key="Statistics">
                        <div>Statistics</div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Log" />} key="Log">
                        <div>Log</div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Error" />} key="Error">
                        <div>Error</div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
}