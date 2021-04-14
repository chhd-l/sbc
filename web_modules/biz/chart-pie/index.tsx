import React from 'react';
//下面是按需加载
import echarts from 'echarts/lib/echarts';
//导入饼图
import 'echarts/lib/chart/pie'; //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit'
class Line extends React.Component {
  constructor(props, ctx) {
    super(props);
  }
  componentDidMount() {}
  getOption = () => {
    let option = {
      title: [
        {
          text: RCi18n({id:'Home.Rate'}),
          x: 'center',
          top: '32%',
          textStyle: {
            color: '#808285',
            fontSize: 12,
            fontWeight: '100'
          }
        },
        {
          text: this.props.shelves + '%',
          x: 'center',
          top: '47%',
          textStyle: {
            fontSize: 22,
            color: '#000000'
          }
        }
      ],
      color: ['#ddd'],
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%'
      },
      series: [
        {
          name: 'Line 1',
          type: 'pie',
          roundCap: true,

          radius: ['75%', '90%'],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [
            {
              value: this.props.shelves,
              name: '',
              itemStyle: {
                normal: {
                  color: '#ea162d',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            },
            {
              name: '',
              value: this.props.total - this.props.shelves
            }
          ]
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
