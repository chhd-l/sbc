import React,{Component} from 'react'
import { BreadCrumb,Headline, } from 'qmkit'
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import {Link} from 'react-router-dom'

export default class Response extends Component<any,any>{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item><Link to="/log-detail/1/2">{<FormattedMessage id="Log.RequestDetail" />}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="Log.ResponseLog" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title={<FormattedMessage id="Log.ResponseLog"/>}/>
        </div>
      </div> 
    )
  }
}