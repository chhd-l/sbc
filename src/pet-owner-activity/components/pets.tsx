import React, { Component } from 'react';
import { history } from 'qmkit';
import { Card, Icon, Row, Col } from 'antd';

export default class pets extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { id } = this.props;
    return (
      <div>
        <Card
          title={
            <div className="title">
              <span>Pets</span>
              <span className="viewAll" onClick={() => history.push('/pet-all/' + id)}>
                View All
                <Icon type="right" />
              </span>
            </div>
          }
        ></Card>
      </div>
    );
  }
}
