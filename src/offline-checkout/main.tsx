import React from 'react';
import { Row, Col } from 'antd';
import Order from './components/order';
import Board from './components/board';
import './style.less';

export default class Checkout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: false,
      selectedType: 'guest',
      memberInfo: {}
    };
  }

  onSelect = (memberInfo?: any) => {
    this.setState({
      selected: true,
      selectedType: memberInfo ? 'member' : 'guest',
      memberInfo: memberInfo || {}
    });
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="c-main-page">
        <a className="close" onClick={(e) => {e.preventDefault();onClose(false);}}><i className="iconfont iconbtn-cancelall" style={{fontSize: 30,color:'#333'}}></i></a>
        {this.state.selected ? <Order /> : <Board onSelect={this.onSelect} />}
      </div>
    );
  }
}
