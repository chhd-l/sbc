import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Tooltip } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
import { accDiv } from '../../../web_modules/qmkit/float';
const defaultImg = require('../../goods-list/img/none.png');
import moment from 'moment';

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="Order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="Order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="Order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="Order.invalid" />;
  } else {
    return <FormattedMessage id="Order.unknown" />;
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return <FormattedMessage id="Order.unpaid" />;
  } else if (status == 'UNCONFIRMED') {
    return <FormattedMessage id="Order.toBeConfirmed" />;
  } else if (status == 'PAID') {
    return <FormattedMessage id="Order.paid" />;
  } else if (status == 'REFUND') {
    return <FormattedMessage id="Order.Refund" />;
  } else {
    return <FormattedMessage id="Order.unknown" />;
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
                message: <FormattedMessage id="Order.rejectionReasonTip" />
              },
              {
                max: 100,
                message: <FormattedMessage id="Order.100Characters" />
              }
              // { validator: this.checkComment }
            ]
          })(<Input.TextArea placeholder={RCi18n({id:'Order.enterTheReason'})} autosize={{ minRows: 4, maxRows: 4 }} />)}
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
class ListView extends React.Component<any, any> {
  _rejectForm;

  state: {
    selectedOrderId: null;
  };

  props: {
    histroy?: Object;
    intl?:any;
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
    //?????????????????????
    total: 'total',
    //?????????????????????
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    //?????????????????????
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
                        <FormattedMessage id="Order.Product" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="Order.RecipientName" />
                      </th>
                      <th style={{ width: '13.5%' }}>
                        <FormattedMessage id="Order.RecipientMail" />
                      </th>
                      <th style={{ width: '11%' }}>
                        <FormattedMessage id="Order.amount" />
                      </th>
                      <th style={{ width: '10.5%' }}>
                        <FormattedMessage id="Order.LinkStatus" />
                      </th>
                      <th style={{ width: '12.5%' }}>
                        <FormattedMessage id={Const.SITE_NAME==='MYVETRECO'?'Menu.Clinic':"Order.Perscriber"} />
                      </th>
                      <th style={{ width: '7.1%' }}>
                        <FormattedMessage id="Order.Operation" />
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
                    <FormattedMessage id="Order.noData" />
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

          <Modal maskClosable={false} title={<FormattedMessage id="Order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="Order.save" />} onOk={() => this._handleOK()} onCancel={() => this._handleCancel()}>
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
          <Spin />
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
                        <span>
                          {' '}
                          <FormattedMessage id="Order.CreatedTime" />: {moment(v.createTime).format('YYYY-MM-DD')}
                        </span>
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
                  <td style={{ width: '13%' }}>{v.linkStatus != null ? (v.linkStatus == 0 ? RCi18n({id:'Order.Valid'}) : RCi18n({id:'Order.invalid'})) : '--'}</td>
                  <td style={{ width: '15.4%' }}>{v.prescriberId != null ? v.prescriberName : '--'}</td>
                  <td
                    style={{
                      width: '10.2%',
                      textAlign: 'right',
                      paddingRight: 20
                    }}
                  >
                    <Tooltip placement="top" title={<FormattedMessage id="Order.detail" />}>
                      <Link to={{ pathname: '/recomm-page-detail', state: { id: v.id } }} className="iconfont iconDetails" />
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
   * ????????????????????????
   * @private
   */
  _showRejectedConfirm = (tdId: string) => {
    const { showRejectModal } = this.props.relaxProps;
    this.setState({ selectedOrderId: tdId }, showRejectModal());
  };

  /**
   * ????????????????????????
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { onRetrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    const title = (window as any).RCi18n({id:'Order.review'});
    const content = (window as any).RCi18n({id:'Order.confirmReview'});
    confirm({
      title: title,
      content: content,
      onOk() {
        onRetrial(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * ????????? ???????????????????????????????????? ??????????????????
   * @param tdId
   * @private
   */
  _toDeliveryForm = (tdId: string) => {
    const { onCheckReturn } = this.props.relaxProps;
    onCheckReturn(tdId);
  };

  /**
   * ????????????????????????
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
   * ????????????
   */
  _handleOK = () => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //??????????????????
      if (!errs) {
        onAudit(this.state.selectedOrderId, 'REJECTED', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * ????????????
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };
}

export default injectIntl(ListView);

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
