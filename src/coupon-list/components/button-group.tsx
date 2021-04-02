import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, history } from 'qmkit';
import { FormattedMessage } from 'react-intl';
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {};
  };

  static relaxProps = {};

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_create_coupon'}>
          <Button
            type="primary"
            onClick={() =>
              history.push({
                pathname: 'coupon-add',
                state: {
                  couponType: '1',
                  source: 'list'
                }
              })
            }
          >
            <FormattedMessage id="Marketing.CreateCoupon" />
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
