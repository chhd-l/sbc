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
import { RCi18n } from 'qmkit'

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  getOption = () => {
    const { yName, unit, data, nameTextStyle } = this.props as any;
    let option = {
      backgroundColor: '',
      tooltip: {
        trigger: 'axis',
        formatter:function(params) {
          let res = ""
          params&&params.map((item,index)=>{
            if(index == 0) {
              res += '<div style=" "> '+ item.seriesName + "：" + item.value + "<br>"
              '</div>';
            }else {
              res += '<div style=" "> '+ item.seriesName + "：" + Number(item.value) +unit.unit2
              '</div>';
            }
          })
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
          boundaryGap: true,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999',
              fontsize: '11'
            },
            formatter: RCi18n({id:'Home.Week'})+'-{value}'
          },
          data: data.x
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName.y1,
          nameTextStyle: {
            color: '#C7C7C7',
            fontSize: 12,
            padding: nameTextStyle.y1,
          },
          /*min: 0,
          max: 250,*/
          //interval: 50,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter: '{value}' + unit.unit1,
            textStyle: {
              color: '#999',
              fontsize: '11'
            }
          },
          color: '#C7C7C7'
        },
        {
          type: 'value',
          name: yName.y2,
          nameTextStyle: {
            color: '#C7C7C7',
            fontSize: 12,
            padding: nameTextStyle.y2,
          },
          /*min: 0,
          max: 25,*/
          //interval: 5,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            formatter:  function (params) {
              return unit.unit2 == '%'? params + unit.unit2:params
            },
            textStyle: {
              color: '#999',
              fontsize: '11',
            }
          },
          color: '#C7C7C7'
        }
      ],
      series: [
        {
          name: yName.y1,
          type: 'bar',
          yAxisIndex: 0,
          barWidth: 25,
          left: 0,
          nameGap: 5,
          nameLoaction: "left",
          itemStyle: {
            normal: {
              color: '#F5828E',
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
          data: data.y1
        },
        {
          name: yName.y2,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ED001B',
              lineStyle: {
                width: 2 //设置线条粗细
              }
            }
          },
          yAxisIndex: 1,
          data: data.y2
        }
      ]
    };
    return option;
  };

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <ReactEcharts option={this.getOption()} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}
export default injectIntl(Line)
