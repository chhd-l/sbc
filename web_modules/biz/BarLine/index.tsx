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
    const { yName, unit } = this.props
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
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999',
              fontsize: '11'
            }
          },
          data: ['Week-1', 'Week-2', 'Week-3', 'WTD'],
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName.y1,
          nameTextStyle:{
            color:"#C7C7C7",
            fontSize:12,
            padding: [0, 0, 0, -3]
          },
          /*min: 0,
          max: 250,*/
          //interval: 50,
          splitLine: {show: false},
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}'+ unit.unit1,
            textStyle: {
              color: '#999',
              fontsize: '11'
            }
          },
          color:'#C7C7C7',
        },
        {
          type: 'value',
          name: yName.y2,
          nameTextStyle:{
            color:"#C7C7C7",
            fontSize:12,
          },
          /*min: 0,
          max: 25,*/
          //interval: 5,
          splitLine: {show: false},
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}'+ unit.unit2,
            textStyle: {
              color: '#999',
              fontsize: '11'
            }
          },
          color: '#C7C7C7',
        }
      ],
      series: [
        {
          name: yName.y1,
          type: 'bar',
          barWidth: 25,
          itemStyle: {
            normal: {
              color: '#F5828E',
            }
          },
          data: [2.6, 5.9, 9.0, 26.4]
        },
        {
          name: yName.y2,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ED001B',
              lineStyle:{
                width:2//设置线条粗细
              }
            }
          },
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
