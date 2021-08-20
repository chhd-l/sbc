import Graphin, { Behaviors, GraphinContext, IG6GraphEvent, Utils } from '@antv/graphin';
import React, { Component, useContext, useEffect } from 'react';

import iconfont from './iconfont.json'
import './index.css'
import * as webapi from './../../webapi'
import { Const } from 'qmkit';
import { Button, Col, Dropdown, Icon, Menu, message, Row } from 'antd';
import { INode, NodeConfig } from '@antv/g6';
import ReactDOM from 'react-dom';

const { ZoomCanvas, Hoverable } = Behaviors;

const SampleBehavior = () => {
  function renderApiList(list) {
    return (
      <ul className='interface-api-list'>
        {
          list&&list.map((item,index) => (
            <li className='api-item' key={index}>
              <div className='apiName api-item-box'>
                {`${item.name} >`}
              </div>
              <div className='Uptime api-item-box'>
                {`Uptime: ${item.Uptime}`}
              </div>
              <div className='Provider api-item-box'>
                {`Provider: ${item.Provider}`}
              </div>
              <div className='Invoker api-item-box'>
                {`Invoker: ${item.Invoker}`}
              </div>
              <div className='DataFlow api-item-box'>
                {`Data Flow: ${item.DataFlow}`}
              </div>
            </li>
          ))
        }
      </ul>
    )
  }


  function ApiList(props) {
    
    return (
      <div>
        <p>{props.title}</p>
        {renderApiList(props.list)}
      </div>
    );
  }
  const { graph, apis } = useContext(GraphinContext);
  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      message.success(model.id)
      let title = model.style.label.value
      webapi.getApiList().then(data=>{
        const { res } = data
        if (res.code === Const.SUCCESS_CODE) {
          const apiList= [
            {
                name: 'Price Synchronization',
                Uptime: '',
                Provider: 'FGS',
                Invoker: ' Navision',
                DataFlow: 'Navision to FGS',

            },
            {
                name: 'Price Synchronization',
                Uptime: '',
                Provider: 'FGS',
                Invoker: ' Navision',
                DataFlow: 'Navision to FGS',

            },
            {
                name: 'Price Synchronization',
                Uptime: '',
                Provider: 'FGS',
                Invoker: ' Navision',
                DataFlow: 'Navision to FGS',
            },
        ]
          ReactDOM.render(
            <ApiList list={apiList} title={title}/>,
            document.getElementById('topo_graph')
          );

        }
        
      }).catch(err=>{
        console.log(err);
        
      })
      
    };
    // 每次点击聚焦到点击节点上
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, []);
  return null;
};
export default class TopologicalGraph extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      topoData: {},
      layout: { type: 'concentric' },
      layoutList: [
        'graphin-force',
        'preset',
        'concentric',
        'radial',
        'dagre',
        'circular',
        'force',
        'gForce',
        'mds',
        'random'
      ]
    }
  }
  componentDidMount() {
    this.init()
  }

  init = () => {
    this.getNodesAndEdges()
  }
  getNodesAndEdges = () => {
    webapi.findSystemNodesByStoreId().then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let nodes = res.context.nodes
        let edges = res.context.edges
        this.renderGraph(nodes, edges)
      }

    })
  }

  renderGraph = (nodes, edges) => {
    let tempNodes = nodes.map(node => {
      return {
        id: node.id,
        style: {
          // 节点的主要形状，即圆形容器，可以在这里设置节点的大小，border，填充色
          keyshape: {
            /** 容器的宽度 */
            lineWidth: 2,
            /** 节点的大小 */
            size: 60,
            /** 包围边颜色 */
            stroke: '#e2001a',
            /** 填充色 */
            fill: node.name.indexOf('FGS') !== -1 ? '#e5707e' : 'red',
            /** 透明度 */
            // opacity: 1,
            /** 鼠标样式 */
            cursor: 'pointer',
          },
          label: {
            /** label的名称 */
            value: node.name,
            /** 展示位置  'top' | 'bottom' | 'left' | 'right' | 'center'; */
            position: 'bottom',
            /** 文本填充色 */
            fill: '#555555',
            /** 文本大小 */
            fontSize: 12,
            fontFamily: 'normal',
            textAlign: 'center',
            /** 文本在各自方向上的偏移量，主要为了便于调整文本位置 */
            offset: [0, 10],
          },
          icon: {
            type: 'image', // 指定图标为image
            value: node.name.indexOf('FGS') !== -1 ? 'https://fgs-cdn.azureedge.net/cdn/img/integration/aggregation.svg' :
              'https://fgs-cdn.azureedge.net/cdn/img/integration/server.svg', // 指定图标的值
            size: [40, 40]
          },

        }
      }
    })

    let tempEdges = edges.map(edge => {
      return {

        source: edge.source,
        target: edge.target,
        style: {
          keyshape: {
            stroke: '#797979',
            // lineWidth: 4,
            type: 'poly',
            poly: {
              distance: 40,
            },
          },
        }

      }
    })
    console.log(tempNodes);

    let data = {
      nodes: tempNodes,
      edges: tempEdges
    }
    this.setState({
      topoData: data
    })
  }
  switchLayout = (layout) => {
    this.setState({
      layout: { type: layout }
    })
  }


  render() {
    const { topoData, layoutList, layout } = this.state


    const menu = (
      <Menu>
        {
          layoutList && layoutList.map((layout, index) => (
            <Menu.Item key={index}>
              <Button type="link" onClick={() => this.switchLayout(layout)}>
                {layout}
              </Button>
            </Menu.Item>
          ))
        }
      </Menu>
    )

    return <div>
      <div>
        <Row>
          <Col span={20}>
            <Dropdown overlay={menu}>
              <Button type="link" >
                {layout.type} <Icon type="down" />
              </Button>
            </Dropdown>
            <Graphin data={topoData} layout={layout} key={layout.type}>
              <SampleBehavior />
              <ZoomCanvas disabled />
            </Graphin>
          </Col>
          <Col span={4}>
            <div id="topo_graph"></div>
          </Col>

        </Row>

      </div>
    </div>
  }

}

