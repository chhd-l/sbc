import React from "react"
import { Table, Popconfirm } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const AllSurveyList = ({listData,tableLoading}) => {
  const allSurveyListData = [{
    surveyNumber: 1,
    title: 2,
    views: 33,
    clicks: 44,
    status: 5,
    creationTime: 343
  }]

  // 删除当前行
  const confirmDelete = () => {
    console.log("delete")
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
  }, {
    title: <FormattedMessage id="Survey.creation_time" />,
    dataIndex: 'creationTime',
    key: 'creationTime',
  }, {
    title: <FormattedMessage id="operation" />,
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record) => (
      <span>
        <Link>
        <i className="icon iconfont iconDetails" />
        </Link>
        <Link style={{margin:'0 12px'}} to={`/`}>
          <i className="icon iconfont iconEdit" />
        </Link >
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="Survey.delete_confirm" />}
          onConfirm={confirmDelete}
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
  console.log(listData,'listDatalistData')
  return (
    <Table
      rowKey="allSurveyListId"
      loading={tableLoading}
      dataSource={listData}
      columns={AllSurveyListColumns}
    />
  )
}

export default AllSurveyList