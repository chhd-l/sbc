import * as React from 'react';
import { Relax, StoreProvider } from 'plume2';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, noop, AuthWrapper, Const } from 'qmkit';
const defaultImg = require('../img/none.png');
import Moment from 'moment';
import { deleteGoodsById } from '../webapi';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;
import { message, Modal, Table } from 'antd';
import AppStore from '../store';
const confirm = Modal.confirm;
const Column = Table.Column;

const isShowFunction = (status) => {
  if (status == '0') {
    return 'No';
  } else if (status == '1') {
    return 'Yes';
  } else {
    return '-';
  }
};

@withRouter
@Relax
@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerList extends React.Component<any, any> {
  store: AppStore;

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
      evaluateDelete: Function;
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
    evaluateDelete: noop,
    goodsEvaluateDetail: noop
  };
  async deleteEvaluate(evaluateId) {
    console.log('delete: ' + evaluateId);
    let params = {
      evaluateId: evaluateId
    };
    const { evaluateDelete } = this.props.relaxProps;
    confirm({
      title: 'Prompt',
      content: 'Are you sure you want to delete this evaluate?',
      onOk() {
        evaluateDelete(params);
      }
    });
  }

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
        loading={loading}
        className="resetTable"
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
        <Column
          title={<FormattedMessage id="productName" />}
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          width={150}
          render={(goodsInfoName, rowData: any) => {
            return (
              <div style={styles.goodsName}>
                {/*/!*商品图片*!/*/}
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
        />
        <Column
          title={<FormattedMessage id="orderNumber" />}
          key="orderNo"
          width={170}
          dataIndex="orderNo"
          render={(orderNo) => (orderNo ? orderNo : '-')}
        />
        <Column
          title={<FormattedMessage id="consumerName" />}
          key="customerName,"
          dataIndex="customerName"
          width={220}
          render={(customerName, rowData) => {
            return (
              <div>
                {customerName}
                <br />
                {rowData['customerAccount']}
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="productRatings" />}
          key="evaluateScore"
          dataIndex="evaluateScore"
          width={150}
          render={(evaluateScore) =>
            evaluateScore ? evaluateScore + '  Star' : '-'
          }
        />
        {/*<Column*/}
        {/*  title="评价内容"*/}
        {/*  key="evaluateContent"*/}
        {/*  dataIndex="evaluateContent"*/}
        {/*  width={150}*/}
        {/*  render={(evaluateContent) => {*/}
        {/*    if (evaluateContent) {*/}
        {/*      if (evaluateContent.length > 20) {*/}
        {/*        return (*/}
        {/*          <span style={{ wordBreak: 'break-word' }}>*/}
        {/*            {evaluateContent.substring(0, 20) + '...'}*/}
        {/*          </span>*/}
        {/*        );*/}
        {/*      }*/}
        {/*      return (*/}
        {/*        <span style={{ wordBreak: 'break-word' }}>*/}
        {/*          {evaluateContent}*/}
        {/*        </span>*/}
        {/*      );*/}
        {/*    }*/}
        {/*    return '-';*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Column*/}
        {/*  title="晒单"*/}
        {/*  key="evaluateImageList"*/}
        {/*  dataIndex="evaluateImageList"*/}
        {/*  width={252}*/}
        {/*  render={(evaluateImageList) => {*/}
        {/*    let countFlag = false;*/}
        {/*    return (*/}
        {/*      <div style={styles.goodsImg}>*/}
        {/*        */}
        {/*        {evaluateImageList*/}
        {/*          ? evaluateImageList.map(*/}
        {/*              (v, k) =>*/}
        {/*                k < 3 ? (*/}
        {/*                  <img*/}
        {/*                    src={v.artworkUrl ? v.artworkUrl : defaultImg}*/}
        {/*                    key={k}*/}
        {/*                    style={styles.imgItem}*/}
        {/*                  />*/}
        {/*                ) : (*/}
        {/*                  (countFlag = true)*/}
        {/*                )*/}
        {/*            )*/}
        {/*          : '-'}*/}

        {/*        {countFlag && '...'}*/}
        {/*      </div>*/}
        {/*    );*/}
        {/*  }}*/}
        {/*/>*/}
        <Column
          title={<FormattedMessage id="anonymousStatus" />}
          key="isAnonymous"
          dataIndex="isAnonymous"
          render={(isAnonymous) =>
            isAnonymous ? isShowFunction(isAnonymous) : 'No'
          }
        />
        <Column
          title={<FormattedMessage id="reviewTime" />}
          key="evaluateTime"
          dataIndex="evaluateTime"
          width={102}
          render={(evaluateTime) =>
            evaluateTime
              ? Moment(evaluateTime)
                  .format(Const.TIME_FORMAT)
                  .toString()
              : ''
          }
        />

        <Column
          title={<FormattedMessage id="operation" />}
          key="evaluateId"
          dataIndex="evaluateId"
          className="operation-th"
          render={(evaluateId) => {
            return (
              <div className="operation-th">
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <span
                    style={styles.see}
                    onClick={() => goodsEvaluateDetail(evaluateId, true)}
                  >
                    <FormattedMessage id="view" />
                  </span>
                  <span
                    style={styles.see}
                    onClick={() => this.deleteEvaluate(evaluateId)}
                  >
                    <FormattedMessage id="delete" />
                  </span>
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
    cursor: 'pointer',
    marginRight: 20
  }
} as any;
