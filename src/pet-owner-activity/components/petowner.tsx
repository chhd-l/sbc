import React, { Component } from 'react';
import { history, Const } from 'qmkit';
import { Card, Icon, Row, Col, message } from 'antd';
import * as webapi from '../webapi';

export default class petowner extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contactDetails: {
        email: 'morgane.lucas1@ibm.com',
        firstName: 'Morgane',
        lastName: 'Lucas',
        uuid: '00uod83hrdUTgu6il0x6',
        primaryPhone: '(+33) 6 43 21 34 44',
        city: 'paris',
        countryCode: 'FR'
      },
      allocatedSegments: [
        {
          id: 216,
          isPublished: true,
          name: 'cxcx'
        },
        {
          id: 221,
          isPublished: true,
          name: 'Cute'
        },
        {
          id: 216,
          isPublished: true,
          name: 'cxcxsssssssssssssss'
        },
        {
          id: 221,
          isPublished: true,
          name: 'Cutedddddddddddddddddddddd'
        }
      ]
    };
  }

  componentDidMount() {
    this.getPetOwner();
  }

  getPetOwner() {
    this.setState({
      loading: true
    });
    webapi
      .getPetOwner(this.props.petOwnerId)
      .then((data) => {
        this.setState({
          contactDetails: data,
          loading: false
        });
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          loading: false
        });
      });
  }
  render() {
    const { contactDetails, allocatedSegments } = this.state;
    const { petOwnerId } = this.props;
    return (
      <div>
        <Card
          className="topCard"
          title={
            <div className="title">
              <span>About This Pet Owner</span>
              <span className="viewAll" onClick={() => history.push(`/customer-details/Member/${petOwnerId}/${contactDetails.customerVO.customerAccount}` + petOwnerId)}>
                View All
                <Icon type="right" />
              </span>
            </div>
          }
        >
          <Row type="flex" align="middle" className="ui-row-detail userBase">
            <div className="detail-content" style={{ width: '100%' }}>
              <div>
                <span className="contactName">{contactDetails.firstName + ' ' + contactDetails.lastName}</span>
              </div>
              <span className="ui-lighter">
                <span style={{ whiteSpace: 'break-spaces' }}>Pet Owner ID</span>:<span className="content">{contactDetails.uuid}</span>
              </span>
            </div>
          </Row>
          <Row type="flex" className="ui-row-detail">
            <span className="icon iconfont iconposition" />
            <div className="detail-content">
              <Row>
                <Col span={6}>
                  <span className="ui-lighter">Location</span>
                </Col>
                <Col span={18}>
                  <span className="content">
                    {contactDetails.city} , {contactDetails.countryCode}
                  </span>
                </Col>
              </Row>
            </div>
          </Row>
          <br />
          <Row type="flex" className="ui-row-detail">
            <span className="icon iconfont iconEmail" />
            <div className="detail-content">
              <Row>
                <Col span={6}>
                  <span className="ui-lighter">Email</span>
                </Col>
                <Col span={18}>
                  <span className="content">{contactDetails.email}</span>
                </Col>
              </Row>
            </div>
          </Row>
          <br />
          <Row type="flex" className="ui-row-detail">
            <span className="icon iconfont iconPhone" />
            <div className="detail-content">
              <Row>
                <Col span={6}>
                  <span className="ui-lighter">Phone</span>
                </Col>
                <Col span={18}>
                  <span className="content">{contactDetails.primaryPhone}</span>
                </Col>
              </Row>
            </div>
          </Row>
          <br />
          <Row type="flex" className="ui-row-detail">
            <span className="icon iconfont iconsegments" />
            <div className="detail-content">
              <Row>
                <Col span={6}>
                  <span className="ui-lighter">Segments</span>
                </Col>
                <Col span={18}>
                  <div className="contactSegments">
                    {allocatedSegments.map((item) => (
                      <div className="segment-item" key={item.id}>
                        {item.name}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Card>
      </div>
    );
  }
}
