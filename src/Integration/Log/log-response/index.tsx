import React,{Component} from 'react'
import { BreadCrumb,Headline, } from 'qmkit'
import { FormattedMessage } from 'react-intl';

export default class Response extends Component<any,any>{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={<FormattedMessage id="Log.ResponseLog"/>}/>
        </div>
      </div> 
    )
  }
}