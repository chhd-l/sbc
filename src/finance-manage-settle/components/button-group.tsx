import React from 'react';

import { Button, Dropdown, Menu, Icon, message } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { FORMERR } from 'dns';
import { FormattedMessage } from 'react-intl';

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
      <div className="handle-bar ant-form-inline filter-content">
        <Dropdown
          //disabled={settleStatus == 1}
          overlay={this._menu()}
          getPopupContainer={() => document.getElementById('page-content')}
        >
          <Button>
            <FormattedMessage id="Finance.BatchOperation" />
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
            <a onClick={() => this._handleBatchOption(1)}>
              <FormattedMessage id="Finance.SetAsSettled" />
            </a>
          </Menu.Item>
        )}
        {(settleStatus == '0' || settleStatus == 1) && (
          <Menu.Item>
            <a onClick={() => bulkExport()}>
              <FormattedMessage id="Finance.BulkExport" />
            </a>
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
      message.error(<FormattedMessage id="Finance.NotCheckedAnyRecords" />);
    }
  };
}
