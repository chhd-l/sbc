import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Tooltip } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
import { accDiv } from '../../../web_modules/qmkit/float';
const defaultImg = require('../../goods-list/img/none.png');
import moment from 'moment';

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.invalid" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return <FormattedMessage id="order.unpaid" />;
  } else if (status == 'UNCONFIRMED') {
    return <FormattedMessage id="order.toBeConfirmed" />;
  } else if (status == 'PAID') {
    return <FormattedMessage id="order.paid" />;
  } else if (status == 'REFUND') {
    return <FormattedMessage id="Refund" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};


type TList = List<any>;

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
              {
                max: 100,
                message: 'Please input less than 100 characters'
              }
              // { validator: this.checkComment }
            ]
          })(<Input.TextArea placeholder="Please enter the reason for rejection" autosize={{ minRows: 4, maxRows: 4 }} />)}
        </FormItem>
      </Form>
    );
  }

  // checkComment = (_rule, value, callback) => {
  //   if (!value) {
  //     callback();
  //     return;
  //   }

  //   if (value.length > 100) {
  //     callback(new Error('Please input less than 100 characters'));
  //     return;
  //   }
  //   callback();
  // };
}

const WrappedRejectForm = Form.create({})(RejectForm);

@Relax
export default class ListView extends React.Component<any, any> {
  _rejectForm;

  state: {
    selectedOrderId: null;
  };

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      orderRejectModalVisible: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: any;
      onChecked: Function;
      onCheckedAll: Function;
      allChecked: boolean;
      onAudit: Function;
      init: Function;
      onRetrial: Function;
      onConfirm: Function;
      onCheckReturn: Function;
      verify: Function;
      hideRejectModal: Function;
      showRejectModal: Function;
      onFindById: Function;
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

    onChecked: noop,
    onCheckedAll: noop,
    allChecked: allCheckedQL,
    onAudit: noop,
    init: noop,
    onRetrial: noop,
    onConfirm: noop,
    onCheckReturn: noop,
    verify: noop,
    orderRejectModalVisible: 'orderRejectModalVisible',
    hideRejectModal: noop,
    showRejectModal: noop,
    onFindById: noop
  };

  render() {
    const { loading, total, pageSize, dataList, onCheckedAll, allChecked, init, currentPage, orderRejectModalVisible, onFindById } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                  <thead className="ant-table-thead">
                    <tr>
                      {/*<th style={{ width: '5%' }}>
                        <Checkbox
                          style={{ borderSpacing: 0 }}
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>*/}
                      <th style={{ width: '11%' }}>
                        <FormattedMessage id="productFirstLetterUpperCase" />
                      </th>
                      <th style={{ width: '12%' }}>Recipient name</th>
                      <th style={{ width: '13.5%' }}>Recipient mail</th>
                      <th style={{ width: '11%' }}>Amount</th>
                      <th style={{ width: '10.5%' }}>Link status</th>
                      <th style={{ width: '12.5%' }}>Perscriber</th>
                      <th style={{ width: '7.1%' }}>Operation</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="noData" />
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
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
            />
          ) : null}

          <Modal maskClosable={false} title={<FormattedMessage id="order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="save" />} onOk={() => this._handleOK()} onCancel={() => this._handleCancel()}>
            <WrappedRejectForm
              ref={(form) => {
                this._rejectForm = form;
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
        </td>
      </tr>
    );
  }

  onDetail(e) {
  }

  _renderContent(dataList) {
    const { onChecked, onAudit, verify, onFindById } = this.props.relaxProps;

    let list = dataList.toJS();
    return list.map((v, index) => {
      const id = v.recommendationId;
      const createTime = v.createTime;
      const img = v.recommendationGoodsInfoRels ? v.recommendationGoodsInfoRels : [];
      const a = [{ a: 1 }, { b: 2 }];
      let amount = 0;
      for (let i = 0; i < img.length; ++i) {
        if (img[i].goodsInfo.marketPrice != null) {
          amount += img[i].goodsInfo.marketPrice * img[i].recommendationNumber;
        }
      }
      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={id}>
          <td colSpan={9} style={{ padding: 0 }}>
            <table className="ant-table-self" style={{ border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <td colSpan={9} style={{ padding: 0, color: '#999' }}>
                    <div
                      style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 12,
                        borderBottom: '1px solid #F5F5F5',
                        fontSize: 12
                      }}
                    >
                      <div style={{ width: 510, display: 'inline-block' }}>
                        <span> {id}</span>
                      </div>
                      <div style={{ width: 310, display: 'inline-block' }}>
                        <span> Created Time: {moment(v.createTime).format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '1%' }} />
                  {/*<td
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      padding: '16px 0',
                      width: '120px'
                    }}
                  >
                    {img.map((item, index) => {
                      return <img key={index} src={item.goodsInfo.goodsInfoImg} width="40" />;
                    })}
                  </td>*/}
                  <td
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      padding: '16px 0',
                      width: '120px'
                    }}
                  >
                    {img.length != 0
                      ? img.map((item, index) => {
                          return <div>{item.goodsInfo.goodsInfoName}</div>;
                        })
                      : '--'}
                  </td>
                  <td style={{ width: '15.4%' }}>{v.consumerLastName != null ? v.consumerFirstName + ' ' + v.consumerLastName : '--'}</td>
                  <td style={{ width: '18%' }}>{v.consumerEmail != null ? v.consumerEmail : '--'}</td>
                  <td style={{ width: '14%' }}>
                    {v.recommendationGoodsInfoRels && sessionStorage.getItem('s2b-supplier@systemGetConfig:')}
                    {v.recommendationGoodsInfoRels &&
                      v.recommendationGoodsInfoRels.reduce((sum, item) => {
                        let a = Number(sum) + Number(item.goodsInfo.marketPrice * item.recommendationNumber);
                        return a.toFixed(2);
                      }, 0)}
                  </td>
                  <td style={{ width: '13%' }}>{v.linkStatus != null ? (v.linkStatus == 0 ? 'Valid' : 'Invalid') : '--'}</td>
                  <td style={{ width: '15.4%' }}>{v.prescriberId != null ? v.prescriberName : '--'}</td>
                  <td
                    style={{
                      width: '10.2%',
                      color: '#E1021A',
                      cursor: 'pointer',
                      textAlign: 'right',
                      paddingRight: 20
                    }}
                    onClick={() =>
                      history.push({
                        pathname: '/recomm-page-detail',
                        state: { id: v.id }
                      })
                    }
                  >
                    <Tooltip placement="top" title="See details">
                      <span className="iconfont iconDetails"></span>
                    </Tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  }

  /**
   * 驳回订单确认提示
   * @private
   */
  _showRejectedConfirm = (tdId: string) => {
    const { showRejectModal } = this.props.relaxProps;
    this.setState({ selectedOrderId: tdId }, showRejectModal());
  };

  /**
   * 回审订单确认提示
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { onRetrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: <FormattedMessage id="order.review" />,
      content: <FormattedMessage id="order.confirmReview" />,
      onOk() {
        onRetrial(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 发货前 验证订单是否存在售后申请 跳转发货页面
   * @param tdId
   * @private
   */
  _toDeliveryForm = (tdId: string) => {
    const { onCheckReturn } = this.props.relaxProps;
    onCheckReturn(tdId);
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = (tdId: string) => {
    const { onConfirm } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: 'Confirm receipt',
      content: 'Confirm that all products have been received?',
      onOk() {
        onConfirm(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 处理成功
   */
  _handleOK = () => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        onAudit(this.state.selectedOrderId, 'REJECTED', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
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
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5
  }
} as any;
