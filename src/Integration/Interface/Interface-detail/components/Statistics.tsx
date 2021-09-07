import React, { Component } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import MyLineChart from '@/Integration/components/MyLineChart';
import MyHeader from '@/Integration/components/myHeader';
import * as webapi from '../webapi'
import { Const } from 'qmkit';

export default class Statistics extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      activeIndex: 0,
      active: 'Hour',
      serviceLoadCount: [],
      serviceLoadDateTime: [],
      apdexCount: [],
      apdexDateTime: [],
      errorCount: [],
      errorDateTime: [],
      sucessfulRateCount: [],
      sucessfulRateDateTime: [],
      responseTimeCount: [],
      responseTimeDateTime: [],
      responseTimePercentileCount: [],
      responseTimePercentileDateTime: [],

    };
  }
  componentDidMount() {
    const { active } = this.state
    let interfaceId = this.props.interfaceId
    let params = {
      intInterfaceId: interfaceId,
      statisticalType: active.toUpperCase()
    }
    this.init(params)
  }
  init = (params) => {
    this.setState({
      loading: true
    })
    this.getServiceLoad(params)
    this.getApdex(params)
    this.getError(params)
    this.getSucessfulRate(params)
    this.getResponseTime(params)
    this.getResponseTimePercentile(params)
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 2000);
  }
  // 切换 Latest
  onChange = (e) => {
    this.setState({
      active: e.target.value
    }, () => {
      let params = {
        intInterfaceId: this.props.interfaceId,
        statisticalType: e.target.value.toUpperCase()
      }
      this.init(params)

    });
  };

  getServiceLoad = (params) => {
    webapi.getServiceLoad(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let serviceLoadData = res.context.statisticalDTOs
        let serviceLoadCount = []
        let serviceLoadDateTime = []
        serviceLoadData && serviceLoadData.forEach(element => {
          serviceLoadCount.push(element.count)
          serviceLoadDateTime.push(element.dateTime)
        });

        this.setState({
          serviceLoadCount,
          serviceLoadDateTime
        })
      }

    })
  }
  getApdex = (params) => {
    webapi.getApdex(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let apdexData = res.context.statisticalDTOs
        let apdexCount = []
        let apdexDateTime = []
        apdexData && apdexData.forEach(element => {
          apdexCount.push(element.count)
          apdexDateTime.push(element.dateTime)
        });

        this.setState({
          apdexCount,
          apdexDateTime
        })
      }

    })
  }
  getError = (params) => {
    webapi.getError(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let errorData = res.context.statisticalDTOs
        let errorCount = []
        let errorDateTime = []
        errorData && errorData.forEach(element => {
          errorCount.push(element.count)
          errorDateTime.push(element.dateTime)
        });

        this.setState({
          errorCount,
          errorDateTime
        })
      }

    })
  }
  getSucessfulRate = (params) => {
    webapi.getSucessfulRate(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let sucessfulRateData = res.context.statisticalDTOs
        let sucessfulRateCount = []
        let sucessfulRateDateTime = []
        sucessfulRateData && sucessfulRateData.forEach(element => {
          sucessfulRateCount.push(element.count)
          sucessfulRateDateTime.push(element.dateTime)
        });

        this.setState({
          sucessfulRateCount,
          sucessfulRateDateTime
        })
      }

    })
  }
  getResponseTime = (params) => {
    webapi.getResponseTime(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let responseTimeData = res.context.statisticalDTOs
        let responseTimeCount = []
        let responseTimeDateTime = []
        responseTimeData && responseTimeData.forEach(element => {
          responseTimeCount.push(element.count)
          responseTimeDateTime.push(element.dateTime)
        });

        this.setState({
          responseTimeCount,
          responseTimeDateTime
        })
      }

    })
  }
  getResponseTimePercentile = (params) => {
    webapi.getResponseTimePercentile(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let responseTimePercentileData = res.context.statisticalDTOs
        let responseTimePercentileCount = []
        let responseTimePercentileDateTime = []
        responseTimePercentileData && responseTimePercentileData.forEach(element => {
          responseTimePercentileCount.push(element.count)
          responseTimePercentileDateTime.push(element.dateTime)
        });

        this.setState({
          responseTimePercentileCount,
          responseTimePercentileDateTime
        })
      }

    })
  }


  // 获取error 折线图切换方式
  // getIndex = (index) => {
  //   this.setState({ activeIndex: index });
  //   if (index === 0) {
  //     this.setState({
  //       dataError: [82, 92, 90, 34, 190, 130, 320]
  //     })
  //   } else {
  //     this.setState({
  //       dataError: [30, 42, 90, 34, 90, 20, 220]
  //     })
  //   }
  // };

  render() {
    const {
      loading,
      serviceLoadCount,
      serviceLoadDateTime,
      apdexCount,
      apdexDateTime,
      errorCount,
      errorDateTime,
      sucessfulRateCount,
      sucessfulRateDateTime,
      responseTimeCount,
      responseTimeDateTime,
      responseTimePercentileCount,
      responseTimePercentileDateTime, } = this.state
    return (
      <Spin spinning={loading}>
        <div className="container">
          <MyHeader active={this.state.active} onChange={this.onChange} />
          <div>
            <Row gutter={24}>
              {
                serviceLoadCount && serviceLoadCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      nameData={serviceLoadDateTime}
                      data={serviceLoadCount}
                      title={<FormattedMessage id="Interface.Service Load (CPM - Calls per min)" />}
                    />
                  </Col> : null
              }
              {
                apdexCount && apdexCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      nameData={apdexDateTime}
                      data={apdexCount}
                      title={<FormattedMessage id="Interface.Apdex" />}
                    />
                  </Col> : null
              }
              {
                errorCount && errorCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      show
                      nameData={errorDateTime}
                      data={errorCount}
                      // getIndex={(index) => this.getIndex(index)}
                      // activeIndex={this.state.activeIndex}
                      title={<FormattedMessage id="Interface.Error" />}
                    />
                  </Col> : null
              }
              {
                sucessfulRateCount && sucessfulRateCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      nameData={sucessfulRateDateTime}
                      data={sucessfulRateCount}
                      title={<FormattedMessage id="Interface.Successful Rate (%)" />}
                    />
                  </Col> : null
              }
              {
                responseTimeCount && responseTimeCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      nameData={responseTimeDateTime}
                      data={responseTimeCount}
                      title={<FormattedMessage id="Interface.Response Time (ms)" />}
                    />
                  </Col> : null
              }
              {
                responseTimePercentileCount && responseTimePercentileCount.length > 0 ?
                  <Col span={12}>
                    <MyLineChart
                      nameData={responseTimePercentileDateTime}
                      data={responseTimePercentileCount}
                      title={<FormattedMessage id="Interface.90th Response Time Percentile (ms)" />}
                    />
                  </Col> : null
              }
              {

                serviceLoadCount.length === 0 &&
                  apdexCount.length === 0 &&
                  errorCount.length === 0 &&
                  sucessfulRateCount.length === 0 &&
                  responseTimeCount.length === 0 &&
                  responseTimePercentileCount.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null

              }

            </Row>
          </div>
        </div>
      </Spin>
    );
  }
}
