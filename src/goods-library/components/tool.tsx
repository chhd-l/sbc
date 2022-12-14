import * as React from 'react';
import { Relax } from 'plume2';
import { Button, message, Modal } from 'antd';
import { IList } from 'typings/globalType';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const confirm = Modal.confirm;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      onImport: Function;

      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    onImport: noop,
    selectedSpuKeys: 'selectedSpuKeys'
  };

  render() {
    return (
      <div className="handle-bar">
        <Button onClick={this._spuCheckedFunc} style={{ right: '-15px' }}>
          <FormattedMessage id="Product.batchImport" />
        </Button>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { onImport, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('Select at least one item');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量导入选中的商品？',
      onOk() {
        onImport(selectedSpuKeys);
      }
    });
  };
}
