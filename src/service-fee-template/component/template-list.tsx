import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop, RCi18n, history } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm, Switch, message } from 'antd';
import { Table, Divider, Tag } from 'antd';

import { IMap } from 'plume2';
import { List } from 'immutable';
// import nodataImg from '../../../web_modules/qmkit/images/sys/no-data.jpg';

type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class TemplateList extends Component<any, any> {
  _rejectForm;
  state: {
    storeId: 0;
  };
  columns = [
    {
      title: RCi18n({ id: 'ServiceFee.RuleName' }),
      dataIndex: 'ruleName',
      key: 'ruleName'
    },
    {
      title: RCi18n({ id: 'ServiceFee.PaymentMethod' }),
      dataIndex: 'paymentMethodName',
      key: 'paymentMethodName'
    },
    // {
    //   title: RCi18n({ id: 'ServiceFee.operation' }),
    //   key: 'status',
    //   dataIndex: 'status',
    //   render: (text, row) => (
    //     <Switch
    //       defaultChecked={text}
    //       checked={text}
    //       onChange={(value) => {
    //         const { onSwitchCompanyChange } = this.props.relaxProps;
    //         onSwitchCompanyChange({ id: row.id, status: value });
    //       }}
    //     />
    //   )
    // },
    {
      title: RCi18n({ id: 'Setting.Operator' }),
      key: 'operator',
      render: (text, record) => (
        <span>
          <span
            style={{ color: '#e2001a', paddingRight: 10, cursor: 'pointer' }}
            onClick={() => this._editRow(record)}
            className="iconfont iconEdit"
          />
          <Popconfirm
            placement="topLeft"
            title="Are you sure to delete this item?"
            onConfirm={() => this._deleteRow(record)}
            okText={(window as any).RCi18n({ id: 'Setting.Confirm' })}
            cancelText={(window as any).RCi18n({ id: 'Setting.Cancel' })}
          >
            <Tooltip placement="top" title="Delete">
              <a type="link" className="iconfont iconDelete"></a>
            </Tooltip>
          </Popconfirm>
          {/* <span
            style={{ color: '#e2001a', paddingRight: 10, cursor: 'pointer' }}
            onClick={() => this._deleteRow(record)}
            className="iconfont iconDelete"
          >
          </span> */}
        </span>
      )
    }
  ];
  props: {
    relaxProps?: {
      loading: boolean;
      tableDatas: TList;
      setModalVisible: Function;
      onSwitchCompanyChange: Function;
      editRow: Function;
      deleteRow: Function;
      initList: Function;
      endLoading: Function;
      startLoading: Function;
      resetForm: Function;
      addCompany: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    tableDatas: 'tableDatas',
    setModalVisible: noop,
    onSwitchCompanyChange: noop,
    deleteRow: noop,
    initList: noop,
    endLoading: noop,
    startLoading: noop,
    getList: noop,
    resetForm: noop,
    addCompany: noop,
    editRow: noop
  };
  handleTableChange() {}
  componentDidMount() {}
  _deleteRow = async (record) => {
    const { deleteRow, startLoading, endLoading, initList } = this.props.relaxProps;
    try {
      startLoading();
      await deleteRow(record);
      message.success(RCi18n({ id: 'Setting.Operatesuccessfully' }));
      initList();
    } catch (err) {
      message.success(err.message);
    } finally {
      endLoading();
    }
  };

  _editRow = (record) => {
    // debugger
    // const { editRow } = this.props.relaxProps;
    // editRow(record);
    history.push(`/service-fee-template-edit/${record.id}`);
  };
  render() {
    const { loading, tableDatas, setModalVisible, resetForm, addCompany } = this.props.relaxProps;
    const nodata = tableDatas.size === 0;
    return (
      <div>
        {!loading ? (
          !nodata ? (
            <Table rowKey="id" columns={this.columns} dataSource={tableDatas.toJS()} />
          ) : (
            <div className="img-container">
              {/* <img src={nodataImg} width="80" className="no-data-img" /> */}
            </div>
          )
        ) : (
          <Spin className="loading-spin" />
        )}
      </div>
    );
  }
}
