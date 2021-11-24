import React, { useState, useEffect } from 'react'
import { BreadCrumb, Headline,history,Const } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Tabs, Button, message } from 'antd'
import * as webapi from './webapi'

import SearchForm from './component/search-form'
import AllSurveyList from './component/list'

const TabPane = Tabs.TabPane;

const SurveyList = () => {
  const [surveyListData,setSurveyListData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [searchParams,setSearchParams] = useState({
    pageNum: 0,
    pageSize: 10,
  })
  useEffect(()=>{
    getSurveyList(searchParams)
  },[])

  // 搜索
  const handleSearch = (searchData) => {
    let searchP = Object.assign(searchParams,{
      ...searchData
    })
    setSearchParams(searchP)
    getSurveyList(searchP)
  }
  
  // 新增survey
  const AddNew = () =>{
    history.push('/new-survey')
  }

  const getSurveyList = async (params) => {
    try {
      setTableLoading(true)
      const {res} = await webapi.surveyList(params)
      if (res.code === Const.SUCCESS_CODE) {
        setSurveyListData(res.context.surveySumVosPage.content || [])
      }
      setTableLoading(false)
    } catch (err) {

    }
  }

  // 删除一条survey
  const handleDeleteSurvey = async (id) =>{
    const {res} = await webapi.deleteSurvey({id})
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message)
      getSurveyList(searchParams)
    }
  }


  return (
    <div>
      {/* <BreadCrumb /> */}
      <div className="container-search">
        <Headline title={<FormattedMessage id="Survey.survey_list" />} />
        <SearchForm onSearch={handleSearch} />
      </div>
      <div className="container">
      <Tabs activeKey={'1'}>
        <TabPane tab={<FormattedMessage id="Survey.all_survey" />} key="1">
        <Button style={{marginBottom:"20px"}} type="primary" onClick={AddNew}>
                <FormattedMessage id="Survey.add_new" />
              </Button>
          <AllSurveyList 
          listData={surveyListData} 
          tableLoading={tableLoading}
          handleDeleteSurvey={handleDeleteSurvey}
          />
        </TabPane>
      </Tabs>
      </div>
    </div>
  )
}

export default SurveyList