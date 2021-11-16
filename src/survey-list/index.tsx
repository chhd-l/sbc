import React, {useState, useEffect} from 'react'
import { BreadCrumb,Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'

const SurveyList = ()=>{
  
  return (
    <div>
      {/* <BreadCrumb /> */}
      <div className="container-search">
      <Headline title={<FormattedMessage id="Survey.survey_list" />} />
      </div>
    </div>
  )
}

export default SurveyList