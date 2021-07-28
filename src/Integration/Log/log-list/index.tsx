import React, { Component } from 'react'
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import LogSearch from './components/LogSearch'
import LogTabs from './components/Logtab';
import '@/Integration/components/index.less';

export default class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  render() { 
    return (
      <div>
        <BreadCrumb thirdLevel={true} />
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
