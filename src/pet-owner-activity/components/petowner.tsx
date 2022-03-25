import React, { Component } from 'react';
import { history, Const, RCi18n } from 'qmkit';
import { Card, Icon, Row, Col, message, Tooltip } from 'antd';
import * as webapi from '../webapi';
import { FormattedMessage, injectIntl } from 'react-intl';

export default class petowner extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      allocatedTaggings: []
    };
  }
  render() {
    const { petOwnerId, petOwner } = this.props;
    return (
      <div>
        <Card
          className="topCard"
          title={
            <div className="title">
              <span>{RCi18n({id:'PetOwner.PetOwnerOverview'})}</span>
              <span className="viewAll" onClick={() => history.push(`/petowner-details/${petOwner.customerId}/${petOwner.customerAccount}`)}>
                {RCi18n({id:'PetOwner.ViewAll'})}
                <Icon type="right" />
              </span>
            </div>
          }
        >
          <Row type="flex" align="middle" className="ui-row-detail userBase">
            <div className="detail-content" style={{ width: '100%' }}>
              <div>
                <span className="contactName">{petOwner.customerName}</span>
              </div>
              <span className="ui-lighter">
                <span>{RCi18n({id:'PetOwner.Account'})}: {petOwner.customerAccount}</span>
              </span>
            </div>
          </Row>
          <div style={{display:'flex', flexWrap:'nowrap', paddingLeft: 10}}>
            <span className="icon iconfont iconposition" />
            <div style={{marginLeft: 10}}>{RCi18n({id:'PetOwner.Location'})}:</div>
            <div style={{flex: 'auto', overflow: 'hidden', marginLeft: 10}}>
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                }}
                placement="bottomLeft"
                title={
                  <div>
                    {petOwner.city} {petOwner.country ? (', ' + petOwner.country) : ''}
                  </div>
                }
              >
                <p style={styles.text}>
                  {petOwner.city} {petOwner.country ? (', ' + petOwner.country) : ''}
                </p>
              </Tooltip>
            </div>
          </div>
          <br />
          <div style={{display:'flex', flexWrap:'nowrap', paddingLeft: 10}}>
            <span className="icon iconfont iconEmail" />
            <div style={{marginLeft: 10}}>{RCi18n({id:'PetOwner.Email'})}:</div>
            <div style={{flex: 'auto', overflow: 'hidden', marginLeft: 10}}>
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                }}
                placement="bottomLeft"
                title={<div> {petOwner.email}</div>}
              >
                <p style={styles.text}> {petOwner.email}</p>
              </Tooltip>
            </div>
          </div>
          <br />
          <div style={{display:'flex', flexWrap:'nowrap', paddingLeft: 10}}>
            <span className="icon iconfont iconPhone" />
            <div style={{marginLeft: 10}}>{RCi18n({id:'PetOwner.Phone'})}:</div>
            <div style={{flex: 'auto', overflow: 'hidden', marginLeft: 10}}>
              {petOwner.contactPhone}
            </div>
          </div>
          <br />
          <div style={{display:'flex', flexWrap:'nowrap', paddingLeft: 10}}>
            <span className="icon iconfont iconsegments" />
            <div style={{marginLeft: 10}}>{RCi18n({id:'PetOwner.Taggings'})}:</div>
            <div style={{flex: 'auto', overflow: 'hidden', marginLeft: 10}}>
              {petOwner.segmentList &&
                petOwner.segmentList.map((item) => (
                  <div className="segment-item" key={item.id}>
                    {item.name}
                  </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
const styles = {
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
