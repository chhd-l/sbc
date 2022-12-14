import React from 'react';
import { Relax } from 'plume2';
import { Pagination, Spin, Tooltip } from 'antd';
import { List } from 'immutable';
import moment from 'moment';

import { Const, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

type TList = List<any>;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;

      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',

    init: noop
  };

  render() {
    const { loading, total, pageSize, dataList, init, currentPage } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table>
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '17%', paddingLeft: 10 }}>
                        <FormattedMessage id="Setting.operatorAccount" />
                      </th>
                      <th style={{ width: '14%', paddingLeft: 10 }}>
                        <FormattedMessage id="Setting.operatorName" />
                      </th>
                      <th style={{ width: '13%', paddingLeft: 10 }}>
                        <FormattedMessage id="Setting.operatorIP" />
                      </th>
                      <th style={{ width: '17%', paddingLeft: 10 }}>
                        <FormattedMessage id="Setting.operatorTime" />
                      </th>
                      <th style={{ width: '10%', paddingLeft: 10 }}>
                        <FormattedMessage id="Setting.module" />
                      </th>
                      <th style={{ width: '10%', paddingLeft: 5 }}>
                        <FormattedMessage id="Setting.operatorType" />
                      </th>
                      <th
                        style={{
                          width: '200px',
                          maxWidth: '200px',
                          textAlign: 'left',
                          paddingLeft: 10
                        }}
                      >
                        <FormattedMessage id="Setting.operatorContent" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="Setting.NoData" />
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
              showSizeChanger={true}
              defaultPageSize={pageSize}
              pageSizeOptions={['15', '20', '30', '50', '100']}
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
              onShowSizeChange={(current, pageSize) => {
                init({ pageNum: current - 1, pageSize });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((v) => {
        const id = v.get('id');
        const opTime = v.get('opTime');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={9} style={{ padding: 0, paddingTop: 10 }}>
              <table className="ant-table-self">
                <tbody>
                  <tr>
                    <td style={{ width: '17%'}}>
                      {/*操作人账号*/}
                      {v.get('opAccount') || '-'}
                    </td>
                    <td style={{ width: '14%' }}>
                      {/*操作人姓名*/}
                      {v.get('opName') || '-'}
                    </td>
                    <td style={{ width: '13%' }}>
                      {/*操作人Ip*/}
                      {v.get('opIp') || '-'}
                    </td>
                    <td style={{ width: '17%' }}>
                      {/*操作时间*/}
                      {opTime ? moment(opTime).format(Const.TIME_FORMAT).toString() : '-'}
                    </td>
                    <td style={{ width: '10%'}}>
                      {/*一级菜单*/}
                      {v.get('opModule') || '-'}
                    </td>
                    <td style={{ width: '10%' }}>
                      {/*操作类型*/}
                      {v.get('opCode') || '-'}
                    </td>
                    <td style={{ maxWidth: '200px', width:'19%'}}>
                      {/*操作内容*/}
                      {v.get('opContext').length > 20 ? (
                        <Tooltip title={v.get('opContext')}>
                          <p className="line-two">{v.get('opContext')}</p>
                        </Tooltip>
                      ) : (
                        <p>{v.get('opContext') || '-'}</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#1890ff',
    display: 'inline-block',
    marginLeft: 5
  }
};
