import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

import { FormattedMessage } from 'react-intl';

let ins = null;

export default class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      time: moment().format('DD/MM/YYYY HH:mm:ss')
    };
  }

  componentDidMount() {
    ins = setInterval(this.start, 1000);
  }

  componentWillUnmount() {
    clearInterval(ins);
  }

  start = () => {
    this.setState({
      time: moment().format('DD/MM/YYYY HH:mm:ss')
    });
  }

  render() {
    return (
      <Row type="flex" justify="space-between" className="c-head">
        <Col><FormattedMessage id="Order.offline.offlineStore" />: <FormattedMessage id="Order.offline.felin" /></Col>
        <Col>{this.state.time}</Col>
      </Row>
    );
  }
}
