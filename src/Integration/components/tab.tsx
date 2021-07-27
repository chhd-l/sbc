import React,{Component} from 'react';
import {Table} from 'antd'
export default class Tab extends Component<any,any> {
  constructor(props:any) {
    super(props);
  }

  render(){
    // @ts-ignore
    return(
      <Table
        {...this.props}
        style={{ paddingRight: 20 }}
        scroll={{ x: '100%' }}
      />
    )
  }
}
