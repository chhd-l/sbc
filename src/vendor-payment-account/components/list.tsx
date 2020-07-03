import React from 'react';
import { Relax } from 'plume2';
import { Menu, Dropdown, Icon, message } from 'antd';
import { noop, DataGrid, AuthWrapper, checkAuth } from 'qmkit';
import { FormattedMessage } from 'react-intl';

import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountModal: Function;
      moneyModal: Function;
      deleteModal: Function;
      accountList: any;
      setMainAccount: Function;
      //确认收到打款
      affrimRemit: Function;
      //变更账户
      updateAccount: Function;
      //删除账号弹出
      deleteAccount: Function;
    };
  };

  static relaxProps = {
    accountModal: noop,
    moneyModal: noop,
    deleteModal: noop,
    accountList: 'accountList',
    setMainAccount: noop,
    affrimRemit: noop,
    updateAccount: noop,
    deleteAccount: noop
  };

  render() {
    const { accountList } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={accountList.toJS()}
        pagination={false}
        rowKey="bankNo"
      >
        <Column
          title={<FormattedMessage id="serialNumber" />}
          dataIndex="index"
          key="index"
          render={(_text, _rowData: any, index) => {
            return index + 1;
          }}
        />
        />
        <Column
          title={<FormattedMessage id="bank" />}
          dataIndex="bankName"
          key="bankName"
        />
        <Column
          title={<FormattedMessage id="accountName" />}
          dataIndex="accountName"
          key="accountName"
        />
        <Column
          title={<FormattedMessage id="accountNumber" />}
          dataIndex="bankNo"
          key="bankNo"
        />
        <Column
          title={<FormattedMessage id="subBranch" />}
          dataIndex="bankBranch"
          key="bankBranch"
        />
        <Column
          title={<FormattedMessage id="receivePayment" />}
          dataIndex="isReceived"
          key="isReceived"
          render={(text, _record, _i) => {
            return text == 0 ? <span>N</span> : <span>Y</span>;
          }}
        />
        <Column
          title={<FormattedMessage id="mainAccount" />}
          dataIndex="isDefaultAccount"
          key="isDefaultAccount"
          render={(text, _record, _i) => {
            return text == 0 ? <span>N</span> : <span>Y</span>;
          }}
        />
        <Column
          title={<FormattedMessage id="operation" />}
          dataIndex="operation"
          key="operation"
          render={(_text, record, _i) => {
            return ((record as any).isReceived == 1 &&
              (checkAuth('f_vendor_new_accounts') ||
                checkAuth('f_acc_del') ||
                checkAuth('master_account_setting'))) ||
              ((record as any).isReceived == 0 &&
                (checkAuth('f_acc_del') || checkAuth('f_acc_rec_confirm')))
              ? this._menu(record)
              : '-';
          }}
        />
      </DataGrid>
    );
  }

  _menu = (record) => {
    const { deleteAccount } = this.props.relaxProps;
    return record.isReceived == 1 ? (
      <div className="operation-box">
        <AuthWrapper functionName="f_vendor_new_accounts">
          <a href="javascript:;" onClick={() => this._showAccountModal(record)}>
            {<FormattedMessage id="changeAccount" />}
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_acc_del">
          <a href="javascript:;" onClick={() => deleteAccount(record)}>
            {<FormattedMessage id="deleteAccount" />}
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="master_account_setting">
          <a href="javascript:;" onClick={() => this._setMainAccount(record)}>
            {<FormattedMessage id="setMainAccount" />}
          </a>
        </AuthWrapper>
      </div>
    ) : (
      <div className="operation-box">
        {record.remitPrice && (
          <AuthWrapper functionName="f_acc_rec_confirm">
            <a href="javascript:;" onClick={() => this._showMoneyModal(record)}>
              {<FormattedMessage id="receivePayment" />}
            </a>
          </AuthWrapper>
        )}
        <AuthWrapper functionName="f_acc_del">
          <a href="javascript:;" onClick={() => deleteAccount(record)}>
            {<FormattedMessage id="deleteAccount" />}
          </a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 显示变更当前账号
   */
  _showAccountModal = (record) => {
    const { updateAccount } = this.props.relaxProps;
    updateAccount(record);
  };

  /**
   * 显示确认首次打款
   */
  _showMoneyModal = (record) => {
    const { affrimRemit } = this.props.relaxProps;
    affrimRemit(record);
  };

  /**
   * 显示确认删除账号
   */
  _showDeleteModal = () => {
    const { deleteModal } = this.props.relaxProps;
    deleteModal();
  };

  /**
   * 设为主账号
   * @param record
   * @private
   */
  _setMainAccount = (record) => {
    const { setMainAccount } = this.props.relaxProps;
    //已经是主账号了
    if (record.isDefaultAccount == 1) {
      message.error('该账号已经是主账号');
      return;
    } else {
      setMainAccount(record.accountId);
    }
  };
}
