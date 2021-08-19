import Graphin, { Behaviors, Utils } from '@antv/graphin';
import IconLoader from '@antv/graphin-icons';
import React, { Component } from 'react';

import iconfont from './iconfont.json'
import './index.css'

const { ZoomCanvas, Hoverable } = Behaviors;


export default class TopologicalGraph extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      topoData: {}
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    let data = {
      nodes: [
        {
          id: 'node-0',
          style: {
            // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
            keyshape: {
              /** 容器的宽度 */
              lineWidth: 3,
              /** 节点的大小 */
              size: 80,
              /** 包围边颜色 */
              stroke: '#e2001a',
              /** 填充色 */
              fill: Utils.hexToRgbaToHex('#e2001a', 0.2),
              /** 透明度 */
              opacity: 1,
              /** 鼠标样式 */
              cursor: 'pointer',
            },
            // 是节点的标签，可以设置标签的值 和样式：放置方位，大小，字体颜色，偏移位置
            label: {
              /** label的名称 */
              value: 'FGS',
              /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
              position: 'top',
              /** 文本填充色 */
              fill: '#e2001a',
              /** 文本大小 */
              fontSize: 16,
              fontFamily: 'normal',
              textAlign: 'center',
              /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
              offset: 0,
            },
            // 是节点的中心 ICON 区域，icon 可以是图片，可以是文本，也可以是字体图标。
            icon: "message",
            fontFamily: "iconfont"
          }
        },
        {
          id: 'node-1',
          style: {
            // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
            keyshape: {
              /** 容器的宽度 */
              lineWidth: 3,
              /** 节点的大小 */
              size: 80,
              /** 包围边颜色 */
              stroke: '#e2001a',
              /** 填充色 */
              fill: Utils.hexToRgbaToHex('#e2001a', 0.2),
              /** 透明度 */
              opacity: 1,
              /** 鼠标样式 */
              cursor: 'pointer',
            },
            // 是节点的标签，可以设置标签的值 和样式：放置方位，大小，字体颜色，偏移位置
            label: {
              /** label的名称 */
              value: 'Navision',
              /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
              position: 'top',
              /** 文本填充色 */
              fill: '#e2001a',
              /** 文本大小 */
              fontSize: 16,
              fontFamily: 'normal',
              textAlign: 'center',
              /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
              offset: 0,
            },
            // 是节点的中心 ICON 区域，icon 可以是图片，可以是文本，也可以是字体图标。
            icon: "message",
            fontFamily: "iconfont"
          }
        },
        {
          id: 'node-3',
          style: {
            // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
            keyshape: {
              /** 容器的宽度 */
              lineWidth: 3,
              /** 节点的大小 */
              size: 80,
              /** 包围边颜色 */
              stroke: '#e2001a',
              /** 填充色 */
              fill: Utils.hexToRgbaToHex('#e2001a', 0.2),
              /** 透明度 */
              opacity: 1,
              /** 鼠标样式 */
              cursor: 'pointer',
            },
            // 是节点的标签，可以设置标签的值 和样式：放置方位，大小，字体颜色，偏移位置
            label: {
              /** label的名称 */
              value: 'DaData',
              /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
              position: 'top',
              /** 文本填充色 */
              fill: '#e2001a',
              /** 文本大小 */
              fontSize: 16,
              fontFamily: 'normal',
              textAlign: 'center',
              /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
              offset: 0,
            },
            // 是节点的中心 ICON 区域，icon 可以是图片，可以是文本，也可以是字体图标。
            icon: "message",
            fontFamily: "iconfont"
          }
        },
        {
          id: 'node-4',
          style: {
            // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
            keyshape: {
              /** 容器的宽度 */
              lineWidth: 3,
              /** 节点的大小 */
              size: 80,
              /** 包围边颜色 */
              stroke: '#e2001a',
              /** 填充色 */
              fill: Utils.hexToRgbaToHex('#e2001a', 0.2),
              /** 透明度 */
              opacity: 1,
              /** 鼠标样式 */
              cursor: 'pointer',
            },
            // 是节点的标签，可以设置标签的值 和样式：放置方位，大小，字体颜色，偏移位置
            label: {
              /** label的名称 */
              value: 'Weshare',
              /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
              position: 'top',
              /** 文本填充色 */
              fill: '#e2001a',
              /** 文本大小 */
              fontSize: 16,
              fontFamily: 'normal',
              textAlign: 'center',
              /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
              offset: 0,
            },
            // 是节点的中心 ICON 区域，icon 可以是图片，可以是文本，也可以是字体图标。
            icon: "message",
            fontFamily: "iconfont"
          },
        },
        {
          id: 'node-5',
          style: {
            // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
            keyshape: {
              /** 容器的宽度 */
              lineWidth: 3,
              /** 节点的大小 */
              size: 80,
              /** 包围边颜色 */
              stroke: '#e2001a',
              /** 填充色 */
              fill: Utils.hexToRgbaToHex('#e2001a', 0.2),
              /** 透明度 */
              opacity: 1,
              /** 鼠标样式 */
              cursor: 'pointer',
            },
            // 是节点的标签，可以设置标签的值 和样式：放置方位，大小，字体颜色，偏移位置
            label: {
              /** label的名称 */
              value: 'OKTA',
              /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
              position: 'top',
              /** 文本填充色 */
              fill: '#e2001a',
              /** 文本大小 */
              fontSize: 16,
              fontFamily: 'normal',
              textAlign: 'center',
              /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
              offset: 0,
            },
            // 是节点的中心 ICON 区域，icon 可以是图片，可以是文本，也可以是字体图标。
            icon: "message",
            fontFamily: "iconfont"
          },
        }



      ],
      edges: [
        {
          source: 'node-0',
          target: 'node-0',
          style: {
            keyshape: {
              type: 'loop',
              loop: {
                distance: 10,
              },
            },
          },
        },
        {
          source: 'node-0',
          target: 'node-1',
          style: {
            label: {
              value: 'node-0 -> node-1 ',
            },
            keyshape: {
              stroke: 'red',
              // lineWidth: 4,
            },
          },
        },
        {
          source: 'node-1',
          target: 'node-0',
          style: {
            label: {
              value: 'node-1 -> node-0 ',
            },

            keyshape: {
              stroke: 'red',
              // lineWidth: 4,
              type: 'poly',
              poly: {
                distance: -40,
              },
            },
          },
        },
      ]
    }
    this.setState({
      topoData: data
    })
  }
  render() {
    return <div>
      <div>
        <Graphin data={this.state.topoData} layout={{ name: "concentric" }} extend={{
          icon: () => {
            return [
              {
                fontFamily: "iconfont",
                map: iconfont.glyphs
              }
            ];
          }
        }}>
          <ZoomCanvas disabled />
        </Graphin>
      </div>
    </div>
  }

}

