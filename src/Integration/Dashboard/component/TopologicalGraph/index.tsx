import Graphin, { Behaviors, GraphinContext, IG6GraphEvent, Utils } from '@antv/graphin';
import React, { Component, useContext, useEffect } from 'react';

import './index.less'
import * as webapi from './../../webapi'
import { Const, RCi18n } from 'qmkit';
import { Button, Card, Col, Dropdown, Icon, Menu, message, Row, Spin } from 'antd';
import { INode, NodeConfig } from '@antv/g6';
import ReactDOM from 'react-dom';
import DashboardDetails from '../DashboardDetails';

const { ZoomCanvas, Hoverable } = Behaviors;

const SampleBehavior = () => {
  const { graph } = useContext(GraphinContext);
  function renderApiList(list) {
    return (
      <ul className='main-content' style={{ maxHeight: 500 }}>
        {
          list && list.map((item, index) => (
            <li className='api-item' key={index} >
              <Button className='api-item-box' type="link"
                onClick={() => { handleApiBtn(item.id) }}
                style={{ fontWeight: 600, marginTop: 10, padding: 0, color: '#000000' }}>
                {item.name}{item.isInvoker ? <Icon type="right" /> : <Icon type="left" />}
              </Button>
              <div className='api-item-box'>
                {`${RCi18n({ id: 'Dashboard.Uptime' })}: ${item.updateTime}`}
              </div>
              <div className='api-item-box'>
                {`${RCi18n({ id: 'Dashboard.Provider' })}: ${item.provider}`}
              </div>
              <div className='api-item-box'>
                {`${RCi18n({ id: 'Dashboard.Invoker' })}: ${item.invoker}`}
              </div>
              <div className='api-item-box'>
                {`${RCi18n({ id: 'Dashboard.Data Flow:' })} ${item.dataFlow}`}
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  function ApiList(props) {

    return (
      <Card size="small" title={props.title}
        headStyle={{ fontSize: 16, fontWeight: 600 }}
        bodyStyle={{ paddingRight: 0, paddingTop: 0 }}>
        {renderApiList(props.list)}
      </Card>
    );
  }

  function handleApiBtn(id) {
    ReactDOM.render(
      <div className="container">
        <DashboardDetails id={id} key={id} />
      </div>,
      document.getElementById('dashboard-details')
    );
  }

  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      let title = model.style.label.value
      webapi.getApiList({ systemId: model.id }).then(data => {
        const { res } = data
        if (res.code === Const.SUCCESS_CODE) {
          let tempApiList = res.context.intInterfaceDTOS
          let apiList = []
          tempApiList.forEach(element => {

            apiList.push({
              id: element.id,
              name: element.name,
              updateTime: element.updateTime || '',
              provider: element.apiProviderName,
              invoker: element.apiInvokerName,
              dataFlow: element.dataSourceFromName + ' → ' + element.dataSourceToName,
              isInvoker: element.apiInvokerName === title ? true : false
            })
          });

          ReactDOM.render(
            <ApiList list={apiList} title={title} />,
            document.getElementById('topo_graph')
          );

        }

      }).catch(err => {
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
      loading: false,
      topoData: {},
      latestTimeNum: 1,
      country: '',
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
    this.setState({
      loading: true
    })
    webapi.findSystemNodesByStoreId().then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let nodes = res.context.nodes
        let edges = res.context.edges
        this.renderGraph(nodes, edges)
        this.setState({
          loading: false
        })
      }
      else {
        this.setState({
          loading: false
        })
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

    let data = {
      nodes: tempNodes,
      edges: tempEdges
    }
    this.setState({
      topoData: data,
      lading: false
    })
  }
  switchLayout = (layout) => {
    this.setState({
      layout: { type: layout }
    })
  }


  render() {
    const { topoData, layoutList, layout, latestTimeNum, country, loading } = this.state


    const menu = (
      <Menu>
        {
          layoutList && layoutList.map((layout, index) => (
            <Menu.Item key={index}>
              <Button type="link" style={{ padding: 0 }} onClick={() => this.switchLayout(layout)}>
                {layout}
              </Button>
            </Menu.Item>
          ))
        }
      </Menu>
    )

    return (<Spin spinning={loading} >
      <div className="container">
        <div className='title'>{RCi18n({ id: "Dashboard.Monitor" })}</div>
        <p>{RCi18n({ id: "Dashboard.Country" })} {`: ${country}`}</p>
        <Row>
          <Col span={18}>
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
          <Col span={6}>
            <div id="topo_graph"></div>
          </Col>
        </Row>
        <div className='Dashboard-flow-chart-hint'>
          <p>
            <i className="iconfont iconjinggao" />
            <span>
              {RCi18n({ id: 'Dashboard.Technical Error Happened' })}
            </span>
          </p>
          <p>
            <i className="iconfont iconwarning" />
            <span>
              {RCi18n({ id: "Dashboard.Default Report Time" })} {`: Latest ${latestTimeNum} hour`}</span>
          </p>
        </div>

      </div>

      <div id="dashboard-details">

      </div>


    </Spin >)
  }

}

