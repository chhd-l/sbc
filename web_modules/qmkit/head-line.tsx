import React from 'react';

export default class Headline extends React.PureComponent<any, any> {
  props: {
    children?: any;
    state?: any;
    title?: any;
    number?: string;
    //禁止显示line
    lineDisable?: Boolean;
    smallTitle?: string;
  };

  render() {
    return (
      <div
        className={this.props.lineDisable ? 'headlinewithnoline' : 'headline'}
      >
        <h3>
          {this.props.title}
          {this.props.number && <small>{`(Total ${this.props.number})`}</small>}
          {this.props.smallTitle && <small>{this.props.smallTitle}</small>}
        </h3>
        {this.props.children}
        <span style={{ color: '#F56C1D', fontSize: 14 }}>
          {this.props.state}
        </span>
      </div>
    );
  }
}
