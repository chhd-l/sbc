import React, { Component } from 'react';
import {
  BreadCrumb,
  SelectGroup,
  Const,
  Headline,
  history,
  AuthWrapper,
  cache,
  RCi18n
} from 'qmkit';
import { Row, Col, Tabs, Card, Breadcrumb, Button, message, Spin } from 'antd';
import PetOwner from './components/petowner';
import Pets from './components/pets';
import Tasks from './components/tasks';
import Emails from './components/emails';
import Activities from './components/activities';
import Comments from './components/comments';
import Orders from './components/order';
import Bookings from './components/subscriptions';
import { parse } from 'querystring';
import * as webapi from './webapi';
import { FormattedMessage, injectIntl } from 'react-intl';

import './style.less';

const { TabPane } = Tabs;

export default class PetOwnerActivity extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityKey: '1',
      id: this.props.match.params.id ? this.props.match.params.id : '',
      title: RCi18n({ id: 'PetOwner.PetOwneractivity' }),
      petOwner: {},
      loading: false
    };
  }

  componentDidMount() {
    const tabName = new URLSearchParams(this.props.location.search).get('tabName');
    if (tabName === 'comments') {
      this.setState({
        activityKey: '4'
      });
    }
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
    const { title, id, petOwner, loading, activityKey } = this.state;
    const hasTaskRole =
      sessionStorage.getItem(cache.LOGIN_FUNCTIONS) &&
      JSON.parse(sessionStorage.getItem(cache.LOGIN_FUNCTIONS)).includes('f_petowner_task');
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{RCi18n({ id: 'PetOwner.PetOwneractivity' })}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              {/* <Button
                shape="round"
                onClick={() => {
                  this.quickSend();
                }}
                style={{
                  borderColor: '#e2001a'
                }}
              >
                <p style={{ color: '#e2001a' }}>Quick Send</p>
              </Button> */}
              <AuthWrapper functionName="f_petowner_create_order_button">
                {petOwner.customerName && Const.SITE_NAME !== 'MYVETRECO' ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      history.push({
                        pathname: '/order-add',
                        query: {
                          customerId: id,
                          customerName: petOwner.customerName,
                          customerAccount: petOwner.customerAccount
                        }
                      })
                    }
                  >
                    {RCi18n({ id: 'PetOwner.createOrder' })}
                  </Button>
                ) : null}
              </AuthWrapper>
            </Col>
          </Row>
        </div>
        <div className="container petOwnerActivity">
          <Row gutter={10} style={{ marginBottom: '20px' }}>
            <Col span={6}>
              <Spin spinning={loading}>
                <PetOwner petOwner={petOwner} />
                <div style={{ marginTop: '20px' }}></div>
                <Pets petOwnerId={id} customerAccount={petOwner.customerAccount} />
              </Spin>
            </Col>
            <Col span={10} id="middle">
              <Card>
                <Tabs
                  defaultActiveKey={hasTaskRole ? '1' : '2'}
                  activeKey={activityKey}
                  onChange={(key) =>
                    this.setState({
                      activityKey: key
                    })
                  }
                >
                  {hasTaskRole ? (
                    <TabPane tab={RCi18n({ id: 'PetOwner.Task' })} key="1">
                      <Tasks petOwnerId={id} petOwner={petOwner} />
                    </TabPane>
                  ) : null}
                  <TabPane tab={RCi18n({ id: 'PetOwner.Emails' })} key="2">
                    <Emails petOwnerId={id} petOwner={petOwner} />
                  </TabPane>
                  <TabPane tab={RCi18n({ id: 'PetOwner.Activities' })} key="3">
                    {activityKey === '3' ? (
                      <Activities petOwnerId={id} petOwner={petOwner} />
                    ) : null}
                  </TabPane>
                  <TabPane tab={RCi18n({ id: 'PetOwner.Comments' })} key="4">
                    <Comments petOwnerId={id} petOwner={petOwner} />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            {petOwner.email ? (
              <Col span={8}>
                <Orders petOwnerId={id} />
                <div style={{ marginTop: '20px' }}></div>
                <Bookings customerAccount={petOwner.customerAccount} />
              </Col>
            ) : null}
          </Row>
        </div>
      </div>
    );
  }
}
