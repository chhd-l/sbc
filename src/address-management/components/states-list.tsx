import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm, Pagination } from 'antd';
import { IMap } from 'plume2';
import { List } from 'immutable';
import nodataImg from '/web_modules/qmkit/images/sys/no-data.jpg';
type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class StatesList extends Component<any, any> {
  _rejectForm;
  state: {};

  props: {
    relaxProps?: {
      loading: boolean;
      statesList: TList;
      statePagination: any;
      getStatesList: Function;
      setStateModalVisible: Function;
      setIsEditStateForm: Function;
      editStateForm: Function;
      newStateForm: Function;
      deleteState: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    statesList: 'statesList',
    statePagination: 'statePagination',
    getStatesList: noop,
    setStateModalVisible: noop,
    setIsEditStateForm: noop,
    editStateForm: noop,
    newStateForm: noop,
    deleteState: noop
  };
  componentDidMount() {
    this.getStatesList(1, 10);
  }
  getStatesList = (currentPage, pageSize) => {
    const { getStatesList } = this.props.relaxProps;
    if (currentPage < 1 || pageSize < 0) {
      return;
    }
    getStatesList({
      pageNum: currentPage - 1,
      pageSize
    });
  };
  editRow = (item) => {
    const { editStateForm } = this.props.relaxProps;
    editStateForm(item);
  };
  deleteRow = (item) => {
    const { deleteState } = this.props.relaxProps;
    deleteState({ id: item.id });
  };
  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const country = item.get('country');
        const state = item.get('state');
        const postCode = item.get('postCode');
        const abbreviation = item.get('abbreviation');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td style={{ wordBreak: 'break-all' }}>{country}</td>
            <td style={{ wordBreak: 'break-all' }}>{state}</td>
            <td style={{ wordBreak: 'break-all' }}>{abbreviation}</td>
            <td style={{ wordBreak: 'break-all' }}>{postCode}</td>
            <td>
              <Tooltip placement="top" title="Edit">
                <span
                  /*className="red mgl20"*/
                  style={{ color: 'var(--primary-color)', paddingRight: 10, cursor: 'pointer' }}
                  onClick={() => this.editRow(item.toJS())}
                  className="iconfont iconEdit"
                >
                  {/*<FormattedMessage id="edit" />*/}
                </span>
              </Tooltip>
              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteRow(item.toJS())} okText="Confirm" cancelText="Cancel">
                <Tooltip placement="top" title="Delete">
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </td>
          </tr>
        );
      })
    );
  }
  addState = () => {
    const { newStateForm } = this.props.relaxProps;
    newStateForm();
  };
  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin />
        </td>
      </tr>
    );
  }
  render() {
    const { loading, statesList, statePagination } = this.props.relaxProps;
    const pagination = statePagination.toJS();
    return (
      <div>
        <div>
          <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }} onClick={this.addState}>
            Add State
          </Button>
        </div>
        {/*{statesList && statesList.size > 0? (*/}
        <div>
          <div className="ant-table-wrapper">
            <div className="ant-table ant-table-large ant-table-scroll-position-left">
              <div className="ant-table-content">
                <div className="ant-table-body">
                  <table
                    style={{
                      borderCollapse: 'separate',
                      borderSpacing: '0 1em'
                    }}
                  >
                    <thead className="ant-table-thead">
                      <tr>
                        <th style={{ width: '10%' }}>Country</th>
                        <th style={{ width: '10%' }}>State</th>
                        <th style={{ width: '10%' }}>Abbreviation</th>
                        <th style={{ width: '10%' }}>Post code</th>
                        <th style={{ width: '10%' }}>Operation</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(statesList)}</tbody>
                  </table>
                </div>
              </div>
            </div>
            {pagination.total > 0 ? (
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={(pageNum, pageSize) => {
                  this.getStatesList(pageNum, pageSize);
                }}
              />
            ) : !loading ? (
              <div className="ant-table-placeholder">
                <img src={nodataImg} width="80" className="no-data-img" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
