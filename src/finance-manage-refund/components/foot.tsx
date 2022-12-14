import * as React from 'react';
import { Relax } from 'plume2';
import { history } from 'qmkit';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //明细种类（收入明细还是退款明细）
      kind: string;
    };
  };

  static relaxProps = {
    kind: 'kind'
  };

  render() {
    return (
      <div className="bar-button">
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={() =>
            history.push({
              pathname: '/finance-manage-check',
              state: { kind: this.props.relaxProps.kind }
            })
          }
        >
          <FormattedMessage id="Finance.back" />
        </Button>
      </div>
    );
  }
}
