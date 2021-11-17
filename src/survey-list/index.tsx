import React, { useState, useEffect } from 'react'
import { BreadCrumb, Headline,history } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Tabs, Button } from 'antd'
import SearchForm from './component/search-form'
import AllSurveyList from './component/list'

const TabPane = Tabs.TabPane;

const SurveyList = () => {

  // 搜索
  const handleSearch = (searchData) => {
    console.log(searchData, 'searchData')
    // todo：调接口
  }
  
  // 新增survey
  const AddNew = () =>{
    history.push('/new-survey')
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
          <AllSurveyList/>
        </TabPane>
      </Tabs>
      </div>
    </div>
  )
}

export default SurveyList