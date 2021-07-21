import React,{Component} from 'react';
import {Table} from 'antd'
export default class Tab extends Component<any,any> {
  constructor(props:any) {
    super(props);
  }

  render(){
    return(
      <Table
        {...this.props}
        rowKey={({ id }) => id}
        style={{ paddingRight: 20 }}
        scroll={{ x: '100%' }}
      />
    )
  }
}
