import React from 'react';
import { RCi18n } from 'qmkit';
import './index.less';

export default class PostalCodeMsg extends React.Component<any, any>{

  render() {
    let { text = RCi18n({ id: 'PetOwner.PostalCodeMsg' }) } = this.props;
    return(
      <div className='PostalCodeMsg-wrap'>{text}</div>
    );
  }
}
