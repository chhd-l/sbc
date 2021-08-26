import React, { Component } from 'react';
import ReactECharts from 'echarts-for-react';
import { Icon, Popover } from 'antd';
import moment from 'moment';

export default class MyLineChart extends Component<any,any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeIndex:0
    };
  }

  render() {
    const { title, data, nameData, show, activeIndex, getIndex } = this.props;
    const options = {
      grid: {
        top: 8,
        right: 36,
        bottom: 36,
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
          show:true,
          textStyle: { // 颜色
            color: '#000000'
          },
          lineStyle: { // x轴线颜色
            color: '#C7C7C7'
          },
          align:"center",
  
          formatter: function (value, index) {
            return moment(value).format("HH:mm") +'\n'+ moment(value).format("MM-DD")
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
          // areaStyle: { // 开起面积背景颜色
          //   color: '#f4e3e5'
          // },
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
    const textList = ['Technical', 'Business'];
    const getContent=(index)=>{
      if(index===0){
        return 'code: K-020007'
      } else {
        return 'code: K-020008'
      }
    }
    return (
      <div style={styles.myLine}>
        {/* <div className="flex-header">
          <div className="text-title">{title}</div>
          <div className="title-right">
            <div className="flex-between">
              {
                show ? textList.map((item, index) => {
                  return (
                    <div className="flex-between cur-poin" key={index} onClick={()=>getIndex(index)} >
                      <div className="flex-between mr20">
                        <span className={activeIndex===index?'garden bcrd':'garden'} />
                        <span className={activeIndex===index?'mlr10 crrd':'mlr10'}>{item}</span>
                        <Popover content={getContent(index)} arrowPointAtCenter placement="bottom">
                          <Icon type="info-circle" style={{color:activeIndex===index?'#e1021a':''}}/>
                        </Popover>
                      </div>
                    </div>
                  );
                }) : null
              }
            </div>
          </div>
        </div> */}
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
