import React from 'react';
import { Row, Col, Table, Breadcrumb, Button, Modal } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import EditModal from './components/edit-modal';

export default class LandingPageDetail extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      landingPage: {}
    };
  }

  render() {
    const columns = [
      {
        title: 'Pet owner account'
      },
      {
        title: 'Pet owner name'
      },
      {
        title: 'Pet owner type'
      },
      {
        title: 'Email'
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Landing page details</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title="Landing page details" />
          <Row gutter={[24, 12]}>
            <Col span={16}>
              <div style={{backgroundColor:'#fafafa',padding:10}}>
                <div style={{marginBottom: 10}}><strong>Basic info</strong></div>
                <Row>
                  <Col span={12}>Landing page ID:</Col>
                  <Col span={12}>Creation date:</Col>
                </Row>
              </div>
            </Col>
            <Col span={8}>
              <div style={{backgroundColor:'#fafafa',padding:10}}>
                <div style={{marginBottom: 10}}><strong>KPI</strong></div>
                <Row>
                  <Col span={12}>Views:</Col>
                  <Col span={12}>Clicks:</Col>
                </Row>
              </div>
            </Col>
            <Col span={16}>
              <div style={{backgroundColor:'#fafafa',padding:10}}>
                <div style={{marginBottom: 10}}><strong>Landing page content</strong></div>
                <div>Title:</div>
                <div>Description:</div>
                <div>State:</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="container-search">
          <Headline title="Responder list" />
          <Table rowKey="id" columns={columns} dataSource={[]} />
        </div>
        <div className="bar-button">
          <EditModal />
          <Button style={{marginLeft: 10}}>Back</Button>
        </div>
      </div>
    );
  }
};
