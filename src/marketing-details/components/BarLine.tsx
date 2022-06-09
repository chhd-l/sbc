import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import './style.less'
import { useRequest } from 'ahooks';
import { getusedcodecoupon, getusedcodepromotion } from '../webapi';
const { Option } = Select;
const oo = {
  dayCount: [
    {
      "day": "2022-03-01",
      "count": 2
    },
  ],
  monthCount: [
    {
      "month": "2022-3",
      "count": 22
    },
  ],
  yearCount: [
    {
      "year": "2022",
      "count": 22
    },
  ],
  "total": 2
}



const Line = (props: any) => {
  const [SelectValue, setSelectValue] = useState('day');
  const [obj, setObj] = useState(oo);
  // const [option, setOption] = useState(null)
  const { cid, pageType, startDate, endDate, yName, nameTextStyle, setTotal } = props;
  const chartRef = useRef<ReactEcharts>()

  useEffect(() => {
    mygetusedcodepromotion();

  }, [])
  useEffect(() => {
    if (obj.dayCount.length > 0 && obj.monthCount.length > 0 && obj.yearCount.length > 0) {
      getOption(obj)
    }
  }, [SelectValue])

  let opt = {
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
      axisPointer: {
        // 去除鼠标移入竖线
        type: 'none'
      },
      position: function (point, params, dom, rect, size) {
        return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 20];
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
        let res = `<div class="echartsTooltip" style="text-align: center;">
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
        data: [],
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
        max: 100,
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
        //去掉折线点，鼠标划入时也不会出现
        // symbol:'none,
        //去掉折线点，鼠标划入时可以出现
        showSymbol: false,
        itemStyle: {
          normal: {
            color: '#e2001a',
            // 折线数据点上数值是否显示
            label: {
              show: false, //关闭显示
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
        data: [100]
      },
    ]
  }

  const sort = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        const ad = new Date(arr[j]?.[SelectValue]);
        const bd = new Date(arr[j + 1]?.[SelectValue]);
        // 如果前一个比后一个大,则交换位置
        if (ad > bd) {
          let temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  }

  const getOption = (obj) => {
    console.log('obj', obj)
    const { yName, nameTextStyle } = props;
    let max;
    let xdata;
    let ydata;
    switch (SelectValue) {
      case 'day':
        xdata = sort(obj?.dayCount).map(item => item.day).map(item => item.split('-').reverse().join('/'))
        ydata = obj?.dayCount.map(item => item.count);
        max = (obj?.dayCount.sort((a, b) => a.count - b.count)[obj.dayCount.length - 1].count * 1.5).toFixed(0);
        break;
      case 'month':
        xdata = sort(obj?.monthCount).map(item => item.month).map(item => item.split('-').reverse().join('/'))
        ydata = obj?.monthCount.map(item => item.count);
        max = (obj?.monthCount.sort((a, b) => a.count - b.count)[obj.monthCount.length - 1].count * 1.5).toFixed(0);
        break;
      case 'year':
        xdata = sort(obj?.yearCount).map(item => item.year)
        ydata = obj?.yearCount.map(item => item.count);
        max = (obj?.yearCount.sort((a, b) => a.count - b.count)[obj.yearCount.length - 1].count * 1.5).toFixed(0);
        break;
    }
    // console.log('xdata', xdata)
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
        axisPointer: {
          // 去除鼠标移入竖线
          type: 'none'
        },
        position: function (point, params, dom, rect, size) {
          return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 20];
        },
        formatter: function (params) {
          // params[0].axisValue这里要根据下拉框选择的年月日进行判断 day month year
          // console.log('params', params)
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
          let res = `<div class="echartsTooltip" style="text-align: center;">
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
          //去掉折线点，鼠标划入时也不会出现
          // symbol:'none,
          //去掉折线点，鼠标划入时可以出现
          showSymbol: false,
          itemStyle: {
            normal: {
              color: '#e2001a',
              // 折线数据点上数值是否显示
              label: {
                show: false, //关闭显示
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
    }
    // setOption(option)
    // console.log('chartRef.current', chartRef.current)
    const echartInstance = chartRef.current.getEchartsInstance();
    // then you can use any API of echarts.
    // echartInstance.hideLoading();
    echartInstance.setOption(option);
  };
  const handleChange = (value) => {
    console.log('value', value)
    // if (obj.dayCount.length > 0 && obj.monthCount.length > 0 && obj.yearCount.length > 0) {
    setSelectValue(value)
    // }

  }
  const mygetusedcodepromotion = async () => {
    let cont;
    if (pageType === 'promotion') {
      const { res: { context } } = await getusedcodepromotion({ id: cid, startDate: startDate || null, endDate: endDate || null });
      cont = context
    } else {
      const { res: { context } } = await getusedcodecoupon({ id: cid, startDate: startDate || null, endDate: endDate || null })
      cont = context
    }

    setObj(cont);
    // const echartInstance = chartRef.current.getEchartsInstance();
    // echartInstance.showLoading({
    //   text: "loading",
    //   color: '#c23531",textColor: "#fff',
    //   maskColor: 'rgba(255,255,255,0.2)', zlevel: 0,
    // });
    if (cont) {
      cont.total ? setTotal(cont.total) : setTotal(0)
      getOption(cont)
    }
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-11px', right: '20px', zIndex: 9999 }}>
        <Select value={SelectValue} style={{ width: 120 }} onChange={handleChange}>
          <Option value="day">day</Option>
          <Option value="month">month</Option>
          <Option value="year">year</Option>
        </Select>
      </div>

      <ReactEcharts ref={(e) => chartRef.current = e} option={opt} style={{ height: '100%', width: '100%' }} />


    </div>
  );
}

export default injectIntl(Line)
