import React from 'react';
import './index.less';
export default class PostalCodeMsg extends React.Component<any, any>{

  render() {
    let { text = '* Delivery not available in the area.'} = this.props;
    return(
      <div className='PostalCodeMsg-wrap'>{text}</div>
    );
  }
}
