import React, { Component } from 'react';
import { substringName, getBrowserType, getIcon } from '../common';
import GGEditor, { Flow, RegisterNode, setAnchorPointsState } from 'gg-editor';

export default class ItemEndNode extends Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);
        this.drawLabel(item);
        const group = item.getGraphicGroup();
        const model = item.getModel();

        group.addShape('text', {
          attrs: {
            x: -25,
            y: getBrowserType() === 'FF' ? -18 : -25,
            fill: model.color,
            text: getIcon('结束'),
            fontFamily: 'iconfont',
            textBaseline: 'top',
            fontSize: 50
          },
          draggable: true
        });

        return keyShape;
      },
      anchor: [
        [0.5, 0] // 顶部中间
      ]
    };
    return <RegisterNode name="item-end-node" config={config} extend="circle" />;
  }
}
