import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, Const } from 'qmkit';
import { List } from 'immutable';
import { Popconfirm, Tooltip, Divider, message } from 'antd';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';

type TList = List<any>;
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class EmployeeList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      init: Function;
      roles: any;
      onEnable: Function;
      switchModal: Function;
      current: number;
      hide: boolean;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDelete: noop,
    onEdit: noop,
    onSelect: noop,
    init: noop,
    roles: 'roles',
    onEnable: noop,
    switchModal: noop,
    current: 'current'
  };

  render() {
    const { loading, total, pageSize, selected, dataList, onSelect, init, current } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.isMasterAccount == 1 || record.accountState == 2
          })
        }}
        rowKey="employeeId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        {/* <Column title="账户名" key="accountName" dataIndex="accountName" /> */}
        <Column
          title={<FormattedMessage id="employeeName" />}
          key="employeeName"
          render={(rowInfo) => (
            <div style={{ display: 'flex' }}>
              <span>{rowInfo.employeeName}</span>
              {/* {rowInfo.isLeader == 1 && <div style={styles.tag}>主管</div>}
              {rowInfo.isEmployee == 0 && <div style={styles.tag}>业务员</div>} */}
            </div>
          )}
        />
        <Column title={<FormattedMessage id="email" />} key="email" dataIndex="email" />
        {/*<Column title={<FormattedMessage id="employeeNo" />} key="jobNo" dataIndex="jobNo" render={(rowInfo) => <span>{rowInfo && rowInfo.jobNo ? rowInfo.jobNo : '-'}</span>} />
        <Column title={<FormattedMessage id="position" />} key="position" dataIndex="position" render={(rowInfo) => <span>{rowInfo && rowInfo.position ? rowInfo.position : '-'}</span>} />*/}
        <Column title={<FormattedMessage id="roles" />} key="roleId" render={(rowInfo) => <span>{this._renderRole(rowInfo)}</span>} />
        {/* <Column
          title="是否业务员"
          key="isEmployee"
          dataIndex="isEmployee"
          render={(isEmployee) => <span>{isEmployee == 0 ? '是' : '否'}</span>}
        /> */}
        <Column
          title={<FormattedMessage id="status" />}
          key="accountState"
          dataIndex="accountState"
          render={(accountState, rowData) =>
            accountState == 0 ? (
              <span>
                <FormattedMessage id="enable" />
              </span>
            ) : accountState == 1 ? (
              <div>
                <p>
                  <FormattedMessage id="disabled" />
                </p>
                <Tooltip placement="top" title={rowData['accountDisableReason']}>
                  <a href="javascript:void(0);">Reason</a>
                </Tooltip>
              </div>
            ) : accountState == 3 ? (
              <div>
                <span>Inactivated</span>
              </div>
            ) : (
              <div>
                <span>To be audit</span>
              </div>
            )
          }
        />

        <Column
          title={<FormattedMessage id="operation" />}
          width="18%"
          render={(rowInfo) => {
            //如果是店铺主账号
            if (rowInfo.isMasterAccount == 1) {
              return <span>-</span>;
            }
            return checkMenu('updateEmployee,enableDisableEmployee,deleteEmployee') ? this._renderMenu(rowInfo) : <span>-</span>;
          }}
        />
      </DataGrid>
    );
  }

  _renderMenu = (rowInfo: object) => {
    const { onEdit, onDelete, onEnable, switchModal } = this.props.relaxProps;
    const { employeeId, accountState } = rowInfo as any;
    return (
      <div className="operation-box">
        {accountState != 2 && (
          <AuthWrapper functionName={'updateEmployee'}>
            <Tooltip placement="top" title="Edit">
              <a href="javascript:void(0);" onClick={() => onEdit(employeeId)} className="iconfont iconEdit">
                {/* <FormattedMessage id="edit" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        )}
        <AuthWrapper functionName={'deleteEmployee'}>
          <Popconfirm
            title="Are you sure to delete the user?"
            onConfirm={() => {
              onDelete(employeeId);
            }}
            okText="OK"
            cancelText="Cancel"
          >
            <Tooltip placement="top" title="Delete">
              <a href="javascript:void(0);" className="iconfont iconDelete">
                {/*<FormattedMessage id="delete" />*/}
              </a>
            </Tooltip>
          </Popconfirm>
        </AuthWrapper>

        {accountState != 2 && (
          <AuthWrapper functionName={'enableDisableEmployee'}>
            {accountState === 0 ? (
              <Tooltip placement="top" title="Disabled">
                <a href="javascript:void(0);" onClick={() => switchModal(employeeId)} className="iconfont iconbtn-disable"></a>
              </Tooltip>
            ) : accountState === 1 ? (
              <Tooltip placement="top" title="Enabled">
                <a href="javascript:void(0);" onClick={() => onEnable(employeeId)} className="iconfont iconEnabled"></a>
              </Tooltip>
            ) : accountState === 3 ? (
              <Tooltip placement="top" title="Send">
                <a onClick={() => this.sendEmail(rowInfo)} className="iconfont iconemail"></a>
              </Tooltip>
            ) : null}
          </AuthWrapper>
        )}

        {accountState == 2 && (
          <a href="javascript:void(0);" onClick={() => onEdit(employeeId)}>
            View
          </a>
        )}
      </div>
    );
  };

  sendEmail = async (recored) => {
    let prescriberIds = [];
    recored.prescriberIds.map(async (prescriberKeyId) => {
      const { res: prescriberRes } = await webapi.getClinicById({
        id: prescriberKeyId
      });
      if (prescriberRes.code === Const.SUCCESS_CODE) {
        prescriberIds.push(prescriberRes.context.prescriberId);
        if (prescriberIds.length === recored.prescriberIds.length) {
          let employeeName = recored.employeeName.split(' ');
          let paramter = {
            baseUrl: window.origin,
            email: recored.email,
            firstName: employeeName && employeeName.length > 0 ? recored.employeeName.split(' ')[0] : '',
            prescriberId: prescriberIds.join(',')
          };
          const { res } = await webapi.sendEmail(paramter);
          if (res.code === Const.SUCCESS_CODE) {
            message.success('send successful');
          }
        }
      }
    });
  };

  _renderRole = (rowInfo) => {
    const { roles } = this.props.relaxProps;
    if (rowInfo.accountName === 'system') {
      return '系统管理员';
    }
    //所有的角色id集合
    const allIds = roles
      ? roles
          .map((v) => {
            return v && v.get('roleInfoId');
          })
          .toJS()
      : [];
    const roleIds = rowInfo.roleIds
      ? rowInfo.roleIds.split(',').reduce((pre, cur) => {
          if (allIds.includes(Number(cur))) {
            pre.push(cur);
          }
          return pre;
        }, [])
      : [];
    const roleName =
      roleIds.length > 0 &&
      roleIds.reduce((pre, current) => {
        const role = roles.find((role) => role.get('roleInfoId') == current);
        if (role && role.get('roleName')) {
          pre = pre + role.get('roleName') + ';';
        }
        return pre;
      }, '');
    return roleIds.length > 0 ? roleName.substr(0, roleName.length - 1) : '-';
  };
}

const styles = {
  tag: {
    border: '1px solid #F56C1D',
    color: '#F56C1D',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 5,
    padding: '1px 3px'
  }
};
