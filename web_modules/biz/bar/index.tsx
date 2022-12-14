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
          let res = ''
          params&&params.map((item,index)=>{
            if(index == 0) {
              res += '<div style=" "> '+ item.name + '：' + item.value + '<br>' + '</div>';
            }else {
              res += '<div style=" "> '+ item.name + '：' + Number(item.value) +unit.unit2 + '</div>';
            }
          })
          return res

        }
      },
      grid: {
        left: '10%',
        right: '1%',
        top: '9%',
        bottom: '0%',
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
            rotate:10,
            textStyle: {
              color: '#999',
              fontsize: '11',
              borderWidth: 0,
              fontWeight: 0
            },
            formatter: function(value) {
              var res = value;
              if(res.length > 8) {
                res = res.substring(0, 8) + "..";
              }
              return res;
            }
          },
          data: data.x
        }
      ],
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: '#C7C7C7',
            fontSize: 12,
            padding: nameTextStyle.y1,
          },
          /*min: 0,
          max: 250,*/
          //interval: 50,
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: {
            show: true,
            lineStyle:{
              color: ['#eeeeee'],
              width: 1,
              type: 'dashed'
            }
          },
          axisLabel: { show: false },
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
              color: Const.COLORS.PRIMARY_COLOR_1,
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
