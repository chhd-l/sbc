import React, { Component } from 'react';
import { Row, Col, Spin, Button, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import MyLineChart from '@/Integration/components/MyLineChart';
import MyHeader from '@/Integration/components/myHeader';
import * as webapi from '@/Integration/Interface/Interface-detail/webapi'
import { Const, RCi18n, history, AuthWrapper } from 'qmkit';

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
        let serviceLoadData = res.context.statisticalVOS
        let serviceLoadCount = []
        let serviceLoadDateTime = []
        serviceLoadData&&serviceLoadData.forEach(element => {
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
        let apdexData = res.context.statisticalVOS
        let apdexCount = []
        let apdexDateTime = []
        apdexData&&apdexData.forEach(element => {
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
        let errorData = res.context.statisticalVOS
        let errorCount = []
        let errorDateTime = []
        errorData&&errorData.forEach(element => {
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

  openInterface = (interfaceId, type) => {
    history.push({ pathname: `/interface-detail/${interfaceId}`, query: { type: type } })
  }


  render() {
    const {
      loading,
      serviceLoadCount,
      serviceLoadDateTime,
      apdexCount,
      apdexDateTime,
      errorCount,
      errorDateTime,
    } = this.state
    return (
      <Spin spinning={loading}>


        <div className="container">
          <MyHeader active={this.state.active} onChange={this.onChange} />
          <div>
            <Row gutter={24}>
              {serviceLoadCount && serviceLoadCount.length > 0 ?
                <Col span={8}>
                  <MyLineChart
                    nameData={serviceLoadDateTime}
                    data={serviceLoadCount}
                    title={RCi18n({ id: "Interface.Service Load (CPM - Calls per min)" })}
                  />
                </Col> : null
              }
              {apdexCount && apdexCount.length > 0 ? <Col span={8}>
                <MyLineChart
                  nameData={apdexDateTime}
                  data={apdexCount}
                  title={RCi18n({ id: "Interface.Apdex" })}
                />
              </Col> : null
              }
              {errorCount && errorCount.length > 0 ?
                <Col span={8}>
                  <MyLineChart
                    show
                    nameData={errorDateTime}
                    data={errorCount}
                    // getIndex={(index) => this.getIndex(index)}
                    activeIndex={this.state.activeIndex}
                    title={RCi18n({ id: "Interface.Error" })}
                  />
                </Col> : null
              }

              {

                serviceLoadCount.length === 0 &&
                  apdexCount.length === 0 &&
                  errorCount.length === 0
                  ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null
              }



            </Row>
            <AuthWrapper functionName="f_interface_details">
              <Button type="link"
                onClick={() => this.openInterface(this.props.interfaceId, 'statistics')}
                style={{ float: 'right', marginTop: 20 }}>{
                  RCi18n({ id: 'Dashboard.Show More' })
                }</Button>
            </AuthWrapper>
          </div>
        </div>
      </Spin>
    );
  }
}
