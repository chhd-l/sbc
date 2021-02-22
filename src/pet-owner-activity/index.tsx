import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Row, Col, Tabs, Card } from 'antd';
import PetOwner from './components/petowner';
import Pets from './components/pets';
import Tasks from './components/tasks';
import Emails from './components/emails';
import Activities from './components/activities';
import Orders from './components/orders';
import Bookings from './components/bookings';

import './style.less';

const { TabPane } = Tabs;

export default class PetOwnerActivity extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityKey: '1',
      id: this.props.match.params.id,
      title: 'Pet Owner activity'
    };
  }
  render() {
    const { title, id } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container petOwnerActivity">
          <Row gutter={10} style={{ marginBottom: '20px' }}>
            <Col span={7}>
              <PetOwner contactId={id} />
              <div style={{ marginTop: '20px' }}></div>
              <Pets contactId={id} />
            </Col>
            <Col span={9} id="task">
              <Card>
                <Tabs
                  defaultActiveKey="1"
                  onChange={(key) =>
                    this.setState({
                      activityKey: key
                    })
                  }
                >
                  <TabPane tab="Task" key="1">
                    <Tasks contactId={id} />
                  </TabPane>
                  <TabPane tab="Emails" key="2">
                    <Emails contactId={id} />
                  </TabPane>
                  <TabPane tab="Activities" key="3">
                    <Activities contactId={id} />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            <Col span={8}>
              <Orders contactId={id} />
              <div style={{ marginTop: '20px' }}></div>
              <Bookings contactId={id} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
