import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm } from 'antd';
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
      getStatesList: Function;
      setStateModalVisible: Function;
      setIsEditStateForm: Function;
      editStateForm: Function;
      newStateForm: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    statesList: 'statesList',
    getStatesList: noop,
    setStateModalVisible: noop,
    setIsEditStateForm: noop,
    editStateForm: noop,
    newStateForm: noop
  };
  componentDidMount() {
    const { getStatesList } = this.props.relaxProps;
    getStatesList();
  }
  editRow = (item) => {
    const { editStateForm } = this.props.relaxProps;
    editStateForm(item);
  };
  deleteRow = (item) => {};
  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const country = item.get('country');
        const state = item.get('state');
        const postCode = item.get('postCode');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td style={{ wordBreak: 'break-all' }}>{country}</td>
            <td style={{ wordBreak: 'break-all' }}>{state}</td>
            <td style={{ wordBreak: 'break-all' }}>{postCode}</td>
            <td>
              <Tooltip placement="top" title="Edit">
                <span
                  /*className="red mgl20"*/
                  style={{ color: 'red', paddingRight: 10, cursor: 'pointer' }}
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

  render() {
    const { loading, statesList } = this.props.relaxProps;
    return (
      <div>
        <div>
          <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }} onClick={this.addState}>
            Add State
          </Button>
        </div>
        {statesList.size > 0 ? (
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
                          <th style={{ width: '10%' }}>Post code</th>
                          <th style={{ width: '10%' }}>Operation</th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">{this._renderContent(statesList)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ant-table-placeholder">
            <img src={nodataImg} width="80" className="no-data-img" />
          </div>
        )}
      </div>
    );
  }
}
