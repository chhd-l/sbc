import React, { Component } from 'react';
import { substringName, getBrowserType, getIcon } from '../common';
import GGEditor, { Flow, RegisterNode, setAnchorPointsState } from 'gg-editor';

export default class ItemTaskNode extends Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);
        this.drawLabel(item);

        const group = item.getGraphicGroup();
        const model = item.getModel();

        const text = substringName(model.name, 15, 25);
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
        });

        group.addShape('text', {
          attrs: {
            x: -15,
            y: getBrowserType() === 'FF' ? -10 : -15,
            fill: model.color,
            text: getIcon('任务'),
            fontFamily: 'iconfont',
            textBaseline: 'top',
            fontSize: 30
          },
          draggable: true
        });

        return keyShape;
      },
      anchor: [
        [0.5, 0],
        [0.5, 1]
      ]
    };
    return <RegisterNode name="item-task-node" config={config} extend="flow-rect" />;
  }
}
