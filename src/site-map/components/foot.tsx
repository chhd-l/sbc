import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      seoForm: any;
      save: Function;
    };
  };

  static relaxProps = {
    seoForm: 'seoForm',
    save: noop
  };

  render() {
    return (
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary" onClick={this._save}>
          <FormattedMessage id="Setting.Save" />
        </Button>
        {/*</AuthWrapper>*/}
      </div>
    );
  }
  _save = () => {
    const { seoForm, save } = this.props.relaxProps;
    save({ content: seoForm.toJS().content });
  };
}
