import * as React from 'react';
import { Relax } from 'plume2';
import { Icon, Modal } from 'antd';
import { DataGrid, noop, AuthWrapper } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;
import { Table } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;

@Relax
export default class TicketList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      onEdit: Function;
      onDelete: Function;
      pageSize: number;
      total: number;
      current: number;
      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    onEdit: noop,
    onDelete: noop,
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    init: noop
  };

  render() {
    const {
      loading,
      dataList,
      total,
      pageSize,
      init,
      current
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="projectId"
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
        <Column
          title={<FormattedMessage id="billingItems" />}
          dataIndex="projectName"
          key="ticket"
        />
        <Column
          title={<FormattedMessage id="operation" />}
          key="action"
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { onEdit } = this.props.relaxProps;

    if (rowInfo.projectName == '明细') {
      return <Icon type="minus" />;
    } else {
      return (
        <span>
          <AuthWrapper functionName="editFinaceTicket">
            <a
              style={{ marginRight: '5px' }}
              href="javascript:;"
              onClick={() => onEdit(rowInfo.projectId)}
            >
              {<FormattedMessage id="edit" />}
            </a>
          </AuthWrapper>
          <span className="ant-divider" />
          <AuthWrapper functionName="deleteFinaceTicket">
            <a
              href="javascript:;"
              onClick={() => this._handleDelete(rowInfo.projectId)}
            >
              {<FormattedMessage id="delete" />}
            </a>
          </AuthWrapper>
        </span>
      );
    }
  }

  _handleDelete(id) {
    const { onDelete } = this.props.relaxProps;

    confirm({
      title: '提示',
      content: '确定要删除该项目吗？',
      width: 360,
      onOk() {
        onDelete(id);
      }
    });
  }
}
