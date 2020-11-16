import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      content: any;
      save: Function;
    };
  };

  static relaxProps = {
    content: 'content',
    save: noop
  };

  render() {
    const { content, save } = this.props.relaxProps;
    return (
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary" onClick={save({ content: content })}>
          Save
        </Button>
        {/*</AuthWrapper>*/}
      </div>
    );
  }
}
