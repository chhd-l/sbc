import React, { useState, useEffect } from 'react'
import { BreadCrumb, Headline,history,Const } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Tabs, Button } from 'antd'
import * as webapi from './webapi'

import SearchForm from './component/search-form'
import AllSurveyList from './component/list'

const TabPane = Tabs.TabPane;

const SurveyList = () => {
  const [surveyListData,setSurveyListData] = useState([])

  useEffect(()=>{
    getSurveyList({
      pageNum: 0,
      pageSize: 10,
    })
  },[])

  // 搜索
  const handleSearch = (searchData) => {
    getSurveyList(searchData)
  }
  
  // 新增survey
  const AddNew = () =>{
    history.push('/new-survey')
  }

  const getSurveyList = async (params) => {
    console.log(params, 'pparams')
    // const {res} = await webapi.surveyList(params)
    // console.log(res,'reslistlist')
    const res = {
      code: 'K-000000',
      context: {
        content: [
          {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          }, {
            id: 1,
            surveyNumber: 'SUR0001',
            title: 'xxxxxxxx',
            views: 138,
            clicks: 45,
            status: 0
          },
        ],
        number: 0,
        size: 10,
        total: 1,
        sort: null,
        totalElements: 1,
        numberOfElements: 1,
        first: true,
        last: true,
        totalPages: 1,
        empty: false
      },
    };
    if(res.code ===Const.SUCCESS_CODE) {
      setSurveyListData(res.context.content || [])
    }
  }

  // 删除一条survey
  const handleDeleteSurvey = async (id) =>{
    // const {res} = await webapi.deleteSurvey({id})
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
          <AllSurveyList listData={surveyListData}/>
        </TabPane>
      </Tabs>
      </div>
    </div>
  )
}

export default SurveyList