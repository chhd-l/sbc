import React from 'react';
import { BreadCrumb } from 'qmkit';
import Fields from './component/fields';
import Manage from './component/manage';
import './index.less';

export default class AddressFieldSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      step: 2
    };
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <BreadCrumb />
        {step === 1 ? <Fields /> : <Manage />}
      </div>
    );
  }
}
