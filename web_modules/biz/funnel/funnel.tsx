import React from 'react';
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入饼图
import 'echarts/lib/chart/funnel';  //折线图是line,饼图改为pie,柱形图改为bar
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
    let option = {
      series: [
        {
          type: 'funnel',
          name:'预期',
          top: '0%',
          left: '29%',
          width: '40%',
          height: '80%',

          labelLine:{
            show: false,
            normal:{
              show:false
            }
          },
          label: {
            show: false,
          },
          itemStyle:{
            normal:{
              opacity:0.8
            },
          },
          data: [
            {name:'展现', value:100},
            {name:'点击', value:75},
            {name:'访问', value:50},
            {name:'咨询', value:25},
          ]
        },
        {
          type: 'funnel',
          name:'实际',
          top: '0%',
          left: '34%',
          width: '30%',
          height: '80%',
          label: {
            show: false,
            normal: {
              position: 'inside',
              formatter: '{c}%',
            },
            emphasis: {
              formatter: '{b}: {c}({d}%)'
            }
          },
          data: [
            {name:'展现', value:80},
            {name:'点击', value:50},
            {name:'访问', value:30},
            {name:'咨询', value:10},
          ]
        },

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
