import React, { Component } from 'react';
import ReactECharts from 'echarts-for-react';
import { Icon } from 'antd';

export default class MyLineChart extends Component<any> {
  render() {
    const { title, data, nameData, show } = this.props;

    const options = {
      grid: {
        top: 8,
        right: 8,
        bottom: 24,
        left: 36
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: { show: false, type: 'dashed' },
        data: nameData,
        axisTick: { // 刻度线颜色
          lineStyle: {
            color: '#C7C7C7'
          }
        },
        axisLabel: { // x轴文案
          textStyle: { // 颜色
            color: '#C7C7C7'
          },
          lineStyle: { // x轴线颜色
            color: '#C7C7C7'
          }
        }

      },
      yAxis: {
        type: 'value',
        axisTick: { show: false }, // 刻度线
        axisLine: { show: false }, // y轴线
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#C7C7C7'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#C7C7C7'
          }
        }
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: { // 开起面积背景颜色
            color: '#f4e3e5'
          },
          label: {
            show: false,
            position: 'top'
          }
        }
      ],
      tooltip: {
        trigger: 'axis'
      }
    };

    return (
      <div style={styles.myLine}>
        <div className="flex-header">
          <div className="text-title">{title}</div>
          <div className="title-right">
            {
              show ? <div className="flex-between">
                <div className="flex-between mr20">
                  <span className="garden"/>
                  <span className="mlr10">Technical</span>
                  <Icon type="info-circle" />
                </div>
                <div className="flex-between">
                  <span className="garden"/>
                  <span className="mlr10">Business</span>
                  <Icon type="info-circle" />
                </div>
              </div> : null
            }
          </div>
        </div>
        <ReactECharts
          option={options}
          style={{ height: 200 }}
        />
      </div>
    );

  }
}
const styles = {
  myLine: {
    border: '1px solid #C7C7C7',
    padding: '30px',
    marginBottom: '24px',
    borderRadius: '5px'
  }
} as any;
