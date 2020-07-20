import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
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
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class SetBannerList extends Component<any, any> {
  _rejectForm;
  state: {};

  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      tableDatas: TList;
      setModalVisible: Function;
      deleteRow: Function;
      getList: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    tableDatas: 'tableDatas',
    setModalVisible: noop,
    deleteRow: noop,
    getList: noop
  };
  handleTableChange() {}
  componentDidMount() {
    const { getList } = this.props.relaxProps;
    getList();
  }
  deleteRow(id) {}
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
    const { deleteRow } = this.props.relaxProps;
    return (
      dataList &&
      dataList.map((item, index) => {
        const id = item.get('id');
        const pcName = item.get('pcName');
        const mobileName = item.get('mobileName');
        const pcImage = item.get('pcImage');
        const mobileImage = item.get('mobileImage');
        let pcType, mobileType;
        if (
          pcName.endsWith('.jpg') ||
          pcName.endsWith('.jpeg') ||
          pcName.endsWith('.png') ||
          pcName.endsWith('.gif')
        ) {
          pcType = 'image';
        } else {
          pcType = 'video';
        }
        if (
          mobileImage.endsWith('.jpg') ||
          mobileImage.endsWith('.jpeg') ||
          mobileImage.endsWith('.png') ||
          mobileImage.endsWith('.gif')
        ) {
          mobileType = 'image';
        } else {
          mobileType = 'video';
        }

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td>{pcName}</td>
            <td className="pad0">
              {pcType === 'image' ? (
                <div className="img-box ">
                  <img className="img" src={pcImage} />
                </div>
              ) : (
                <div>
                  <video width="220" height="260" controls>
                    <source src={pcImage} type="video/mp4" />
                  </video>
                </div>
              )}
            </td>
            {/*<td>{mobileName}</td>*/}
            <td className="pad0">
              {mobileType === 'image' ? (
                <div className="img-box">
                  <img className="img" src={mobileImage} />
                </div>
              ) : (
                <video width="220" height="260" controls>
                  <source src={mobileImage} type="video/mp4" />
                </video>
              )}
            </td>
            <td>
              <span className="red" onClick={() => deleteRow(id)}>
                <FormattedMessage id="delete" />
              </span>
              <span className="red mgl20" onClick={() => editRow(id)}>
                <FormattedMessage id="edit" />
              </span>
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
      tableDatas,
      setModalVisible
    } = this.props.relaxProps;
    debugger;
    return (
      <div>
        {tableDatas.size > 0 ? (
          <div>
            <div>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginBottom: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalVisible(true);
                }}
              >
                <FormattedMessage id="upload" />
              </Button>
            </div>
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
                          <th>
                            <FormattedMessage id="resourceName" />
                          </th>
                          <th>
                            <FormattedMessage
                              id="resource"
                              values={{ type: 'Pc' }}
                            />
                          </th>
                          {/*<th>*/}
                          {/*  <FormattedMessage*/}
                          {/*    id="resourceName"*/}
                          {/*    values={{ type: 'Mobile' }}*/}
                          {/*  />*/}
                          {/*</th>*/}
                          <th>
                            <FormattedMessage
                              id="resource"
                              values={{ type: 'Mobile' }}
                            />
                          </th>
                          <th>
                            <FormattedMessage id="action" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {loading
                          ? this._renderLoading()
                          : this._renderContent(tableDatas)}
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
