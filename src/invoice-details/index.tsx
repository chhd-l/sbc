import React, { Component } from 'react';
import * as webapi from './webapi';

export default class InvoiceDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
    }
  }
  componentDidMount(){

  }
  render(){
    return (
      <div>
        
      </div>
    )
  }

}