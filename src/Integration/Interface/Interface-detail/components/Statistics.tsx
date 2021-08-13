import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import MyLineChart from '@/Integration/components/MyLineChart';
import MyHeader from '@/Integration/components/myHeader';

export default class Statistics extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeIndex: 0,
      active: 'Hour',
      nameData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      dataError: [82, 92, 90, 34, 190, 130, 320],
    };
  }
  // 切换 Latest
  onChange = async (e) => {
    await this.setState({
      active: e.target.value
    });
  };
  // 获取error 折线图切换方式
  getIndex = (index) => {
    this.setState({ activeIndex: index });
    if(index===0){
      this.setState({
        dataError:  [82, 92, 90, 34, 190, 130, 320]
      })
    } else {
      this.setState({
        dataError:  [30, 42, 90, 34, 90, 20, 220]
      })
    }
  };

  render() {
    return (
      <div className="container">
        <MyHeader active={this.state.active} onChange={this.onChange} />
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
                show
                nameData={this.state.nameData}
                data={this.state.dataError}
                getIndex={(index) => this.getIndex(index)}
                activeIndex={this.state.activeIndex}
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
