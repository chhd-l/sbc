import React from 'react';
//下面是按需加载
import echarts from 'echarts/lib/echarts';
//导入饼图
import 'echarts/lib/chart/line'; //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n, Const } from 'qmkit'
import { Select } from 'antd';
const { Option } = Select;

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      SelectValue: 'day',
      obj: {
        dayCount: [
          {
            "day": "2022-03-01",
            "count": 2
          },
          {
            "day": "2022-03-03",
            "count": 2
          },
          {
            "day": "2022-03-04",
            "count": 2
          },
          {
            "day": "2022-03-05",
            "count": 2
          },
          {
            "day": "2022-03-06",
            "count": 2
          },
          {
            "day": "2022-03-07",
            "count": 2
          },
          {
            "day": "2022-03-08",
            "count": 2
          },
          {
            "day": "2022-03-09",
            "count": 2
          },
          {
            "day": "2022-03-10",
            "count": 2
          },
          {
            "day": "2022-03-11",
            "count": 2
          },
          {
            "day": "2022-03-12",
            "count": 2
          },
          {
            "day": "2022-03-13",
            "count": 2
          },
          {
            "day": "2022-03-14",
            "count": 2
          },

          {
            "day": "2022-03-15",
            "count": 2
          },
          {
            "day": "2022-03-16",
            "count": 2
          },
          {
            "day": "2022-03-17",
            "count": 2
          },
          {
            "day": "2022-03-18",
            "count": 2
          },
          {
            "day": "2022-03-19",
            "count": 2
          },
          {
            "day": "2022-03-20",
            "count": 2
          },
          {
            "day": "2022-03-21",
            "count": 2
          },

          {
            "day": "2022-04-01",
            "count": 32
          },
          {
            "day": "2022-05-01",
            "count": 20
          },
          {
            "day": "2022-06-01",
            "count": 45
          },
          {
            "day": "2022-07-01",
            "count": 60
          }
        ],
        monthCount: [
          {
            "month": "2022-3",
            "count": 22
          },
          {
            "month": "2022-4",
            "count": 23
          },
          {
            "month": "2022-5",
            "count": 243
          },
          {
            "month": "2022-6",
            "count": 23
          }, {
            "month": "2022-7",
            "count": 162
          }
        ],
        yearCount: [
          {
            "year": "2022",
            "count": 22
          },
          {
            "year": "2023",
            "count": 221
          },
          {
            "year": "2024",
            "count": 120
          },
          {
            "year": "2025",
            "count": 50
          },
          {
            "year": "2026",
            "count": 100
          }
        ],
        "total": 2
      }
    };
  }

  getOption = () => {
    const { obj, SelectValue } = this.state as any
    const { yName, data, nameTextStyle } = this.props as any;
    let max;
    let xdata;
    let ydata;
    switch (SelectValue) {
      case 'day':
        xdata = obj.dayCount.map(item => item.day);
        ydata = obj.dayCount.map(item => item.count);
        max = (obj.dayCount.sort((a, b) => a.count - b.count)[obj.dayCount.length - 1].count * 1.5).toFixed(0);
        break;
      case 'month':
        xdata = obj.monthCount.map(item => item.month);
        ydata = obj.monthCount.map(item => item.count);
        max = obj.monthCount.sort((a, b) => a.count - b.count)[obj.monthCount.length - 1].count + obj.monthCount.sort((a, b) => a.count - b.count)[obj.monthCount.length - 1].count * 0.4;
        break;
      case 'year':
        xdata = obj.yearCount.map(item => item.year);
        ydata = obj.yearCount.map(item => item.count);
        max = obj.yearCount.sort((a, b) => a.count - b.count)[obj.yearCount.length - 1].count + obj.yearCount.sort((a, b) => a.count - b.count)[obj.yearCount.length - 1].count * 0.4;
        break;
    }
    let option = {
      backgroundColor: '',
      tooltip: {
        trigger: 'axis',
        triggerOn: "mousemove",
        //是否一直显示
        // alwaysShowContent: true,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(0, 0, 0, 1)',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        textStyle: {
          color: '#999',
        },
        position: function (point, params, dom, rect, size) {
          return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 10];
        },
        formatter: function (params) {
          // params[0].axisValue这里要根据下拉框选择的年月日进行判断 day month year
          console.log('params', params)
          let axisValue;
          switch (SelectValue) {
            case 'day':
              axisValue = params[0].axisValue.split('-').reverse().join('/')
              break;
            case 'month':
              axisValue = params[0].axisValue.split('-').reverse().join('/')
              break;
            case 'year':
              axisValue = params[0].axisValue.split('-').reverse().join('/')
              break;
          }
          let res = `<div style="text-align: center;">
            <span style="color: #e2001a;font-weight: 600;">${params[0].value} orders</span>
            </br>
            ${axisValue}
          </div>`;


          return res
        }
      },

      grid: {
        left: '1%',
        right: '1%',
        top: '13%',
        bottom: '1%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          // boundaryGap: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999',
              fontsize: '11'
            },
            //设置x轴区间名称
            // formatter: (window as any).RCi18n({ id: 'Home.Week' }) + '-{value}'
            formatter: '{value}'
          },
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            }
          },
          data: xdata,
          show: true
        }
      ],
      yAxis: [
        {
          type: 'value',
          // name: yName.y1,
          nameTextStyle: {
            color: '#C7C7C7',
            fontSize: 12,
            padding: nameTextStyle.y1,
          },
          min: 0,
          max: max,
          // interval: 50,
          splitNumber: 5,
          splitLine: { show: true },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#999',
              fontsize: '11'
            }
          },
          color: '#C7C7C7'
        },
      ],
      // legend: {
      //   type: "plain",
      //   show: true,
      //   itemStyle: {
      //     color: '#e2001a'
      //   }
      // },
      series: [
        {
          name: yName.y1,
          type: 'line',
          symbol: 'circle',
          yAxisIndex: 0,
          barWidth: 25,
          left: 0,
          nameGap: 5,
          nameLoaction: "left",
          itemStyle: {
            normal: {
              color: '#e2001a',
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#999',
                  fontSize: 12,
                }
              }
            }
          },
          // y轴数据
          data: ydata
        },
      ]
    };
    return option;
  };
  handleChange = (value) => {
    console.log('value', value)
    this.setState({
      SelectValue: value
    })
  }
  render() {
    const { SelectValue } = this.state as any;
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-11px', right: '20px', zIndex: 9999 }}>
          <Select value={SelectValue} style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="day">day</Option>
            <Option value="month">month</Option>
            <Option value="year">year</Option>
          </Select>
        </div>
        <ReactEcharts option={this.getOption()} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}
export default injectIntl(Line)
