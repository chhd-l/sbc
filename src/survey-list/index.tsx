import React, { useState, useEffect } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import SearchForm from './component/search-form'

const SurveyList = () => {

  // 搜索
  const handleSearch = (searchData) => {
    console.log(searchData, 'searchData')
    // todo：调接口
  }
  return (
    <div>
      {/* <BreadCrumb /> */}
      <div className="container-search">
        <Headline title={<FormattedMessage id="Survey.survey_list" />} />
        <SearchForm onSearch={handleSearch} />
      </div>
    </div>
  )
}

export default SurveyList