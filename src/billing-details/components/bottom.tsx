import React from 'react';
import { Button, Modal } from 'antd';
import { IMap } from 'typings/globalType';
import { Relax } from 'plume2';

import { history, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const confirm = Modal.confirm;
@Relax
export default class Bottom extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
      changeSettleStatus: Function;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    changeSettleStatus: noop
  };

  render() {
    const { settlement } = this.props.relaxProps;
    return (
      <div className="flex-start">
        {/*<div style={{ marginTop: 20 }}>
          <Button
            style={{ marginLeft: 10, background: '#e2001a', color: '#ffffff' }}
          >
            {<FormattedMessage id="Settlement" />}
          </Button>
        </div>*/}

        {/* <div style={{ marginTop: 20 }}>
          <Button style={{ marginLeft: 10 }} onClick={() => history.goBack()}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>*/}

        {settlement.get('settleStatus') == 0 && (
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              onClick={() =>
                this._handleSettleStatus(settlement.get('settleId'), 1)
              }
            >
              Set as settled
            </Button>
            {/* <Button style={{marginLeft: 10}} type="primary" onClick={() => this._handleSettleStatus(settlement.get('settleId'), 2)}>暂不处理</Button>*/}
            <Button style={{ marginLeft: 10 }} onClick={() => history.goBack()}>
              back
            </Button>
          </div>
        )}
        {/* {
        settlement.get('settleStatus') == 1 &&
        <div style={{marginTop: 20}}>
        <Button style={{marginLeft: 10}} onClick={() => history.goBack()}>返回</Button>
        </div>
        }
        {
        settlement.get('settleStatus') == 2 &&
        <div style={{marginTop: 20}}>
        <Button type="primary" onClick={() => this._handleSettleStatus(settlement.get('settleId'), 2)}>暂不处理</Button>
        <Button style={{marginLeft: 10}} onClick={() => history.goBack()}>返回</Button>
        </div>
        }*/}
      </div>
    );
  }

  _handleSettleStatus = (settleId, status) => {
    const { changeSettleStatus } = this.props.relaxProps;
    confirm({
      title: 'Tips',
      content:
        status == 1
          ? 'Are you sure you want to set this settlement record as settled? '
          : ' are you sure you want to set the settlement record to not be processed temporarily?',
      onOk() {
        changeSettleStatus([settleId], status);
        history.goBack();
      }
    });
  };
}
