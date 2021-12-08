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
        activated: undefined,
        appartmentNo: undefined,
        city: undefined,
        countryCode: undefined,
        created: undefined,
        dateAdded: undefined,
        district: undefined,
        email: undefined,
        emailVerified: true,
        entranceNo: undefined,
        firstName: undefined,
        house: undefined,
        housing: undefined,
        id: undefined,
        isClub: true,
        lastLogin: null,
        lastName: '',
        lastUpdated: null,
        locale: undefined,
        login: undefined,
        optInEmail: true,
        optInMobile: false,
        optInPrint: false,
        optInStatus: false,
        passwordChanged: undefined,
        preferredChannel: undefined,
        primaryPhone: undefined,
        region: undefined,
        status: undefined,
        statusChanged: undefined,
        streetAddress: undefined,
        streetAddress2: undefined,
        tenantId: undefined,
        uuid: undefined,
        zipCode: undefined
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
