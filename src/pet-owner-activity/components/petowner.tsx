import React, { Component } from 'react';
import { history, Const } from 'qmkit';
import { Card, Icon, Row, Col, message, Tooltip } from 'antd';
import * as webapi from '../webapi';

export default class petowner extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
  }
  render() {
    const { allocatedSegments } = this.state;
    const { petOwnerId, petOwner } = this.props;
    return (
      <div>
        <Card
          className="topCard"
          title={
            <div className="title">
              <span>Pet Owner Overview</span>
              <span className="viewAll" onClick={() => history.push(`/customer-details/Member/${petOwner.customerId}/${petOwner.customerVO.customerAccount}` + petOwnerId)}>
                View All
                <Icon type="right" />
              </span>
            </div>
          }
        >
          <Row type="flex" align="middle" className="ui-row-detail userBase">
            <div className="detail-content" style={{ width: '100%' }}>
              <div>
                <span className="contactName">{petOwner.contactName}</span>
              </div>
              <span className="ui-lighter">
                <span style={{ whiteSpace: 'break-spaces' }}>Pet Owner ID</span>:<span className="content">{petOwner.customerId}</span>
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
                    {petOwner.city} , {petOwner.country}
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
                  <span className="content">
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div> {petOwner.email}</div>}
                    >
                      <p style={styles.text}> {petOwner.email}</p>
                    </Tooltip>
                  </span>
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
                  <span className="content">{petOwner.primaryPhone}</span>
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
const styles = {
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 200,
    display: 'inline-block'
  }
};
