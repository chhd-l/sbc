import React, { Component } from 'react';
import { substringName, getBrowserType, getIcon } from '../common';
import GGEditor, { Flow, RegisterNode, setAnchorPointsState } from 'gg-editor';

export default class ItemStartNode extends Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);
        this.drawLabel(item);

        const group = item.getGraphicGroup();
        const model = item.getModel();
        const text = substringName(model.name, 15, 40);
        group.addShape('text', {
          attrs: {
            x: 30,
            y: -20,
            fill: '#333',
            text: text,
            textBaseline: 'top',
            fontWeight: 'bold',
            fontSize: 14
          },
          draggable: true
        });

        group.addShape('text', {
          attrs: {
            x: -20,
            y: getBrowserType() === 'FF' ? -14 : -20,
            fill: model.color,
            text: getIcon('开始'),
            fontFamily: 'iconfont',
            textBaseline: 'top',
            fontSize: 40
          },
          draggable: true
        });

        return keyShape;
      },
      anchor: [
        [0.5, 1] // 底部中间
      ]
    };
    return <RegisterNode name="item-start-node" config={config} extend="circle" />;
  }
}
