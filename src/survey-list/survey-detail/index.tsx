import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col,Table } from 'antd'
import { FormattedMessage } from 'react-intl'
import { BreadCrumb, Headline, history } from 'qmkit'
import './index.less'

const responderListColumns = [{
  title: <FormattedMessage id="Survey.pet_owner_account" />,
  dataIndex: 'customerAccount',
  key: 'customerAccount',
},{
  title: <FormattedMessage id="Survey.pet_owner_name" />,
  dataIndex: 'contactName',
  key: 'contactName',
},{
  title: <FormattedMessage id="Survey.pet_owner_type" />,
  dataIndex: 'customerLevelName',
  key: 'customerLevelName',
},{
  title: <FormattedMessage id="Survey.email" />,
  dataIndex: 'email',
  key: 'email',
},]

const SurveyDetail = () => {

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title={<FormattedMessage id="Survey.survey_detail" />} />
        <Row>
          <Col span={16}>
            <div className="survey-detail-info-block">
              <h3><FormattedMessage id="Survey.basic_info" /></h3>
              <Row>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.survey_number" />:</span>&nbsp;
                    <span>SUR0001</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.survey_date" />:</span>&nbsp;
                    <span>2012-11-20</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col offset={1} span={7}>
            <div className="survey-detail-info-block">
              <h3><FormattedMessage id="Survey.kpi" /></h3>
              <Row>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.views" />:</span>&nbsp;
                    <span>123</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.clicks" />:</span>&nbsp;
                    <span>200</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="survey-content-warp">
          <Col span={16}>
            <div className="survey-detail-info-block">
              <h3><FormattedMessage id="Survey.survey_content" /></h3>
              <p>
                <span><FormattedMessage id="Survey.survey_title" />:</span>&nbsp;
                <span>title123</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.survey_description" />:</span>&nbsp;
                <span>descriptiondescriptiondescriptiondescription descriptiondescriptiondescriptiondescriptiondescription</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.survey_label" />:</span>&nbsp;
                <span>labellabellabellabel</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.status" />:</span>&nbsp;
                <span>active</span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <div className="container">
        <Headline title={<FormattedMessage id="Survey.responder_list" />} />
        <Table
      rowKey="responderListId"
      // loading={loading}
      // dataSource={listData}
      columns={responderListColumns}
    />
      </div>
      <div className="bar-button">
            <Button className="new-survey-save-btn" type="primary" >
              <FormattedMessage id="edit" />
            </Button>
            <Button >
              <FormattedMessage id="back" />
            </Button>
          </div>
    </div>
  )
}
export default SurveyDetail