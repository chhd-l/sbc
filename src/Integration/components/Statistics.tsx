import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import MyLineChart from '@/Integration/components/MyLineChart';
import MyHeader from '@/Integration/components/myHeader';

export default class Statistics extends Component<any,any> {
  constructor(props: any) {
    super(props);
    this.state={
      active:'Hour',
      nameData:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  }
  onChange=(e)=>{
    this.setState({
      active:e.target.value
    })
  }
  render() {
    return (
      <div className="container">
        <MyHeader active={this.state.active} onChange={this.onChange}/>
        <div>
          <Row gutter={24}>
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
                show
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
