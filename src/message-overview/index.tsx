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
        data: []
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
            color: 'rgba(219, 219, 219)'
          },
          itemStyle: {
            color: 'rgba(219, 219, 219)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(219, 219, 219)',
              borderWidth: 2
            }
          },
          data: []
        },
        {
          name: 'delivered',
          type: 'line',
          lineStyle: {
            color: 'rgba(148, 208, 80)'
          },
          itemStyle: {
            color: 'rgba(148, 208, 80)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(148, 208, 80)',
              borderWidth: 2
            }
          },
          data: []
        },
        {
          name: 'opened',
          type: 'line',
          lineStyle: {
            color: 'rgba(0, 178, 155)'
          },
          itemStyle: {
            color: 'rgba(0, 178, 155)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(0, 178, 155)',
              borderWidth: 2
            }
          },
          data: []
        },
        {
          name: 'clicked',
          type: 'line',
          lineStyle: {
            color: 'rgba(59, 172, 255)'
          },
          itemStyle: {
            color: 'rgba(59, 172, 255)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(59, 172, 255)',
              borderWidth: 2
            }
          },
          data: []
        },
        {
          name: 'bounces',
          type: 'line',
          lineStyle: {
            color: 'rgba(247, 184, 68)'
          },
          itemStyle: {
            color: 'rgba(247, 184, 68)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(247, 184, 68)',
              borderWidth: 2
            }
          },
          data: []
        },
        {
          name: 'spam reports',
          type: 'line',
          lineStyle: {
            color: 'rgba(245, 34, 45)'
          },
          itemStyle: {
            color: 'rgba(245, 34, 45)'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(245, 34, 45)',
              borderWidth: 2
            }
          },
          data: []
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
                <p className="overview-item-value">0</p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">DELIVERED</p>
                <p className="overview-item-value">0</p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">OPENED</p>
                <p className="overview-item-value">0</p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">CLICKED</p>
                <p className="overview-item-value">0</p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">BOUNCES</p>
                <p className="overview-item-value">0</p>
              </div>
            </Col>
            <Col span={4}>
              <div className="overview-item-border">
                <p className="overview-item-name">SPAM REPORTS</p>
                <p className="overview-item-value">0</p>
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
