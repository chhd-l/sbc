import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, Dropdown, Menu, Icon, message, Checkbox } from 'antd';
import { AuthWrapper, noop, history, cache } from 'qmkit';
import { List } from 'immutable';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import { IMap, IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchDelete: Function;
      onBatchEnable: Function;
      toggleAdjustModal: Function;
      toggleConnectModal: Function;
      onBatchDissmiss: Function;
      switchModal: Function;
      selected: List<string>;
      onAdd: Function;
      onBatchSetEmployee: Function;
      hide: boolean;
      toggleHide: Function;
      onBatchActivateAccount: Function;
      onFormChange: Function;
      searchForm: IMap;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: 'selected',
    onBatchEnable: noop,
    switchModal: noop,
    onAdd: noop,
    toggleAdjustModal: noop,
    toggleConnectModal: noop,
    onBatchDissmiss: noop,
    onBatchSetEmployee: noop,
    hide: 'hide',
    toggleHide: noop,
    onBatchActivateAccount: noop,
    onFormChange: noop,
    searchForm: 'searchForm'
  };

  render() {
    const {
      onAdd,
      toggleHide,
      onFormChange,
      searchForm
    } = this.props.relaxProps;

    return (
      <div
        // className="handle-bar"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <AuthWrapper functionName={'updateEmployee'}>
            <Button type="primary" onClick={() => onAdd()}>
              <FormattedMessage id="add" />
            </Button>
          </AuthWrapper>

          {checkMenu('enableDisableEmployee,deleteEmployee') && (
            <Dropdown
              overlay={this._menu()}
              getPopupContainer={() => document.getElementById('page-content')}
            >
              <Button style={{ marginLeft: 10 }}>
                <FormattedMessage id="product.batchOperation" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}
        </div>

        {/* <div style={styles.box}>
          <Checkbox
            id="hide-employee"
            checked={searchForm.get('isHiddenDimission')}
            onChange={(e) => {
              toggleHide((e.target as any).checked ? '1' : '0');
              onFormChange({
                field: 'isHiddenDimission',
                value: (e.target as any).checked ? 1 : 0
              });
            }}
          >
            <FormattedMessage id="hideLeavingEmployees" />
          </Checkbox>
        </div> */}
      </div>
    );
  }

  _menu = () => {
    return (
      <Menu>
        <Menu.Item key={0}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href="javascript:void(0);" onClick={() => this._batchEnable()}>
              Batch enabled
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={1}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href="javascript:void(0);" onClick={() => this._batchDisable()}>
              Batch disable
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={2}>
          <AuthWrapper functionName={'deleteEmployee'}>
            <a href="javascript:void(0);" onClick={() => this._batchDelete()}>
              Batch delete
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={3}>
          <AuthWrapper functionName={'f_batch_ajust_department'}>
            <a href="javascript:void(0);" onClick={() => this._batchAdjust()}>
              Adjust group
            </a>
          </AuthWrapper>
        </Menu.Item>

        {/* <Menu.Item key={4}>
          <AuthWrapper functionName={'f_batch_set_employee'}>
            <a href="javascript:void(0);" onClick={() => this._batchSetEmployee()}>
              批量设为业务员
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={5}>
          <AuthWrapper functionName={'f_batch_employee_dismiss'}>
            <a href="javascript:void(0);" onClick={() => this._batchSetLeave()}>
              批量设为离职
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={6}>
          <AuthWrapper functionName={'f_batch_employee_active'}>
            <a href="javascript:void(0);" onClick={() => this._batchActive()}>
              会员账户激活
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={7}>
          <AuthWrapper functionName={'f_batch_employee_connect'}>
            <a href="javascript:void(0);" onClick={() => this._batchConnect()}>
              业务员交接
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item key={8}>
          <a
            href="javascript:void(0);"
            onClick={() => {
              history.push({
                pathname: '/employee-import'
              });
            }}
          >
            批量导入
          </a>
        </Menu.Item> */}
      </Menu>
    );
  };

  _batchEnable = () => {
    const { onBatchEnable, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    this.showConfirm(
      'Batch Activation',
      'Are you sure to activate the selected employee?',
      onBatchEnable
    );
  };

  _batchDisable = () => {
    const { switchModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    switchModal('');
  };

  _batchDelete = () => {
    const { onBatchDelete, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    this.showConfirm(
      'Batch Deletion',
      'Are you sure to delete the selected employee and his account? Cannot log in after deleting。',
      onBatchDelete
    );
  };

  _batchAdjust = () => {
    const { toggleAdjustModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    } else {
      toggleAdjustModal();
    }
  };

  _batchConnect = () => {
    const { toggleConnectModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    } else {
      toggleConnectModal();
    }
  };

  _batchSetEmployee = () => {
    const { onBatchSetEmployee, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    this.showConfirm(
      'Set as salesperson in batch',
      'Salespersons can bind members, and can only view the data related to their members to determine as salespersons?',
      onBatchSetEmployee
    );
  };

  _batchSetLeave = () => {
    const { onBatchDissmiss, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    this.showConfirm(
      'Bulk set to leave',
      'After set to leave, employees can only view and delete, if you need to hand over, please operate in advance',
      onBatchDissmiss
    );
  };

  _batchActive = () => {
    const { onBatchActivateAccount, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('Please select the row to operate');
      return;
    }
    this.showConfirm(
      'Member account activation',
      'Activating a member account will create a mall account for the selected employee based on the employee’s mobile phone number, and send a text message to confirm activation?',
      onBatchActivateAccount
    );
  };

  showConfirm(title: string, content: string, onOk: Function) {
    confirm({
      title: title,
      content: content,
      onOk() {
        onOk();
      }
    });
  }
}

const styles = {
  box: {
    padding: 10,
    paddingLeft: 20
  }
};
