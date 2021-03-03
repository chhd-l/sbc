import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, history } from 'qmkit';
import { Row, Col, Tabs, Card, Breadcrumb, Button, message, Spin } from 'antd';
import PetOwner from './components/petowner';
import Pets from './components/pets';
import Tasks from './components/tasks';
import Emails from './components/emails';
import Activities from './components/activities';
import Orders from './components/order';
import Bookings from './components/subscriptions';
import * as webapi from './webapi';

import './style.less';

const { TabPane } = Tabs;

export default class PetOwnerActivity extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityKey: '1',
      id: this.props.match.params.id ? this.props.match.params.id : '',
      title: 'Pet Owner activity',
      petOwner: {},
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    webapi
      .getPetOwner(this.state.id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            petOwner: res.context,
            loading: false
          });
        } else {
          message.error('Get data failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          loading: false
        });
      });
  }

  quickSend = () => {
    history.push({
      pathname: '/message-quick-send'
    });
  };
  render() {
    const { title, id, petOwner, loading } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Pet Owner Activity</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button
                shape="round"
                onClick={() => {
                  this.quickSend();
                }}
                style={{
                  borderColor: '#e2001a'
                }}
              >
                <p style={{ color: '#e2001a' }}>Quick Send</p>
              </Button>
            </Col>
          </Row>
        </div>
        <div className="container petOwnerActivity">
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <Row gutter={10} style={{ marginBottom: '20px' }}>
              <Col span={7}>
                <PetOwner petOwner={petOwner} />
                <div style={{ marginTop: '20px' }}></div>
                <Pets petOwnerId={id} />
              </Col>
              <Col span={9} id="middle">
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
                      <Tasks petOwnerId={id} />
                    </TabPane>
                    <TabPane tab="Emails" key="2">
                      <Emails petOwnerId={id} />
                    </TabPane>
                    <TabPane tab="Activities" key="3">
                      <Activities petOwnerId={id} />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
              {petOwner.email ? (
                <Col span={8}>
                  <Orders customerAccount={petOwner.email} />
                  <div style={{ marginTop: '20px' }}></div>
                  <Bookings customerAccount={petOwner.email} />
                  {/* todo email */}
                </Col>
              ) : null}
            </Row>
          </Spin>
        </div>
      </div>
    );
  }
}
