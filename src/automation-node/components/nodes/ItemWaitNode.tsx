import React, { Component } from 'react';
import { substringName, getBrowserType, getIcon } from '../common';
import GGEditor, { Flow, RegisterNode, setAnchorPointsState } from 'gg-editor';

export default class ItemWateNode extends Component {
  render() {
    const config = {
        draw (item) {
          const keyShape = this.drawKeyShape(item)
          this.drawLabel(item)
  
          const group = item.getGraphicGroup()
          const model = item.getModel()
  
          const text = substringName(model.name, 15, 25)
          group.addShape('text', {
            attrs: {
              x: 40,
              y: -20,
              fill: '#333',
              text: text,
              textBaseline: 'top',
              fontWeight: 'bold',
              fontSize: 14
            },
            draggable: true
          })
  
          group.addShape('text', {
            attrs: {
              x: -22.5,
              y: getBrowserType() === 'FF' ? -15 : -22.5,
              fill: model.color,
              text: getIcon('等待'),
              fontFamily: 'iconfont',
              textBaseline: 'top',
              fontSize: 45
            },
            draggable: true
          })
  
          return keyShape
        },
        anchor: [
          [0.5, 0],
          [0.5, 1]
        ]
      }
    return <RegisterNode name="item-wait-node" config={config} extend="circle" />;
  }
}
