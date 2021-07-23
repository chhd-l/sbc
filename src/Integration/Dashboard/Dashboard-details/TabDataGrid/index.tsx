import React from 'react';
import { Tabs } from 'antd';
import Information from '@/Integration/components/Information';
import {FormattedMessage} from 'react-intl';

import LogTable from '../component/LogTable';
import ErrorTable from '../component/ErrorTable';
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
                        <div>
                            <Information infoList={{a: 111}} />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Statistics" />} key="Statistics">
                        <div>Statistics</div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Log" />} key="Log">
                        <div>
                            <LogTable/>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<FormattedMessage id="Dashboard.Error" />} key="Error">
                        <div>
                            <ErrorTable/>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
}