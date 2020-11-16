import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      saveSeo: Function;
      savePage: Function;
    };
  };

  static relaxProps = {
    saveSeo: noop,
    savePage: noop
  };

  render() {
    const { saveSeo, savePage } = this.props.relaxProps;
    return (
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary">Save</Button>
        {/*</AuthWrapper>*/}
      </div>
    );
  }
}
