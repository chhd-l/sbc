import React, { Component } from 'react';
import { Collapse } from 'antd';
import GGEditor, { Flow, Item, ItemPanel } from 'gg-editor';
const { Panel } = Collapse;
import '../style.less';

export default class FlowItemPanel extends Component {
  render() {
    const color = {
      yellow: '#ffc820',
      blue: '#5b9bd5',
      grey: '#a6a6a6',
      green: 'green',
      pink: '#FAB0B9'
    };
    return (
      <div id="itemPanel">
        <ItemPanel>
          <Collapse bordered={false} activeKey={['1', '2', '3', '4']}>
            <Panel header="Start / End" key="1" className="panel-custom">
              <Item
                type="node"
                model={{
                  label: {
                    text: 'Start (Time Trigger)',
                    fontSize: 12
                  },
                  labelOffsetY: 20,
                  labelOffsetX: 80,
                  size: [40, 40],
                  shape: 'item-start-node',
                  name: 'Item Name',
                  color: color.yellow,
                  nodeType: 'TimeTrigger',
                  timeType: '',
                  time: '',
                  recurrenceType: '',
                  recurrenceValue: null
                }}
              >
                <span
                  className="icon iconfont iconkaishi item-icon"
                  style={{ color: color.yellow }}
                />
                <br />
                <span className="item-text">
                  Start
                  <br />
                  (Time Trigger)
                </span>
              </Item>
              <Item
                type="node"
                model={{
                  label: {
                    text: 'Start (Event Trigger)',
                    fontSize: 12
                  },
                  size: [40, 40],
                  shape: 'item-start-node',
                  labelOffsetY: 20,
                  labelOffsetX: 80,
                  name: 'Item Name',
                  color: color.blue,
                  nodeType: 'EventTrigger',
                  eventType: ''
                }}
              >
                <span
                  className="icon iconfont iconkaishi item-icon"
                  style={{ color: color.blue }}
                />
                <br />
                <span className="item-text">
                  Start
                  <br />
                  (Event Trigger)
                </span>
              </Item>
              <Item
                type="node"
                model={{
                  label: {
                    text: 'End',
                    fill: '#333',
                    textBaseline: 'middle',
                    fontSize: 14
                  },
                  size: [40, 40],
                  shape: 'item-end-node',
                  labelOffsetY: 0,
                  labelOffsetX: 45,
                  color: color.grey,
                  nodeType: 'End'
                }}
              >
                <span
                  className="icon iconfont iconjieshu item-icon"
                  style={{ color: color.grey }}
                />
                <br />
                <span className="item-text">End</span>
              </Item>
            </Panel>
            <Panel header="Work Flow" key="2" className="panel-custom">
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-wait-node',
                  label: 'Wait',
                  labelBottom: 'Wait',
                  labelOffsetY: 25,
                  labelOffsetX: 52,
                  name: 'Item Name',
                  color: color.yellow,
                  nodeType: 'Wait'
                }}
              >
                <span
                  className="icon iconfont icondengdai item-icon"
                  style={{ color: color.yellow }}
                />
                <br />
                <span className="item-text">Wait</span>
              </Item>
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-if-else-node',
                  label: 'If/Else',
                  labelBottom: 'If/Else',
                  labelOffsetY: 25,
                  labelOffsetX: 55,
                  name: 'Item Name',
                  color: color.green,
                  nodeType: 'IfAndElse'
                }}
              >
                <span
                  className="icon iconfont icontiaojianfenzhi item-icon"
                  style={{ color: color.green }}
                />
                <br />
                <span className="item-text">If/Else</span>
              </Item>
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-task-node',
                  label: 'Task',
                  labelBottom: 'Task',
                  labelOffsetY: 25,
                  labelOffsetX: 55,
                  name: 'Item Name',
                  color: color.blue,
                  nodeType: 'Task'
                }}
              >
                <span className="icon iconfont iconrenwu item-icon" style={{ color: color.blue }} />
                <br />
                <span className="item-text">Task</span>
              </Item>
            </Panel>
            <Panel header="Communication" key="3" className="panel-custom" id="sendEmailItem">
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  type: 'circle',
                  shape: 'item-communication-node',
                  label: 'Send Email',
                  labelOffsetY: 20,
                  labelOffsetX: 60,
                  name: 'Item Name',
                  color: color.pink,
                  nodeType: 'SendEmail',
                  templateId: ''
                }}
              >
                <span
                  className="icon iconfont iconyoujian item-icon"
                  style={{ color: color.pink }}
                />
                <br />
                <span className="item-text">Send Email</span>
              </Item>
            </Panel>
            <Panel header="Others" key="4" className="panel-custom" id="otherItem">
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-tagging-node',
                  label: 'Tagging',
                  labelBottom: 'Tagging',
                  labelOffsetY: 25,
                  labelOffsetX: 63,
                  name: 'Item Name',
                  color: color.green,
                  nodeType: 'Tagging'
                }}
              >
                <span
                  className="icon iconfont iconai-connection item-icon"
                  style={{ color: color.green }}
                />
                <br />
                <span className="item-text">Tagging</span>
              </Item>
              <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-products-node',
                  label: 'Products',
                  labelBottom: 'Products',
                  labelOffsetY: 25,
                  labelOffsetX: 63,
                  name: 'Item Name',
                  color: color.grey,
                  nodeType: 'Products'
                }}
              >
                <span
                  className="icon iconfont iconitem-products-node item-icon"
                  style={{ color: color.grey }}
                />
                <br />
                <span className="item-text">Products</span>
              </Item>
              {/* <Item
                type="node"
                model={{
                  size: [40, 40],
                  shape: 'item-order-node',
                  label: 'Order',
                  labelBottom: 'Order',
                  labelOffsetY: 25,
                  labelOffsetX: 55,
                  name: 'Item Name',
                  color: color.green,
                  nodeType: 'Order'
                }}
              >
                <span className="icon iconfont iconfangjian1 item-icon" style={{ color: color.green }} />
                <br />
                <span className="item-text">Order</span>
              </Item> */}
            </Panel>
          </Collapse>
        </ItemPanel>
      </div>
    );
  }
}
