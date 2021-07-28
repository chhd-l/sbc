import React, { Component } from 'react';
import { Popover } from 'antd';
import ReactJson from 'react-json-view';
import '@/Integration/components/index.less';

export default class MyTooltip extends Component<any> {
  static defaultProps = {
    trigger: 'click',
    text: '',
    height: 300
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    let { content, text, trigger, height } = this.props;
    return (
      content?
      <Popover placement="leftTop" {...this.props} content={
        content && typeof (content) === 'object' ?
          <ReactJson
            src={content}
            name={false}
            style={{ fontFamily: 'Sans-Serif', width: 600, height: height, overflow: 'auto', padding: 20 }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
          />
          : <div style={{ padding: 20 }}>{content}</div>
      }
               overlayClassName="myTooltip"
               arrowPointAtCenter={true}
               trigger={trigger}
               getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
      >
        <a>{text}</a>
      </Popover>:<a>{text}</a>
    );
  }
}
