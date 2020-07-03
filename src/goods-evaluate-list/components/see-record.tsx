import * as React from 'react';
import { Modal } from 'antd';
import { IMap, Relax } from 'plume2';
import moment from 'moment';
import { Const, DataGrid, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class SeeRecord extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      serviceModalVisible: boolean;
      serviceModal: Function;
      storeEvaluateNumList: any;
      evaluateCount: number;
      compositeScore: number;
      storeTotal: number;
      storeDataList: any;
      storePageSize: number;
      storeCurrentPage: number;
      initStoreEvaluate: Function;
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    serviceModalVisible: 'serviceModalVisible',
    // 关闭弹窗
    serviceModal: noop,
    storeEvaluateNumList: 'storeEvaluateNumList',
    evaluateCount: 'evaluateCount',
    compositeScore: 'compositeScore',
    storeTotal: 'storeTotal',
    storeDataList: 'storeDataList',
    storePageSize: 'storePageSize',
    storeCurrentPage: 'storeCurrentPage',
    initStoreEvaluate: noop,
    storeEvaluateSum: 'storeEvaluateSum'
  };

  render() {
    const {
      serviceModalVisible,
      storeEvaluateNumList,
      storeDataList,
      storeTotal,
      storePageSize,
      storeCurrentPage,
      initStoreEvaluate,
      storeEvaluateSum
    } = this.props.relaxProps as any;
    if (!serviceModalVisible) {
      return null;
    }
    const styles = {
      tdWidth: {
        minWidth: 220
      }
    };
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            <div style={{ width: '22%', float: 'left' }}>
              <FormattedMessage id="shopRatingDetail" />
            </div>
            <div style={{ fontSize: '13px', color: 'grey' }}>
              <FormattedMessage id="evaluationNextDay" />
            </div>
          </div>
        }
        visible={serviceModalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        footer={null}
      >
        <div className="see-service-record">
          <div className="up-content">
            <div className="personal">
              <FormattedMessage id="consumerNumber" />：
              {storeEvaluateSum.orderNum}
            </div>
            <div className="score">
              <FormattedMessage id="overallRating" />：
              {storeEvaluateSum.sumCompositeScore
                ? storeEvaluateSum.sumCompositeScore.toFixed(2)
                : '-'}
            </div>
            <div className="score">
              <FormattedMessage id="reviewTime" />：
              <FormattedMessage id="lastest180" />
            </div>
          </div>
          <div className="center-table">
            <DataGrid dataSource={storeEvaluateNumList} pagination={false}>
              <Column
                title={<FormattedMessage id="reviewDetail" />}
                key="numType"
                dataIndex="numType"
                render={(value) => {
                  if (value == 0) {
                    return <FormattedMessage id="productRatings" />;
                  } else if (value == 1) {
                    return <FormattedMessage id="experienceRating" />;
                  } else {
                    return <FormattedMessage id="logisticRating" />;
                  }
                }}
              />
              <Column
                title={
                  <FormattedMessage id="detailScore" values={{ name: '4-5' }} />
                }
                dataIndex="excellentNum"
                key="excellentNum"
              />
              <Column
                title={
                  <FormattedMessage id="detailScore" values={{ name: '3' }} />
                }
                dataIndex="mediumNum"
                key="mediumNum"
              />
              <Column
                title={
                  <FormattedMessage id="detailScore" values={{ name: '1-2' }} />
                }
                dataIndex="differenceNum"
                key="differenceNum"
              />
              <Column
                title={<FormattedMessage id="averageScore" />}
                dataIndex="sumCompositeScore"
                key="sumCompositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
          <div className="down-table">
            <label className="evalu-title">
              <FormattedMessage id="evaluationHistory" />（{storeTotal}）
            </label>
            <DataGrid
              dataSource={storeDataList}
              pagination={{
                current: storeCurrentPage,
                pageSize: storePageSize,
                total: storeTotal,
                onChange: (pageNum, pageSize) => {
                  initStoreEvaluate({ pageNum: pageNum - 1, pageSize });
                }
              }}
            >
              <Column
                title={<FormattedMessage id="consumerName" />}
                dataIndex="customerName"
                key="customerName"
              />
              <Column
                title={<FormattedMessage id="orderNumber" />}
                dataIndex="orderNo"
                key="orderNo"
              />
              <Column
                title={<FormattedMessage id="reviewTime" />}
                dataIndex="createTime"
                key="createTime"
                render={(text) => moment(text).format(Const.TIME_FORMAT)}
              />
              <Column
                title={<FormattedMessage id="productRatings" />}
                dataIndex="goodsScore"
                style={styles.tdWidth}
                key="goodsScore"
              />
              <Column
                title={<FormattedMessage id="experienceRating" />}
                style={styles.tdWidth}
                dataIndex="serverScore"
                key="serverScore"
              />
              <Column
                title={<FormattedMessage id="logisticRating" />}
                dataIndex="logisticsScore"
                key="logisticsScore"
              />
              <Column
                title={<FormattedMessage id="overallRating" />}
                dataIndex="compositeScore"
                key="compositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { serviceModal } = this.props.relaxProps;
    serviceModal(false);
  };
}
