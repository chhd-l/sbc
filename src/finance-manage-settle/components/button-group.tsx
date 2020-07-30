import React from 'react';

import { Button, Dropdown, Menu, Icon, message } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeSettleStatus: Function;
      bulkExport: Function;
      checkedSettleIds: IList;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    changeSettleStatus: noop,
    checkedSettleIds: 'checkedSettleIds',
    queryParams: 'queryParams',
    bulkExport: noop
  };

  render() {
    const { queryParams } = this.props.relaxProps;
    const settleStatus = queryParams.get('settleStatus');
    return (
      <div className="handle-bar">
        <Dropdown
          //disabled={settleStatus == 1}
          overlay={this._menu()}
          getPopupContainer={() => document.getElementById('page-content')}
        >
          <Button>
            Batch operation
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );
  }

  _menu = () => {
    const { queryParams, bulkExport } = this.props.relaxProps;
    const settleStatus = queryParams.get('settleStatus').toString();
    return (
      <Menu>
        {(settleStatus == '0' || settleStatus == 2) && (
          <Menu.Item>
            <a onClick={() => this._handleBatchOption(1)}>Set as settled</a>
          </Menu.Item>
        )}
        {(settleStatus == '0' || settleStatus == 1) && (
          <Menu.Item>
            <a onClick={() => bulkExport()}>Bulk Export</a>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  /**
   * 批量操作
   * @param status
   * @private
   */
  _handleBatchOption = (status) => {
    const { changeSettleStatus, checkedSettleIds } = this.props.relaxProps;
    if (checkedSettleIds && checkedSettleIds.size != 0) {
      changeSettleStatus(checkedSettleIds.toJS(), status);
    } else {
      message.error('You have not checked any records ！');
    }
  };
}
