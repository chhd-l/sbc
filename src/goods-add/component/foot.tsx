import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    goodsFuncName: string;
    priceFuncName: string;
    relaxProps?: {
      validMain: Function;
      saveMain: Function;
      saveAll: Function;
      saveLoading: boolean;
      activeTabKey: string;
      onMainTabChange: Function;
    };
  };

  static relaxProps = {
    validMain: noop,
    saveMain: noop,
    saveAll: noop,
    saveLoading: 'saveLoading',
    activeTabKey: 'activeTabKey',
    onMainTabChange: noop
  };

  render() {
    const { saveLoading, activeTabKey } = this.props.relaxProps;
    return (
      <div className="bar-button">
        {activeTabKey === 'main' ? (
          [
            <AuthWrapper key="001" functionName={this.props.goodsFuncName}>
              <Button
                type="primary"
                onClick={this._save}
                style={{ marginRight: 10 }}
                loading={saveLoading}
              >
                <FormattedMessage id="product.saveDirectly" />
              </Button>
            </AuthWrapper>,
            <AuthWrapper key="002" functionName={this.props.priceFuncName}>
              <Button
                onClick={this._next}
                style={{ marginLeft: 10 }}
                loading={saveLoading}
              >
                <FormattedMessage id="product.next" />
              </Button>
            </AuthWrapper>
          ]
        ) : (
          <AuthWrapper functionName={this.props.priceFuncName}>
            <Button
              type="primary"
              onClick={this._savePrice}
              style={{ marginRight: 10 }}
              loading={saveLoading}
            >
              Save
            </Button>
          </AuthWrapper>
        )}
      </div>
    );
  }

  _save = async () => {
    const { saveMain } = this.props.relaxProps;
    const result = await saveMain();
    if (result) {
      history.push('/goods-list');
    }
  };

  _savePrice = async () => {
    const { saveAll } = this.props.relaxProps;
    saveAll();
  };

  _next = () => {
    const { validMain } = this.props.relaxProps;
    const result = validMain();
    if (result) {
      this.props.relaxProps.onMainTabChange('price');
    }
  };
}
