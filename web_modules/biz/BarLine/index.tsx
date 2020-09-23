import React from 'react';
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入饼图
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
export default class Line extends React.Component{
  constructor(props, ctx) {
    super(props);
  }
  componentDidMount(){
  }
  getOption =()=> {
    const {yName} = this.props
    let option = {
      backgroundColor:'',
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '13%',

        bottom: '10%',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          splitLine: {show: false},
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { show:false},
          data: ['Week-1', 'Week-2', 'Week-3', 'WTD'],
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName.y1,
          min: 0,
          max: 250,
          interval: 50,
          splitLine: {show: false},
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: yName.y2,
          min: 0,
          max: 25,
          interval: 5,
          splitLine: {show: false},
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '降水量',
          type: 'bar',

          data: [2.6, 5.9, 9.0, 26.4]
        },
        {
          name: '平均温度',
          type: 'line',
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5]
        }
      ]
    }
    return option
  }

  render(){
    return(
      <div  style={{ height: '100%', width: '100%' }}>
        <ReactEcharts option={this.getOption()}   style={{ height: '100%', width: '100%' }}/>
      </div>
    )
  }
}
