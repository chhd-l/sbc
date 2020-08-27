import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb
} from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
class Overview extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Email Task Overview'
    };
  }
  componentDidMount() {
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
        data: ['2.1', '2.5', '3.3', '5.28', '7.7', '7.12']
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
        data: [
          'requests',
          'delivered',
          'opened',
          'clicked',
          'bounces',
          'spam reports'
        ],
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
          data: [1, 2, 3, 45, 21, 12]
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
          data: [1, 22, 30, 45, 2, 12]
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
          data: [13, 24, 3, 5, 2, 12]
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
          data: [11, 2, 33, 45, 1, 12]
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
          data: [1, 22, 3, 5, 21, 12]
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
          data: [5, 2, 3, 5, 11, 12]
        }
      ]
    });
  }

  render() {
    const { title } = this.state;

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
                  0
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">DELIVERED</p>
                <p className="overview-item-value" style={{ color: '#bcd514' }}>
                  0
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">OPENED</p>
                <p className="overview-item-value" style={{ color: '#028690' }}>
                  0
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">CLICKED</p>
                <p className="overview-item-value" style={{ color: '#59c1ca' }}>
                  0
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">BOUNCES</p>
                <p className="overview-item-value" style={{ color: '#c042be' }}>
                  0
                </p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">SPAM REPORTS</p>
                <p className="overview-item-value" style={{ color: '#e04427' }}>
                  0
                </p>
              </div>
            </Col>
            <Col span={24}>
              <div
                id="main"
                style={{ width: 800, height: 400, margin: '0 auto' }}
              ></div>
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
const styles = {} as any;

export default Form.create()(Overview);
