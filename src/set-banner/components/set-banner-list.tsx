import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Checkbox,
  Pagination,
  Spin,
  Tooltip
} from 'antd';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { AuthWrapper, Const } from 'qmkit';
import momnet from 'moment';
import Moment from 'moment';
const FormItem = Form.Item;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="order.rejectionReasonTip" />
              },
              { validator: this.checkComment }
            ]
          })(
            <FormattedMessage id="order.rejectionReasonTip">
              {(txt) => (
                <Input.TextArea
                  placeholder={txt.toString()}
                  autosize={{ minRows: 4, maxRows: 4 }}
                />
              )}
            </FormattedMessage>
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('Please input less than 100 characters'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);

@Relax
export default class SetBannerList extends Component<any, any> {
  _rejectForm;
  state: {
    tableColumns: [];
  };

  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      tableDatas: TList;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    tableDatas: 'tableDatas'
  };
  handleTableChange() {}
  componentDidMount() {
    this.setState({
      tableColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address'
        }
      ]
    });
  }
  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={10}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((v, index) => {
        const id = v.get('id');
        const pcImage = v.get('pcImage');
        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={8} style={{ padding: 0 }}>
              <div>
                <img src="" />
              </div>
            </td>
          </tr>
        );
      })
    );
  }

  render() {
    const {
      loading,
      total,
      pageSize,
      currentPage,
      tableDatas
    } = this.props.relaxProps;
    return (
      <div>
        {tableDatas.size > 0 ? (
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
                          <th>PC image</th>
                          <th>Mobile image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {/*{loading*/}
                        {/*  ? this._renderLoading()*/}
                        {/*  : this._renderContent(tableDatas)}*/}

                        {this._renderContent(tableDatas)}
                      </tbody>
                    </table>
                  </div>
                  {total == 0 ? (
                    <div className="ant-table-placeholder">
                      <span>
                        <i className="anticon anticon-frown-o" />
                        No Data
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              {total > 0 ? (
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  // onChange={(pageNum, pageSize) => {
                  //   init({
                  //     pageNum: pageNum - 1,
                  //     pageSize: pageSize,
                  //     flushSelected: false
                  //   });
                  // }}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
