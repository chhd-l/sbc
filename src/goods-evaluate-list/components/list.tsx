import * as React from 'react';
import { Relax, StoreProvider } from 'plume2';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, noop, AuthWrapper, Const } from 'qmkit';
const defaultImg = require('../img/none.png');
import Moment from 'moment';
import { deleteGoodsById } from '../webapi';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';
declare type IList = List<any>;
import { message, Modal, Table, Tooltip } from 'antd';
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


const goodsTypes = [
  {label: <FormattedMessage id="Product.Regularproduct" />, value: 0},
  {label: <FormattedMessage id="Product.Serviceproduct" />, value: 1},
];

const getEnum = (value, arr) => {
  const item = arr.find(item => {
    return item.value == value
  })

  return item?.label || <FormattedMessage id="Product.Regularproduct" />
}

@withRouter
@Relax
@StoreProvider(AppStore, { debug: __DEV__ })
class CustomerList extends React.Component<any, any> {
  store: AppStore;

  props: {
    history?: any;
    intl?:any;
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
    let params = {
      evaluateId: evaluateId
    };
    const { evaluateDelete } = this.props.relaxProps;
    const title = (window as any).RCi18n({id:'Product.Prompt'});
    const content = (window as any).RCi18n({id:'Product.deleteThisEvaluation'});
    confirm({
      title: title,
      content: content,
      onOk() {
        evaluateDelete(params);
      }
    });
  }

  render() {
    const { loading, dataList, pageSize, total, currentPage, init, goodsEvaluateDetail } = this.props.relaxProps;

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
          title={<FormattedMessage id="Product.productName" />}
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          width={150}
          render={(goodsInfoName, rowData: any) => {
            return (
              <div style={styles.goodsName}>
                {/*/!*商品图片*!/*/}
                {rowData.goodsImg ? <img src={rowData.goodsImg ? rowData.goodsImg : defaultImg} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />}
                {goodsInfoName ? goodsInfoName : '-'}
              </div>
            );
          }}
        />
        <Column title={<FormattedMessage id="Product.orderNumber" />} key="orderNo" width={170} dataIndex="orderNo" render={(orderNo) => (orderNo ? orderNo : '-')} />
        <Column
          title={<FormattedMessage id="Product.consumerName" />}
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
        <Column title={<FormattedMessage id="Product.PriceTableColumnType" />} key="goodsTypeRelateEvaluate" dataIndex="goodsTypeRelateEvaluate" width={150} render={(goodsTypeRelateEvaluate) => getEnum(goodsTypeRelateEvaluate, goodsTypes)} />
        <Column title={<FormattedMessage id="Product.productRatings" />} key="evaluateScore" dataIndex="evaluateScore" width={150} render={(evaluateScore) => (evaluateScore ? evaluateScore + '  Star' : '-')} />
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
        <Column title={<FormattedMessage id="Product.anonymousStatus" />} key="isAnonymous" dataIndex="isAnonymous" render={(isAnonymous) => (isAnonymous ? isShowFunction(isAnonymous) : 'No')} />
        <Column title={<FormattedMessage id="Product.reviewTime" />} key="evaluateTime" dataIndex="evaluateTime" width={102} render={(evaluateTime) => (evaluateTime ? Moment(evaluateTime).format(Const.TIME_FORMAT).toString() : '')} />

        <Column
          title={<FormattedMessage id="Product.operation" />}
          key="evaluateId"
          dataIndex="evaluateId"
          className="operation-th"
          render={(evaluateId) => {
            return (
              <div className="operation-th">
                <AuthWrapper functionName={'f_customer_review'}>
                  <Tooltip placement="top" title={RCi18n({id:'Product.View'})}>
                    <span style={styles.see} onClick={() => goodsEvaluateDetail(evaluateId, true)}>
                      <span className="icon iconfont iconView" style={{ fontSize: 20 }}></span>
                      {/* <FormattedMessage id="view" /> */}
                    </span>
                  </Tooltip>
                  <Tooltip placement="top" title={RCi18n({id:'Product.delete'})}>
                    <span style={styles.see} onClick={() => this.deleteEvaluate(evaluateId)} title="Delete">
                      <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                      {/* <FormattedMessage id="delete" /> */}
                    </span>
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

export default injectIntl(CustomerList);

const styles = {
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
