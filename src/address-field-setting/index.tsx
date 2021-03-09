import React from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Alert, Button } from 'antd';
import Fields from './component/fields';
import Manage from './component/manage';
import './index.less';

export default class AddressFieldSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      step: 1
    };
  }

  onStepChange = (step: number) => {
    this.setState({
      step: step
    });
  };

  render() {
    const { step } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={step === 1 ? 'Address field setting' : 'Manage field display'} />
          <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
          {step === 1 && (
            <Button type="primary" onClick={() => this.onStepChange(2)} style={{ marginBottom: 10 }}>
              Manage display
            </Button>
          )}
          {step === 1 ? <Fields /> : <Manage />}
        </div>
      </div>
    );
  }
}
