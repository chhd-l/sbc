import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Select, Button, Icon, message, InputNumber } from 'antd';
import { fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, history, Tips, QMUpload, cache, RCi18n } from 'qmkit';
import GoodsList from './goods-list';
import { FormattedMessage,injectIntl } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  } as any,
  wrapperCol: {
    sm: { span: 6 }
  } as any
};
const FILE_MAX_SIZE = 5 * 1024 * 1024;

/**
 * 退单form
 */
@Relax
class ReturnOrderForm extends React.Component<any, any> {
  props: {
    form?: any;
    intl;
    relaxProps?: {
      // 选中的退货原因
      selectedReturnReason: string;
      // 退货原因
      returnReasonList: IList;
      // 选中的退货方式
      selectedReturnWay: string;
      // 退货方式
      returnWayList: IList;
      // 退货说明
      description: any;
      // 附件信息
      images: any;
      editItem: Function;
      editImages: Function;
      add: Function;
      // 是否为退货
      isReturn: Boolean;
      applyStatus: boolean;
      applyPrice: number;
      applyIntegral: number;
      editPriceItem: Function;
      tradeDetail: IMap;
      // 是否是在线支付  true 是  false 否
      isOnLine: boolean;
      // 可申请退款金额
      canApplyPrice: number;
      refundableAmount: string;
    };
  };

  static relaxProps = {
    // 选中的退货原因
    selectedReturnReason: 'selectedReturnReason',
    // 退货原因
    returnReasonList: 'returnReasonList',
    // 选中的退货方式
    selectedReturnWay: 'selectedReturnWay',
    // 退货方式
    returnWayList: 'returnWayList',
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images',
    // 修改项
    editItem: noop,
    // 修改图片
    editImages: noop,
    // 提交
    add: noop,
    // 是否为退货
    isReturn: 'isReturn',
    // 申请金额
    applyPrice: 'applyPrice',
    // 申请积分
    applyIntegral: 'applyIntegral',
    // 订单详情
    tradeDetail: 'tradeDetail',
    // 是否是在线支付  true 是  false 否
    isOnLine: 'isOnLine',
    // 可申请退款金额
    canApplyPrice: 'canApplyPrice',
    //退货金额
    refundableAmount: 'refundableAmount',
  };

  constructor(props) {
    super(props);
    this.state = {
      flushState: (window.crypto.getRandomValues(new Uint8Array(1)) * 0.001)
    };
  }

