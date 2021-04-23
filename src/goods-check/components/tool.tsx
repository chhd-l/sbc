import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { noop, AuthWrapper, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      tabIndex: string;
      onSpuDelete: Function;
      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    tabIndex: 'tabIndex',
    onSpuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys'
  };

  render() {
    const tabIndex = this.props.relaxProps.tabIndex;
    if (tabIndex == '2') {
      return null;
    }
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_del">
          <Button onClick={this._spuCheckedFunc}>
            <FormattedMessage id="Product.batchDeletion" />
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { onSpuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(RCi18n({id:"Product.atLeastOneItem"}));
      return;
    }
    confirm({
      title: RCi18n({id:"Product.Notification"}),
      content: RCi18n({id:"Product.deleteTip"}),
      onOk() {
        onSpuDelete();
      }
    });
  };
}
