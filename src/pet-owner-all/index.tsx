import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Row, Col, Tabs, Form } from 'antd';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
export default class PetOwnerAll extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      contactId: this.props.match.params.id,
      title: 'View All Properties',
      contactDetails: {
        activated: '2020-07-21 11:25:54',
        appartmentNo: '',
        city: 'paris',
        countryCode: 'FR',
        created: '2020-07-21 11:25:52',
        dateAdded: '2020-07-31',
        district: '',
        email: 'morgane.lucas1@ibm.com',
        emailVerified: true,
        entranceNo: '',
        firstName: 'Morgane',
        house: '',
        housing: '',
        id: 229,
        isClub: true,
        lastLogin: '2020-12-03',
        lastName: 'Lucas',
        lastUpdated: '2020-12-03',
        locale: 'ru_RU',
        login: 'morgane.lucas1@ibm.com',
        optInEmail: true,
        optInMobile: false,
        optInPrint: false,
        optInStatus: false,
        passwordChanged: '2020-07-21 11:25:53',
        preferredChannel: '',
        primaryPhone: '(+33) 6 43 21 34 44',
        region: '',
        status: 'ACTIVE',
        statusChanged: '2020-07-21 11:25:54',
        streetAddress: '13 rue pouettepouette',
        streetAddress2: 'qq',
        tenantId: 4,
        uuid: '00uod83hrdUTgu6il0x6',
        zipCode: '1234'
      }
    };
  }
  render() {
    const { title, contactDetails } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container">
          <Tabs>
            <TabPane tab="Core" key="1">
              <Row type="flex" justify="start">
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Pet Owner ID">
                    <div>{contactDetails.uuid}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="First Name">
                    <div>{contactDetails.firstName}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Last Name">
                    <div>{contactDetails.lastName}</div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Birthday">
                    <div>{contactDetails.birthday}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Email">
                    <div>{contactDetails.email}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Email Verified">
                    <div>{contactDetails.emailVerified}</div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Pet Owner ID">
                    <div>{contactDetails.uuid}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="First Name">
                    <div>{contactDetails.firstName}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Last Name">
                    <div>{contactDetails.lastName}</div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">

                <Col span={8}>
                  <FormItem {...formItemLayout} label="Language">
                    <div>{contactDetails.language}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Phone">
                    <div>{contactDetails.phone}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="Mobile">
                    <div>{contactDetails.mobile}</div>
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Location" key="2"></TabPane>
            <TabPane tab="Segments" key="3"></TabPane>
            <TabPane tab="Communication" key="4"></TabPane>
            <TabPane tab="Club Member Service List" key="5"></TabPane>
            <TabPane tab="Feedback" key="6"></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