  render() {
    const {
      description,
      add,
      selectedReturnReason,
      selectedReturnWay,
      isReturn,
      canApplyPrice
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    let images = this.props.relaxProps.images.toJS();
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Return order information</h3>
        <Form>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Returnreason" />}>
            {getFieldDecorator('returnReason', {
              initialValue: selectedReturnReason,
              rules: [
                {
                  required: true,
                  message: (window as any).RCi18n({
                    id: 'Order.Pleaseselectchargebackreason'
                  })
                }
              ]
            })(this._getReturnReasonSelect())}
          </FormItem>
          {isReturn ? (
            <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Returnmethod" />}>
              {getFieldDecorator('returnWay', {
                initialValue: selectedReturnWay,
                rules: [
                  {
                    required: true,
                    message: (window as any).RCi18n({
                      id: 'Order.Pleaseselectreturnmethod'
                    })
                  }
                ]
              })(this._getReturnWaySelect())}
            </FormItem>
          ) : null}

          <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Returndescription" />}>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [
                {
                  required: true,
                  message: (window as any).RCi18n({
                    id: 'Order.Returndescriptioncannotbeblank'
                  })
                },
              ]
            })(
              <Input.TextArea
                onChange={this._editInfo.bind(this, 'description')}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Attachmentinformation" />}>
            <QMUpload
              name="uploadFile"
              style={styles.box}
              onChange={this._editImages}
              action={
                Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
              }
              fileList={images}
              listType={'picture-card'}
              accept={'.jpg,.jpeg,.png,.gif'}
              beforeUpload={this._checkUploadFile}
            >
              {images.length < 10 ? (
                <Icon type="plus" style={styles.plus} />
              ) : null}
            </QMUpload>
            <Tips
              title={<FormattedMessage id="Order.PleaseaddyourreturOrder.savencredentialsTip" />}
           />
          </FormItem>

          {isReturn? (
            <GoodsList
              form={this.props.form}
              flushState={this.state.flushState}
            />
          ) : (
            <>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Refundableamount" />}>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + canApplyPrice.toFixed(2)}
              {getFieldDecorator('refundableAmount', {
                initialValue: canApplyPrice,
                 rules: [
                  {
                    required: true,
                    message: (window as any).RCi18n({
                      id: 'Order.Refundableamountcannotbeblank'
                    })
                  },
                ]
              })
                (<InputNumber
                  min={0}
                  max={+canApplyPrice}
                  style={{marginLeft:10}}
                  onChange={this._editInfo.bind(this, 'applyPrice')} /> )}
              </FormItem>
            </>
          )}
        </Form>
        <div className="bar-button">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            onClick={() => {
              if(this._checkReturnNum()){
                this.props.form.validateFieldsAndScroll(null, (errs) => {
                  //如果校验通过
                  if (!errs) {
                    add();
                  } else {
                    this.setState({
                      flushState: (window.crypto.getRandomValues(new Uint8Array(1)) * 0.001)
                    });
                  }
                });
              }
            }}
          >
            <FormattedMessage id="Order.save" />
          </Button>
          &nbsp;&nbsp;
          <Button
            size="large"
            onClick={() => {
              history.go(-1);
            }}
          >
            <FormattedMessage id="Order.cancel" />
          </Button>
        </div>
      </div>
    );
  }

  /**
   *  退货原因select
   */
  _getReturnReasonSelect = () => {
    const { returnReasonList } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder={
          (window as any).RCi18n({
            id: 'Order.Pleaseselectchargebackreason'
          })
        }
        notFoundContent={
          (window as any).RCi18n({
            id: 'Order.Thereisnoreasonforthereturn'
          })
        }
        onChange={this._editInfo.bind(this, 'selectedReturnReason')}
      >
        {returnReasonList && returnReasonList.map((item) => {
          const map: IMap = item.toMap();
          const key = map.keySeq().first();
          const value = map.valueSeq().first();
          return (
            <Option key={key} value={key + ''}>
              {value + ''}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   *  退货方式select
   */
  _getReturnWaySelect = () => {
    const { returnWayList } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder={
          (window as any).RCi18n({
            id: 'Order.Pleaseselectreturnmethod'
          })
        }
        notFoundContent={
          (window as any).RCi18n({
            id: 'Order.NoData'
          })
        }
        onChange={this._editInfo.bind(this, 'selectedReturnWay')}
      >
        {returnWayList&&returnWayList.map((item) => {
          const map: IMap = item.toMap();
          const key = map.keySeq().first();
          const value = map.valueSeq().first();
          return (
            <Option key={key} value={key + ''}>
              {value + ''}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 修改
   */
  _editInfo = (key: string, e) => {
    const { editItem } = this.props.relaxProps;
    if (e.target) {
      e = e.target.value;
    }
    editItem(key, e);
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error(
        (window as any).RCi18n({
          id: 'Order.Uploaderror'
        })
      );
    }
    const { editImages } = this.props.relaxProps;
    editImages(fromJS(fileList));
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error(
          (window as any).RCi18n({
            id: 'Order.Filesizecannotexceed'
          })
        );
        return false;
      }
    } else {
      message.error(
        (window as any).RCi18n({
          id: 'Order.Fileformaterror'
        })
      );
      return false;
    }
  };
  /**
   * 检查是否只退了赠品没退商品的情况
   */
  _checkReturnNum=()=>{
    const {tradeDetail}=this.props.relaxProps;
    // 退货商品数量大于0的商品
    const tradeItems = tradeDetail.get( 'tradeItems').filter((item) => item.get('num') > 0);
    if(tradeDetail.get('subscriptionPlanGiftList')){
      // 退货赠品数量大于0的赠品
      const subGifts = tradeDetail.get('subscriptionPlanGiftList').filter((item) => item.get('num') > 0);
      // 如果所有商品的退货数量都为0但是gift的数量有不为0的
      if (tradeItems.size == 0&&subGifts.size>0) {
        message.error(RCi18n({id: 'Order.returnOrder.checkReturnNum'}));
        return false;
      }
    }
    return true;
  }
}
export default injectIntl(ReturnOrderForm)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  } as any,

  avatar: {
    width: 150,
    height: 150
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any,
  imgPlus: {
    width: 88,
    height: 88,
    border: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
