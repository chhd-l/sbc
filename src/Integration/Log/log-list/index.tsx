import React, { Component } from 'react'
import { Headline, BreadCrumb, SelectGroup } from 'qmkit';
// import MyDate from './components/MyDate'
import { Form, Tabs, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom'
import LogSearch from './components/LogSearch'
import LogTabs from './components/Logtab';
const { TabPane } = Tabs;

export default class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  render() { 
    return (
      <div>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Log.LogSearch" />} />
          {/* 搜索 */}
          <LogSearch />
        </div>
        <div className="container">
          {/* Log、Error表格 */}
          <LogTabs />
        </div>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center',
  }
} as any
