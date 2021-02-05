import React, { Component } from 'react';
import { history, Const } from 'qmkit';
import { Card, Icon, Row, Col, Pagination, message } from 'antd';
const cat = require('../components/image/cat.png');
const catFemale = require('../components/image/cat2.png');
const dog = require('../components/image/dog.png');
const dogFemale = require('../components/image/dog2.png');
import * as webapi from '../webapi';

export default class pets extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      petList: [
        {
          birthday: '2019-02-01',
          breedCode: 'mixed_breed',
          clubStatus: false,
          contactId: 256,
          createdAt: '2020-10-28',
          currentWeight: '4kg',
          dateAdded: '2020-10-28',
          dateModified: '2020-10-28',
          gender: 'female',
          id: 29739,
          isPurebred: true,
          lastPetStatus: '10',
          lifestyle: 'outdoor',
          maineCoon: false,
          name: 'Tiruy',
          needs: '[{"name":"Özel ihtiyacı yok"}]',
          ownerId: '00uoe3flxDuU6H1EN0x6',
          petActivityCode: 'moderate',
          petAge: 24,
          petAgeMonth: 0,
          petAgeYear: 2,
          petId: 'a3ec2942-37b8-4144-ac2b-0e54c1341cba',
          sensitivity: 'false',
          sterillizationStatus: false,
          tenantId: 6,
          updatedAt: '2020-10-28 17:21:46',
          weightCategory: ''
        }
      ],
      petPagination: {
        total: 1,
        current: 1,
        pageSize: 1
      }
    };
    this.getPetAgeString = this.getPetAgeString.bind(this);
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.getPetList = this.getPetList.bind(this);
  }

  componentDidMount() {
    this.getPetList();
  }

  getPetAgeString(item) {
    let ageString = '';
    if (item.petAgeYear < 1 && item.petAgeMonth === 1) {
      ageString = item.petAgeMonth + ' Month';
    } else if (item.petAgeYear < 1 && item.petAgeMonth > 1) {
      ageString = item.petAgeMonth + ' Months';
    } else if (item.petAgeYear === 1 && item.petAgeMonth < 1) {
      ageString = item.petAgeYear + ' Year';
    } else if (item.petAgeYear > 1 && item.petAgeMonth < 1) {
      ageString = item.petAgeYear + ' Years';
    } else if (item.petAgeYear === 1 && item.petAgeMonth === 1) {
      ageString = item.petAgeYear + ' Year ' + item.petAgeMonth + ' Month';
    } else if (item.petAgeYear === 1 && item.petAgeMonth > 1) {
      ageString = item.petAgeYear + ' Year ' + item.petAgeMonth + ' Months';
    } else if (item.petAgeYear > 1 && item.petAgeMonth > 1) {
      ageString = item.petAgeYear + ' Years ' + item.petAgeMonth + ' Months';
    }
    return ageString;
  }
  onShowSizeChange(current, pageSize) {
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
    this.setState({
      loading: true
    });
    webapi
      .getPetList()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            petList: res.context,
            loading: false
          });
        } else {
          message.error(res.message || 'Get data failed');
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
    const { id } = this.props;
    const { petList, petPagination, loading } = this.state;
    petList.map((item) => {
      if (item.speciesCode === 'dog' && (item.gender === 'male' || item.gender === 'other')) {
        item.defaultPhoto = dog;
      }
      if (item.speciesCode === 'dog' && item.gender === 'female') {
        item.defaultPhoto = dogFemale;
      }
      if (item.speciesCode === 'cat' && (item.gender === 'male' || item.gender === 'other')) {
        item.defaultPhoto = cat;
      }
      if (item.speciesCode === 'cat' && item.gender === 'female') {
        item.defaultPhoto = catFemale;
      }
      if (!item.speciesCode || !item.gender) {
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
              <span>Pets</span>
              <span className="viewAll" onClick={() => history.push('/pet-all/' + id)}>
                View All
                <Icon type="right" />
              </span>
            </div>
          }
        >
          {petList.map((item, index) => (
            <Row type="flex" justify="space-between" align="middle" key={index} className="pet-panel">
              <Row type="flex" align="middle" className="ui-row-detail userBase">
                <Row className="avatar-box" type="flex" justify="center" align="middle" style={{ borderRight: '1px solid #CED3DA' }}>
                  {item.photo ? <img src={item.photo} /> : <img className="icon-default" src={item.defaultPhoto} />}
                  <span style={{ color: '#e2001a' }} v-if="item.clubStatus" className="icon iconfont iconhuangguan inclub" />
                </Row>
                <div className="detail-content">
                  <div>
                    <span className="contactName">{item.name}</span>
                  </div>
                  <span className="ui-lighter">
                    ID:
                    <span className="content"> {item.petId || '&nbsp;'}</span>
                  </span>
                </div>
              </Row>
              <Row type="flex" className="ui-row-detail">
                <span className="icon iconfont iconbirthday1" />
                <div className="detail-content">
                  <Row>
                    <Col span={6}>
                      <span className="ui-lighter">Age</span>
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
                      <span className="ui-lighter">Breed</span>
                    </Col>
                    <Col span={18}>
                      <span className="content">{item.breedCode}</span>
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
                      <span className="ui-lighter">Club</span>
                    </Col>
                    <Col span={18}>
                      <span className="content">{item.clubStatu ? item.club : 'No Subscription'}</span>
                    </Col>
                  </Row>
                </div>
              </Row>
            </Row>
          ))}
          <Row type="flex" justify="end">
            {petList && petList.length > 0 ? <Pagination onShowSizeChange={this.onShowSizeChange} total={petPagination.total} pageSize={petPagination.pageSize} size="small" /> : null}
          </Row>
        </Card>
      </div>
    );
  }
}
