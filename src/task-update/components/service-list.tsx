import { Row } from 'antd';
import React, { Component } from 'react';

export default class ServiceList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { goldenMomentList, goldenMoment } = this.props;
    let selectGoldenMoment = goldenMomentList.find((x) => x.value === goldenMoment);
    let goldenMomentMemo = selectGoldenMoment && selectGoldenMoment.description.split(';');
    return (
      <Row className="panel">
        {goldenMomentMemo && goldenMomentMemo.length > 0 ? (
          <ul className="memo taskMemo" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
            {goldenMomentMemo.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Row>
    );
  }
}
