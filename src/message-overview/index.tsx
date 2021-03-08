import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import * as webapi from './webapi';
import { Button, Form, Row, Col, Breadcrumb } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
import { FormattedMessage } from 'react-intl';

class Overview extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Email Task Overview',
      dateList: [],
      requestsList: [],
      deliveredList: [],
      opensList: [],
      clickedList: [],
      bouncesList: [],
      spamReportsList: [],
      overviewTotal: {
        requestsCount: '',
        bounceRate: '',
        clicksRate: '',
        deliveredRate: '',
        opensRate: '',
        spamReportRate: ''
      }
    };
  }
  componentDidMount() {
    this.getOverview();
  }
  chartInit = () => {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.30)'
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        },
        data: this.state.dateList
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        }
      },
      legend: {
        data: ['requests', 'delivered', 'opened', 'clicked', 'bounces', 'spam reports'],
        bottom: 20
      },

      series: [
        {
          name: 'requests',
          type: 'line',
          lineStyle: {
            color: '#246201'
          },
          itemStyle: {
            color: '#246201'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#246201',
              borderWidth: 2
            }
          },
          data: this.state.requestsList
        },
        {
          name: 'delivered',
          type: 'line',
          lineStyle: {
            color: '#bcd514'
          },
          itemStyle: {
            color: '#bcd514'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#bcd514',
              borderWidth: 2
            }
          },
          data: this.state.deliveredList
        },
        {
          name: 'opened',
          type: 'line',
          lineStyle: {
            color: '#028690'
          },
          itemStyle: {
            color: '#028690'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#028690',
              borderWidth: 2
            }
          },
          data: this.state.opensList
        },
        {
          name: 'clicked',
          type: 'line',
          lineStyle: {
            color: '#59c1ca'
          },
          itemStyle: {
            color: '#59c1ca'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#59c1ca',
              borderWidth: 2
            }
          },
          data: this.state.clickedList
        },
        {
          name: 'bounces',
          type: 'line',
          lineStyle: {
            color: '#c042be'
          },
          itemStyle: {
            color: '#c042be'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#c042be',
              borderWidth: 2
            }
          },
          data: this.state.bouncesList
        },
        {
          name: 'spam reports',
          type: 'line',
          lineStyle: {
            color: '#e04427'
          },
          itemStyle: {
            color: '#e04427'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#e04427',
              borderWidth: 2
            }
          },
          data: this.state.spamReportsList
        }
      ]
    });
  };

  getOverview = () => {
    webapi.getOverview().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let overviewList = res.context.overviewList;
        let overviewTotal = res.context.overviewTotal;
        let dateList = [];
        let requestsList = [];
        let deliveredList = [];
        let opensList = [];
        let clickedList = [];
        let bouncesList = [];
        let spamReportsList = [];
        for (let i = 0; i < overviewList.length; i++) {
          dateList.push(overviewList[i].eventDate);
          requestsList.push(overviewList[i].requestsCount);
          deliveredList.push(overviewList[i].deliveredCount);
          opensList.push(overviewList[i].opensCount);
          clickedList.push(overviewList[i].clicksCount);
          bouncesList.push(overviewList[i].bounceCount);
          spamReportsList.push(overviewList[i].spamReportCount);
        }
        this.setState(
          {
            dateList,
            requestsList,
            deliveredList,
            clickedList,
            bouncesList,
            spamReportsList,
            overviewTotal
          },
          () => {
            this.chartInit();
          }
        );
      }
    });
  };

  render() {
    const { title, overviewTotal } = this.state;

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Overview</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container">
          <Row style={{ paddingTop: 20 }}>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">REQUESTS</p>
                <p className="overview-item-value" style={{ color: '#246201' }}>
                  {overviewTotal.requestsCount}
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">DELIVERED</p>
                <p className="overview-item-value" style={{ color: '#bcd514' }}>
                  {overviewTotal.deliveredRate}
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">OPENED</p>
                <p className="overview-item-value" style={{ color: '#028690' }}>
                  {overviewTotal.opensRate}
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">CLICKED</p>
                <p className="overview-item-value" style={{ color: '#59c1ca' }}>
                  {overviewTotal.clicksRate}
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">BOUNCES</p>
                <p className="overview-item-value" style={{ color: '#c042be' }}>
                  {overviewTotal.bounceRate}
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">SPAM REPORTS</p>
                <p className="overview-item-value" style={{ color: '#e04427' }}>
                  {overviewTotal.spamReportRate}
                </p>
              </div>
            </Col>
            <Col span={24}>
              <div id="main" style={{ width: '100%', height: 400, margin: '0 auto' }}></div>
            </Col>
          </Row>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(Overview);
