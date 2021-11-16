import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Tooltip, Icon, message } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history, cache } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { RCi18n } from 'qmkit';

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
                message: <FormattedMessage id="Prescriber.lessthan100characters" />
              }
              // { validator: this.checkComment }
            ]
          })(<Input.TextArea placeholder={RCi18n({ id: 'Prescriber.EnterTheReason' })} autosize={{ minRows: 4, maxRows: 4 }} />)}
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
    relaxProps?: {
      form: any,
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

    form: 'form',
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
    const { loading, total, pageSize, form, dataList, init, currentPage, orderRejectModalVisible, onFindById } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '11%' }}>
                        <FormattedMessage id="Prescriber.Product" />
                      </th>
                      <th style={{ width: '12%' }}><FormattedMessage id="Prescriber.PO Name" /></th>
                      <th style={{ width: '13.5%' }}><FormattedMessage id="Prescriber.PO E-mail" /></th>
                      <th style={{ width: '11%' }}><FormattedMessage id="Prescriber.Amount" /></th>
                      <th style={{ width: '10.5%' }}><FormattedMessage id="Prescriber.Link status" /></th>
                      <th style={{ width: '12.5%' }}><FormattedMessage id="Prescriber.Expert" /></th>
                      <th style={{ width: '5.5%' }}><FormattedMessage id="Prescriber.Paris" /></th>
                      <th style={{ width: '10.5%' }}><FormattedMessage id="Prescriber.Pick up" /></th>
                      <th ><FormattedMessage id="Prescriber.operation" /></th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="Prescriber.No data" />
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
                init({
                  pageNum: pageNum - 1, pageSize,
                  felinRecoId: form.get('felinRecoId'),
                  fillDate: form.get('fillDate'),
                  goodsNames: form.get('goodsNames'),
                  [form.get('consumerName') ? 'consumerName' : 'consumerEmail']: form.get('consumerName') ? form.get('consumerName') : form.get('consumerEmail')

                });
              }}
            />
          ) : null}

          <Modal maskClosable={false} title={<FormattedMessage id="Prescriber.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="save" />} onOk={() => this._handleOK()} onCancel={() => this._handleCancel()}>
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

  handleCopy = (v,value) => {
   const isTrue= this.timeDiffSaven(v);

    if (!value||isTrue==='Invalid') {
      message.error(RCi18n({ id: 'Prescriber.copylink failed' }));
      return
    }
    if (copy(value)) {
      message.success(RCi18n({ id: 'Prescriber.Operate successfully' }));
    }
  }
  newUrl = (oldUrl) => {
    if (!oldUrl) {
      return false
    }
    let tempArr = oldUrl.split('?');
    let pcWebsite = JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)).pcWebsite;
    if (pcWebsite && tempArr[1]) {
      return pcWebsite + '?' + tempArr[1];
    } else return oldUrl;
  };

  timeDiffSaven(item) {
    if (!item.linkStatus) return '--';
    let _now = moment();
    let _temp = moment(item.linkStatus);

    let c = (_now.diff(_temp, 'day')) > 7 ? 'Invalid' : 'Valid';
    return c
  }


  _renderContent(dataList) {
    const { onChecked, onAudit, verify, onFindById } = this.props.relaxProps;

    let list = dataList.toJS();
    return list.map((v, index) => {
      const img = v.goodsNames ? v.goodsNames.split(',') : [];
      const appointmentVO = v.appointmentVO
      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={v.felinRecoId+index}>
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
                        <span> {v.felinRecoId}</span>
                      </div>
                      <div style={{ width: 310, display: 'inline-block' }}>
                        <span><FormattedMessage id="Prescriber.Created Time" /> {moment(v.fillDate).format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td style={{ width: '1%' }} /> */}
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

                      padding: '16px 0 16px 16px',
                      width: '12%'
                    }}
                  >
                    {img.length != 0
                      ? img.map((item, index) => {
                        return <div>{item}</div>;
                      })
                      : '--'}
                  </td>
                  <td style={{ width: '12%' }}>{appointmentVO?.consumerName ?? '--'}</td>
                  <td style={{ width: '13.5%' }}>{appointmentVO?.consumerEmail ?? '--'}</td>
                  <td style={{ width: '11%' }}>{v?.price ?? '--'}</td>
                  <td style={{ width: '12.5%' }}>{this.timeDiffSaven(v)}</td>
                  {/* <td style={{ width: '15.4%' }}>{v.prescriberId != null ? v.prescriberName : '--'}</td> */}
                  <th style={{ width: '12.5%' }}>{v?.expert ?? '--'}</th>
                  <td style={{ width: '5.5%' }}>{v.paris ? 'Y' : 'N'}</td>
                  <td style={{ width: '10.5%' }}>{v.pickup ? 'Y' : 'N'}</td>
                  <td
                    style={{
                      width: '10.5%',
                      fontSize: 16,
                      color: '#E1021A',
                      cursor: 'pointer',

                    }}
                  >
                    <div style={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center'
                    }}>
                      <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Edit" />}>
                        <Icon type="form"
                          onClick={() =>
                            history.push({
                              pathname: `/recommendation-edit/${v.felinRecoId}`,
                            })
                          }
                        />

                      </Tooltip>
                      <Tooltip placement="top" title={<FormattedMessage id="Prescriber.download pdf" />}>

                        <a href={`/api/felinReco/export/${v.felinRecoId}`} target="_blank">
                          <Icon type="cloud-download" />
                        </a>
                      </Tooltip>
                      <Tooltip placement="top" title={<FormattedMessage id="Prescriber.copied link" />}>
                        <Icon type="link" onClick={() => this.handleCopy(v,this.newUrl(v.linkAddr))} />
                      </Tooltip>
                    </div>

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
    const title = (window as any).RCi18n({ id: 'Prescriber.review' });
    const content = (window as any).RCi18n({ id: 'Prescriber.confirmReview' });
    confirm({
      title: title,
      content: content,
      onOk() {
        onRetrial(tdId);
      },
      onCancel() { }
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
      title: <FormattedMessage id="Prescriber.Confirm receipt" />,
      content: <FormattedMessage id="Prescriber.confirmReceivedAllProducts" />,
      onOk() {
        onConfirm(tdId);
      },
      onCancel() { }
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
