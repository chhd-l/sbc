import React from "react"
import { Table, Popconfirm } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const AllSurveyList = ({listData,tableLoading,handleDeleteSurvey,pagination, handlePaginationChange}) => {

  // 删除当前行
  const confirmDelete = (id) => {
    handleDeleteSurvey(id)
  }

  const handlePagination = (pagination) => {
    handlePaginationChange(pagination)
  }

  const AllSurveyListColumns = [{
    title: <FormattedMessage id="Survey.survey_number" />,
    dataIndex: 'surveyNumber',
    key: 'surveyNumber',
  }, {
    title: <FormattedMessage id="Survey.title" />,
    dataIndex: 'title',
    key: 'title',
  }, {
    title: <FormattedMessage id="Survey.views" />,
    dataIndex: 'views',
    key: 'views',
  }, {
    title: <FormattedMessage id="Survey.clicks" />,
    dataIndex: 'clicks',
    key: 'clicks',
  }, {
    title: <FormattedMessage id="Survey.status" />,
    dataIndex: 'status',
    key: 'status',
    render:(text,record) => ( 
      <span>
        {text=== 1?"active":"inactive"}
      </span>
    )
  }, {
    title: <FormattedMessage id="Survey.creation_time" />,
    dataIndex: 'createTime',
    key: 'createTime',
    render:(text,record) => ( 
      <span>
        {text ? text.includes(".") ? text.split('.')?.[0] : text : ''}
      </span>
    )
  }, {
    title: <FormattedMessage id="operation" />,
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record) => (
      <span>
        <Link to={`/survey-detail/${record.id}`} style={{marginRight:'15px'}}>
        <i className="icon iconfont iconDetails" />
        </Link>
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="Survey.delete_confirm" />}
          onConfirm={()=>confirmDelete(record.id)}
          okText={<FormattedMessage id="Product.Confirm" />}
          cancelText={<FormattedMessage id="Product.Cancel" />}
        >
          <a>
            <i className="icon iconfont iconDelete"/>
          </a>
        </Popconfirm>
      </span>
    ),
  }]

  return (
    <Table
      rowKey="allSurveyListId"
      loading={tableLoading}
      dataSource={listData}
      columns={AllSurveyListColumns}
      pagination={pagination}
      onChange={handlePagination}
    />
  )
}

export default AllSurveyList