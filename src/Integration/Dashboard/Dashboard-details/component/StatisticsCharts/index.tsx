import React,{ Component } from 'react';

import MyLineChart from '@/Integration/components/MyLineChart';
import AntBtnGroup from '@/Integration/Dashboard/component/AntBtnGroup';

import './index.less';
import {Col, Row} from 'antd';
import {FormattedMessage} from 'react-intl';

export default class StatisticsCharts extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: 'Hour', // 默认小时
            nameData:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    }

    handleBtn = (e) => {
        this.setState({ active: e.target.value });
    }

    render() {
        let {active} = this.state;
        return (
            <div className='StatisticsCharts-wrap'>
                <div className='StatisticsCharts-header'>
                    <div className='header-right'>
                        <AntBtnGroup
                            active={active}
                            onChange={this.handleBtn}
                        />
                    </div>
                </div>
                <div className='StatisticsCharts-main'>
                    <Row gutter={[40, 16]}>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.Service Load (CPM - Calls per min)" />}
                            />
                        </Col>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.Apdex" />}
                            />
                        </Col>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.Error" />}
                            />
                        </Col>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.Successful Rate (%)" />}
                            />
                        </Col>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.Response Time (ms)" />}
                            />
                        </Col>
                        <Col span={12}>
                            <MyLineChart
                                nameData={this.state.nameData}
                                data={this.state.data}
                                title={<FormattedMessage id="Interface.90th Response Time Percentile (ms)" />}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
