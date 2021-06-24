import React, { Component } from 'react';
import { history, Const, RCi18n } from 'qmkit';
import { Card, Icon, Row, Col, Pagination, message, Empty, Tooltip } from 'antd';
const cat = require('../components/image/cat.png');
const catFemale = require('../components/image/cat2.png');
const dog = require('../components/image/dog.png');
const dogFemale = require('../components/image/dog2.png');
import * as webapi from '../webapi';
import { FormattedMessage, injectIntl } from 'react-intl';
import { parseInt } from 'lodash';

export default class pets extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      petList: [],
      petPagination: {
        total: 0,
        current: 1,
        pageSize: 1
      }
    };
    this.getPetAgeString = this.getPetAgeString.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.getPetList = this.getPetList.bind(this);
  }

  componentDidMount() {
    this.getPetList();
  }

  getPetAgeString(item) {
    let ageString = '';
    let petAgeYear = item.petAgeYear ? parseInt(item.petAgeYear) : 0;
    let petAgeMonth = item.petAgeMonth ? parseInt(item.petAgeMonth) : 0;
    if (petAgeYear < 1 && petAgeMonth <= 1) {
      ageString = petAgeMonth + ' Month';
    } else if (petAgeYear < 1 && petAgeMonth > 1) {
      ageString = petAgeMonth + ' Months';
    } else if (petAgeYear === 1 && petAgeMonth < 1) {
      ageString = petAgeYear + ' Year';
    } else if (petAgeYear > 1 && petAgeMonth < 1) {
      ageString = petAgeYear + ' Years';
    } else if (petAgeYear === 1 && petAgeMonth === 1) {
      ageString = petAgeYear + ' Year ' + petAgeMonth + ' Month';
    } else if (petAgeYear === 1 && petAgeMonth > 1) {
      ageString = petAgeYear + ' Year ' + petAgeMonth + ' Months';
    } else if (petAgeYear > 1 && petAgeMonth > 1) {
      ageString = petAgeYear + ' Years ' + petAgeMonth + ' Months';
    }
    return ageString;
  }
  pageChange(current, pageSize) {
    this.setState(
      {
        petPagination: {
          pageSize: pageSize,
          current: current
        }
      },
      () => this.getPetList()
    );
  }

  getPetList() {
    const { petPagination } = this.state;
    let params = {
      pageNum: petPagination.current - 1,
      pageSize: petPagination.pageSize,
      customerId: this.props.petOwnerId
    };
    this.setState({
      loading: true
    });
    webapi
      .getPetList(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          petPagination.total = res.context.total;
          this.setState({
            petList: res.context.customerPets ? res.context.customerPets : [],
            loading: false,
            petPagination: petPagination
          });
        } else {
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
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
  render() {
    const { petOwnerId, customerAccount } = this.props;
    const { petList, petPagination, loading } = this.state;
    petList.map((item) => {
      if (item.petsType === 'dog' && (item.genderCode === 'male' || item.genderCode === 'other')) {
        item.defaultPhoto = dog;
      }
      if (item.petsType === 'dog' && item.genderCode === 'female') {
        item.defaultPhoto = dogFemale;
      }
      if (item.petsType === 'cat' && (item.genderCode === 'male' || item.genderCode === 'other')) {
        item.defaultPhoto = cat;
      }
      if (item.petsType === 'cat' && item.genderCode === 'female') {
        item.defaultPhoto = catFemale;
      }
      if (!item.petsType || !item.genderCode) {
        item.defaultPhoto = dog;
      }
    });
    return (
      <div>
        <Card
          loading={loading}
          className="topCard"
          title={
            <div className="title">
              <span>{RCi18n({ id: 'PetOwner.Pets' })}</span>
              <span
                className="viewAll"
                onClick={() =>
                  history.push({
                    pathname: `/petowner-details/${petOwnerId}/${customerAccount}`,
                    query: { hash: 'pets-list' }
                  })
                }
              >
                {RCi18n({ id: 'PetOwner.ViewAll' })}
                <Icon type="right" />
              </span>
            </div>
          }
        >
          <div>
            {petList.map((item, index) => (
              <Row
                type="flex"
                justify="space-between"
                align="middle"
                key={index}
                className="pet-panel"
              >
                <Row type="flex" align="middle" className="ui-row-detail userBase">
                  <Row
                    className="avatar-box"
                    type="flex"
                    justify="center"
                    align="middle"
                    style={{ borderRight: '1px solid #CED3DA' }}
                  >
                    {item.photo ? (
                      <img src={item.photo} />
                    ) : (
                      <img className="icon-default" src={item.defaultPhoto} />
                    )}
                    {item.subscriptionList && item.subscriptionList.length > 0 ? (
                      <span
                        style={{ color: '#e2001a' }}
                        className="icon iconfont iconhuangguan inclub"
                      />
                    ) : null}
                  </Row>
                  <div className="detail-content" style={{ width: '60%' }}>
                    <div>
                      <span className="contactName">{item.petsName}</span>
                    </div>
                    <span className="ui-lighter">
                      {RCi18n({ id: 'PetOwner.ID' })}:
                      <span className="content">
                        <Tooltip
                          overlayStyle={{
                            overflowY: 'auto'
                          }}
                          placement="bottomLeft"
                          title={<div> {item.petSourceId}</div>}
                        >
                          <p style={styles.text}> {item.petSourceId}</p>
                        </Tooltip>
                      </span>
                    </span>
                  </div>
                </Row>
                <Row type="flex" className="ui-row-detail">
                  <span className="icon iconfont iconbirthday1" />
                  <div className="detail-content">
                    <Row>
                      <Col span={6}>
                        <span className="ui-lighter">{RCi18n({ id: 'PetOwner.Age' })}</span>
                      </Col>
                      <Col span={18}>
                        <span className="content">{this.getPetAgeString(item)}</span>
                      </Col>
                    </Row>
                  </div>
                </Row>
                <br />
                <Row type="flex" className="ui-row-detail">
                  <span className="icon iconfont iconbreed" />
                  <div className="detail-content">
                    <Row>
                      <Col span={6}>
                        <span className="ui-lighter">{RCi18n({ id: 'PetOwner.Breed' })}</span>
                      </Col>
                      <Col span={18}>
                        <span className="content">
                          <Tooltip
                            overlayStyle={{
                              overflowY: 'auto'
                            }}
                            placement="bottomLeft"
                            title={<div> {item.petsBreed}</div>}
                          >
                            <p style={styles.text}> {item.petsBreed}</p>
                          </Tooltip>
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Row>
                <br />
                <Row type="flex" className="ui-row-detail">
                  <span className="icon iconfont iconclub" />
                  <div className="detail-content">
                    <Row>
                      <Col span={6}>
                        <span className="ui-lighter">{RCi18n({ id: 'PetOwner.Club' })}</span>
                      </Col>
                      <Col span={18}>
                        <span className="content">
                          <Tooltip
                            overlayStyle={{
                              overflowY: 'auto'
                            }}
                            placement="bottomLeft"
                            title={
                              <div>
                                {item.subscriptionList && item.subscriptionList.length > 0
                                  ? item.subscriptionList.map((x) => x.subscribeId).join(',')
                                  : 'No Subscription'}
                              </div>
                            }
                          >
                            <p style={styles.text}>
                              {item.subscriptionList && item.subscriptionList.length > 0
                                ? item.subscriptionList.map((x) => x.subscribeId).join(',')
                                : 'No Subscription'}
                            </p>
                          </Tooltip>
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </Row>
            ))}
            {petList.length > 0 ? (
              <Pagination
                style={{ top: '331px' }}
                onChange={this.pageChange}
                current={petPagination.current}
                total={petPagination.total}
                pageSize={petPagination.pageSize}
                size="small"
              />
            ) : null}
            {petList.length === 0 ? <Empty /> : null}
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
    whiteSpace: 'nowrap',
    width: 170,
    display: 'inline-block'
  }
};
