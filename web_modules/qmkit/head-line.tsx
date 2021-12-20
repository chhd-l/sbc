import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class Headline extends React.PureComponent<any, any> {
  props: {
    children?: any;
    state?: any;
    title?: any;
    number?: string;
    //禁止显示line
    lineDisable?: Boolean;
    smallTitle?: string;
    extra?: any;
    style?:{}
    className?:string
  };

  render() {
    return (
      <div className={this.props.lineDisable ? 'headlinewithnoline' : 'headline' +' '+this.props.className} style={this.props.style}>
        <h3>
          {this.props.title}
          {(this.props.number || +this.props.number === 0 ) && <small>(<FormattedMessage id="Order.total" />{` ${+this.props.number}`})</small>}
          {this.props.smallTitle && <small>{this.props.smallTitle}</small>}
        </h3>
        {this.props.children}
        {this.props.state?(<span style={{ color: '#F56C1D', fontSize: 14 }}>{this.props.state}</span>):null}
        {this.props.extra ? (<div style={{ position: 'absolute', right: 50 }}>{this.props.extra}</div>):null}
      </div>
    );
  }
}
