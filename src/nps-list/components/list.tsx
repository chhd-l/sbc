import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, noop, AuthWrapper, Const } from 'qmkit';
const defaultImg = require('../img/none.png');
import Moment from 'moment';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;
import { Table, Tooltip } from 'antd';

const Column = Table.Column;

const isShowFunction = (status) => {
  if (status == '0') {
    return '否';
  } else if (status == '1') {
    return '是';
  } else {
    return '-';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      modal: Function;
      goodsEvaluateDetail: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    modal: noop,
    goodsEvaluateDetail: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      goodsEvaluateDetail
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={{ spinning: loading, indicator:<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" /> }}
        isScroll={false}
        className="resetTable"
        /*sc*/
        rowKey="evaluateId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        {/* <Column
          title={<FormattedMessage id="productName" />}
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          width={150}
          render={(goodsInfoName, rowData: any) => {
            return (
              <div style={styles.goodsName}>
                {rowData.goodsImg ? (
                  <img
                    src={rowData.goodsImg ? rowData.goodsImg : defaultImg}
                    style={styles.imgItem}
                  />
                ) : (
                  <img src={defaultImg} style={styles.imgItem} />
                )}
                {goodsInfoName ? goodsInfoName : '-'}
              </div>
            );
          }}
        /> */}
        <Column
          title={<FormattedMessage id="orderNumber" />}
          key="orderNo"
          // width={250}
          dataIndex="orderNo"
          render={(orderNo) => (orderNo ? orderNo : '-')}
        />
        <Column
          title={<FormattedMessage id="consumerName" />}
          key="customerName,"
          dataIndex="customerName"
          // width={180}
          render={(customerName, rowData) => {
            return (
              <div>
                {customerName}
                {/* <br />
                {rowData['customerAccount']} */}
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="consumerType" />}
          key="consumerType,"
          dataIndex="consumerType"
          // width={120}
          render={(consumerType, rowData) => {
            return (
              <div>
                {consumerType}
                {/* <br />
                {rowData['customerAccount']} */}
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="ratingWithComment" />}
          key="commentStatus"
          dataIndex="commentStatus"
          // width={50}
          render={(commentStatus) => commentStatus}
        />
        <Column
          title={<FormattedMessage id="productRating" />}
          key="goodsScore"
          dataIndex="goodsScore"
          // width={150}
          render={(evaluateScore) =>
            evaluateScore ? evaluateScore + ' star' : '-'
          }
        />
        {/* <Column
          title="评价内容"
          key="evaluateContent"
          dataIndex="evaluateContent"
          width={150}
          render={(evaluateContent) => {
            if (evaluateContent) {
              if (evaluateContent.length > 20) {
                return (
                  <span style={{ wordBreak: 'break-word' }}>
                    {evaluateContent.substring(0, 20) + '...'}
                  </span>
                );
              }
              return (
                <span style={{ wordBreak: 'break-word' }}>
                  {evaluateContent}
                </span>
              );
            }
            return '-';
          }}
        /> */}

        <Column
          title={<FormattedMessage id="surveyTime" />}
          key="createTime"
          dataIndex="createTime"
          width={102}
          render={(evaluateTime) =>
            evaluateTime
              ? Moment(evaluateTime).format(Const.TIME_FORMAT).toString()
              : ''
          }
        />

        <Column
          title={<FormattedMessage id="operation" />}
          key="evaluateId"
          dataIndex="evaluateId"
          className="operation-th"
          render={(evaluateId, rowData) => {
            return (
              <div className="operation-th">
                <AuthWrapper functionName={'query_nps'}>
                  <Tooltip placement="top" title="View">
                    <span
                      style={styles.see}
                      onClick={() => goodsEvaluateDetail(rowData)}
                      className="iconfont iconView"
                    ></span>
                  </Tooltip>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  /**
   * 查看
   */
  // _showDetailModal = (evaluateId) => {
  //   const { modal,goodsEvaluateDetail } = this.props.relaxProps;
  //  goodsEvaluateDetail(evaluateId);
  //   //查询
  //   modal(true);
  // };
}

const styles = {
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff'
  },
  goodsName: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center'
  },
  goodsImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  see: {
    color: '#F56C1D',
    cursor: 'pointer'
  }
} as any;
