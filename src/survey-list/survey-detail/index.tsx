import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Table, message,Spin } from 'antd'
import { FormattedMessage } from 'react-intl'
import { BreadCrumb, Headline, history, Const } from 'qmkit'
import { useParams } from 'react-router-dom'
import * as webapi from '../webapi'
import NewSurveyModal from '../component/new-survey-modal'
import './index.less'

const responderListColumns = [{
  title: <FormattedMessage id="Survey.pet_owner_account" />,
  dataIndex: 'customerAccount',
  key: 'customerAccount',
}, {
  title: <FormattedMessage id="Survey.pet_owner_name" />,
  dataIndex: 'contactName',
  key: 'contactName',
}, {
  title: <FormattedMessage id="Survey.pet_owner_type" />,
  dataIndex: 'customerLevelName',
  key: 'customerLevelName',
}, {
  title: <FormattedMessage id="Survey.email" />,
  dataIndex: 'email',
  key: 'email',
},]

const SurveyDetail = () => {
  const [detailData, setDetailData] = useState({})
  const [responderListData, setResponderListData] = useState([])
  const [editSurveyModal, setEditSurveyModal] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [activeStatus, setActiveStatus] = useState('')
  const [modalConfirmLoading,setModalConfirmLoading] = useState(false)
  const [responderListLoading,setResponderListLoading] = useState(false)
  const [responderPagination,setResponderPagination] = useState({
    current:1,
    pageSize: 10,
    total: 0
  })

  const { id } = useParams()
  useEffect(() => {
    getSurveyDetail(id)
    getSurveyResponderList({
      id,
      pageNum: 0,
      pageSize: 10
    })
  }, [])

  const getSurveyDetail = async (id) => {
    try {
      setPageLoading(true)
      const { res } = await webapi.surveyDetail(id)
      if (res.code === Const.SUCCESS_CODE) {
        const detailData = res.context || {}
        let _status = ''
        if (detailData.status === 0) {
          _status = 'inactive'
        } else if (detailData.status === 1) {
          _status = 'active'
        }
        setActiveStatus(_status)
        setDetailData(detailData)

      }

      setPageLoading(false)
    } catch (err) {

    }
  }

  const getSurveyResponderList = async (params) => {
    try {
      setResponderListLoading(true)
      const { res } = await webapi.surveyResponderList(params)
      if (res.code === Const.SUCCESS_CODE) {
        const responderListData = res.context.content || []
        setResponderListData(responderListData)
        setResponderPagination(Object.assign(responderPagination,{
            current: res.context.number +1,
            total: res.context.totalElements
        }))
      }
      setResponderListLoading(false)
    } catch (err) {

    }
  }

  const goBack = () => {
    history.push('/survey-list')
  }

  const editSurveyContent = () => {
    setEditSurveyModal(true)
  }

  const handleCancelModal = () => {
    setEditSurveyModal(false)
  }

  const saveSurveyContent = (data) => {
    const param = {
      ...data,
      id,
    }
    updateSurveyDetail(param)
  }

  const updateSurveyDetail = async (params) => {
    try {
      setModalConfirmLoading(true)
      const { res } = await webapi.updateSurvey(params)
      if (res.code === Const.SUCCESS_CODE) {
        setEditSurveyModal(false)
        message.success(res.message)
        getSurveyDetail(id)
      }
      setModalConfirmLoading(false)
    } catch (err) {

    }
  }

  const handlePagination = (pagination) => {
    setResponderPagination(pagination)
    getSurveyResponderList({
      id,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
  }

  return (
    <div>
      <Spin spinning={pageLoading}>
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
                    <span>{detailData?.surveyNumber}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.survey_date" />:</span>&nbsp;
                    <span>{detailData?.surveyDate}</span>
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
                    <span>{detailData?.views}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span><FormattedMessage id="Survey.clicks" />:</span>&nbsp;
                    <span>{detailData?.clicks}</span>
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
                <span>{detailData?.title}</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.survey_description" />:</span>&nbsp;
                <span>{detailData?.description}</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.survey_label" />:</span>&nbsp;
                <span>{detailData?.label}</span>
              </p>
              <p>
                <span><FormattedMessage id="Survey.status" />:</span>&nbsp;
                <span>{activeStatus}</span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <div className="container">
        <Headline title={<FormattedMessage id="Survey.responder_list" />} />
        <Table
          rowKey="responderListId"
          loading={responderListLoading}
          dataSource={responderListData}
          columns={responderListColumns}
          pagination={responderPagination}
          onChange={handlePagination}
        />
      </div>
      <div className="bar-button">
        <Button className="survey-detail-edit-btn" onClick={editSurveyContent} type="primary" >
          <FormattedMessage id="edit" />
        </Button>
        <Button onClick={goBack}>
          <FormattedMessage id="back" />
        </Button>
      </div>
      <NewSurveyModal
        visible={editSurveyModal}
        handleCancelModal={handleCancelModal}
        saveSurveyContent={saveSurveyContent}
        detailData={detailData}
        confirmLoading={modalConfirmLoading}
      />
      </Spin>
    </div>
  )
}
export default SurveyDetail