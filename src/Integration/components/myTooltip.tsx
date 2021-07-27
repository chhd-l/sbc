import React, { Component } from 'react';
import { Tooltip } from 'antd';
import ReactJson from 'react-json-view';
import '@/Integration/components/index.less';

export default class MyTooltip extends Component<any> {
  static defaultProps = {
    trigger: 'click',
    text: ''
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    let { content, text, trigger } = this.props;
    return (
      <Tooltip {...this.props} title={
        content && typeof (content) === 'object' ?
          <ReactJson
            src={content}
            name={false}
            style={{ fontFamily: 'Sans-Serif', width: 600, height: 300, overflow: 'auto', padding: 20 }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
          /> : <div style={{ padding: 20 }}>{content}</div>
      }
               overlayClassName="myTooltip"
               arrowPointAtCenter={true}
               trigger={trigger}
               getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
      >
        <a>{text}</a>
      </Tooltip>
    );
  }
}
