import * as React from 'react';
import { fromJS, List } from 'immutable';
import { FormattedMessage, injectIntl} from 'react-intl';

import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Spin } from 'antd';
import { Const, history, QMMethod, util, cache, ValidConst, noop } from 'qmkit';
import moment from 'moment';

import * as webapi from '../../webapi';
import { Relax } from 'plume2';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

const largeformItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 10
  }
};

@Relax
class FreeShippingAddForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    // const relaxProps = props.store.state();
    this.state = {
      // marketingBean: relaxProps.get('marketingBean'),
      timeZone: moment
      // allGroups: relaxProps.get('allGroups'),
      // submitFreeShipping: relaxProps.get('allGroups'),
      // loading: relaxProps.get('loading')
    };
  }
  props: {
    form: any;
    intl: any;
    relaxProps?: {
      allGroups: any;
      marketingBean: any;
      loading: boolean;
      submitFreeShipping: Function;
      shippingBeanOnChange: Function;
    };
  };

  static relaxProps = {
    allGroups: 'allGroups',
    marketingBean: 'marketingBean',
    loading: 'loading',
    submitFreeShipping: noop,
    shippingBeanOnChange: noop
  };
  componentDidMount() {}
  /**
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {};

  /**
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    const { marketingBean, shippingBeanOnChange } = this.props.relaxProps;
    shippingBeanOnChange(marketingBean.merge(params));
  };

  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    let errorObject = {};
    const { marketingBean, submitFreeShipping } = this.props.relaxProps;
    this.setState({
      count: 1
    });

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submitFreeShipping(marketingBean.toJS());
      }
    });
  };

  handleEndOpenChange = async (date) => {
    if (date == true) {
      const { res } = await webapi.timeZone();
      if (res.code == Const.SUCCESS_CODE) {
        this.setState({
          timeZone: res.defaultLocalDateTime
        });
      }
    }
  };

  productTypeOnChange = (value) => {
    this.onBeanChange({ productType: value });
  };
  targetCustomerRadioChange = (value) => {
    this.onBeanChange({
      joinLevel: value,
      segmentIds: []
    });
  };

  selectGroupOnChange = (value) => {
    let segmentIds = [];
    segmentIds.push(value);
    this.onBeanChange({ segmentIds });
  };

  shippingRadioOnChange = (e, key) => {
    switch (key) {
      case 'subType':
        this.props.form.setFieldsValue({
          shippingItemValue: null,
          shippingValue: null
        });
        this.onBeanChange({
          shippingValue: null,
          shippingItemValue: null,
          subType: e.target.value
        });
        break;
      case 'shippingValue':
        this.onBeanChange({
          shippingValue: e.target.value,
          shippingItemValue: null
        });
        break;
      case 'shippingItemValue':
        this.onBeanChange({
          shippingItemValue: e.target.value,
          shippingValue: null
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { form } = this.props; //marketingType, marketingId,
    const { getFieldDecorator } = this.props.form;
    const { allGroups, marketingBean, loading } = this.props.relaxProps;
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
        <div className="bold-title"><FormattedMessage id="Marketing.PromotionType" />:</div>
        <FormItem {...formItemLayout} labelAlign="left">
          <div className="ant-form-inline">
            <Radio.Group onChange={e => {
              this.onBeanChange({
                promotionType: e.target.value,
              });
            }} value={marketingBean.get('promotionType')}>
              <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Autoship" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Club" /></Radio>
              <Radio value={3}><FormattedMessage id="Marketing.Singlepurchase" /></Radio>
            </Radio.Group>
          </div>
        </FormItem>
        <div className="bold-title">Basic Setting</div>
        <FormItem {...smallformItemLayout} label={<FormattedMessage id="Marketing.Freeshippingname" />} labelAlign="left"  className="gift-item">
          {getFieldDecorator('marketingName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.Pleaseenterfreeshippingname',
                  })
              },
              { min: 1, max: 40, message:
                  (window as any).RCi18n({
                  id: 'Marketing.40Words',
                })
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback,
                    (window as any).RCi18n({
                      id: 'Marketing.Freeshippingname',
                    })
                  );
                }
              }
            ],
            onChange: (e) => this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(<Input placeholder={
            (window as any).RCi18n({
            id: 'Marketing.nomorethan40words',
          })} style={{ width: 350 }} />)}
        </FormItem>
        <FormItem {...smallformItemLayout} label={<FormattedMessage id="Marketing.StartAndEndTime" />} labelAlign="left" className="gift-item">
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: (window as any).RCi18n({
                  id: 'Marketing.PleaseSelectStartingAndEndTime'
                })
              },
              {
                validator: (_rule, value, callback) => {
                  if (value[0]) {
                    callback();
                  } else {
                    callback(
                      (window as any).RCi18n({
                        id: 'Marketing.PleaseSelectStartingAndEndTime'
                      })
                    );
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                this.onBeanChange({
                  beginTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },

            initialValue: marketingBean.get('beginTime') === undefined ? [undefined, undefined] : [moment(marketingBean.get('beginTime')), moment(marketingBean.get('endTime'))]
          })(<RangePicker getCalendarContainer={() => document.getElementById('page-content')} allowClear={false} format={Const.DATE_FORMAT} placeholder={['Start time', 'End time']} showTime={{ format: 'HH:mm' }} onOpenChange={this.handleEndOpenChange} />)}
        </FormItem>
        <div className="bold-title"><FormattedMessage id="Marketing.Freeshippingtype" />:</div>
        <FormItem {...smallformItemLayout} labelAlign="left">
          {getFieldDecorator(
            'subType',
            {}
          )(
            <>
              <RadioGroup value={marketingBean.get('subType')} onChange={(e) => this.shippingRadioOnChange(e, 'subType')}>
                {/*<FormItem>*/}
                {/*  <Radio value={1}>All order</Radio>*/}
                {/*</FormItem>*/}
                <FormItem>
                  <Radio value={10}>
                    <span>
                      <FormattedMessage id="Marketing.Orderreach" /> &nbsp;
                      {getFieldDecorator('shippingValue', {
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              debugger
                              if(marketingBean.get('subType') !== 10 || value === 0 || value === '0') {
                                callback();
                              } else if (!value) {//marketingBean.get('shippingValue')
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.Shippingvalueentered',
                                  })
                                );
                              } else if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) || value>= 10000) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.0-9999',
                                  })
                                );
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: marketingBean.get('shippingValue')
                      })(
                        <Input
                          style={{ width: 200 }}
                          title={
                            (window as any).RCi18n({
                            id: 'Marketing.0-9999',
                          })
                          }
                          placeholder={
                            (window as any).RCi18n({
                              id: 'Marketing.0-9999',
                            })
                          }
                          onChange={(e) => {
                            this.shippingRadioOnChange(e, 'shippingValue');
                          }}
                          value={marketingBean.get('shippingValue')}
                          disabled={marketingBean.get('subType') !== 10}
                        />
                      )}
                      <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                    </span>
                  </Radio>
                </FormItem>
                <FormItem>
                  <Radio value={11}>
                    <span>
                      <FormattedMessage id="Marketing.Orderreach" />&nbsp;
                      {getFieldDecorator('shippingItemValue', {
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              if(marketingBean.get('subType') !== 11) {
                                callback()
                              }else if (!value) {//marketingBean.get('shippingItemValue')
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.Itemsmustbeentered',
                                  })
                                );
                              } else if(!/^\+?[1-9]\d{0,3}?$/.test(value)) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.1-9999',
                                  })
                                );
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: marketingBean.get('shippingItemValue')
                      })(
                        <Input style={{ width: 200 }} value={marketingBean.get('shippingItemValue')} title={'1-9999'} placeholder={'1-9999'} onChange={(e) => this.shippingRadioOnChange(e, 'shippingItemValue')} disabled={marketingBean.get('subType') !== 11} />)}
                      <span>&nbsp;<FormattedMessage id="Marketing.items" /></span>
                    </span>
                  </Radio>
                </FormItem>
              </RadioGroup>
            </>
          )}
        </FormItem>
        <div className="bold-title"><FormattedMessage id="Marketing.TargetConsumer" />:</div>
        <FormItem {...formItemLayout} required={true} labelAlign="left">
          {getFieldDecorator('joinLevel', {
            // rules: [{required: true, message: 'Please select target consumer'}],
          })(
            <div>
              <RadioGroup
                // onChange={(e) => {
                //   this.levelRadioChange(e.target.value);
                // }}
                // value={level._allCustomer ? -1 : 0}
                onChange={(e) => {
                  this.targetCustomerRadioChange(e.target.value);
                }}
                value={marketingBean.get('joinLevel') ? Number(marketingBean.get('joinLevel')) : -1}
              >
                {/*<Radio value={-1}>Full platform consumer</Radio>*/}
                {/*{util.isThirdStore() && <Radio value={0}>In-store customer</Radio>}*/}
                <Radio value={-1}><FormattedMessage id="Marketing.all" /></Radio>
                <Radio value={-3}><FormattedMessage id="Marketing.Selectgroup" /></Radio>
              </RadioGroup>
              {/*{level._levelPropsShow && (*/}
              {/*  <div>*/}
              {/*    <Checkbox indeterminate={level._indeterminate} onChange={(e) => this.allLevelChecked(e.target.checked)} checked={level._checkAll}>*/}
              {/*      All Leave*/}
              {/*    </Checkbox>*/}
              {/*    <CheckboxGroup options={this.renderCheckboxOptions(customerLevel)} onChange={this.levelGroupChange} value={level._checkedLevelList} />*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          )}
        </FormItem>

        {marketingBean.get('joinLevel') == -3 && (
          <FormItem {...formItemLayout} required={true} labelAlign="left">
            {getFieldDecorator('segmentIds', {
              initialValue: marketingBean.get('segmentIds') && marketingBean.get('segmentIds').size > 0 ? marketingBean.get('segmentIds').toJS()[0] : null,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value && marketingBean.get('joinLevel') === -3) {
                      callback(
                        (window as any).RCi18n({
                          id: 'Marketing.Pleaseselectgroup'
                        })
                      );
                    }
                    callback();
                  }
                }
              ]
            })(
              <Select
                style={{ width: 520 }}
                onChange={this.selectGroupOnChange}
                // defaultValue={232}
                // value={marketingBean.get('segmentIds') && marketingBean.get('segmentIds').size > 0 ? marketingBean.get('segmentIds').toJS()[0] : null}
              >
                {allGroups.size > 0 &&
                  allGroups.map((item) => (
                    <Select.Option key={item.get('id')} value={item.get('id')}>
                      {item.get('name')}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>
        )}
        <Row type="flex" justify="start">
          {/*<Col span={3} />*/}
          <Col span={10}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="Marketing.Save" />
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}><FormattedMessage id="Marketing.Cancel" /></Button>
          </Col>
        </Row>
        {loading && <Spin className="loading-spin" />}
        {/*<GoodsModal visible={this.state.goodsModal._modalVisible} selectedSkuIds={this.state.goodsModal._selectedSkuIds} selectedRows={this.state.goodsModal._selectedRows} onOkBackFun={this.skuSelectedBackFun} onCancelBackFun={this.closeGoodsModal} />*/}
      </Form>
    );
  }

  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;
    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
  renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    const { marketingBean } = this.state;
    const goodsList = marketingBean.get('goodsList');
    if (goodsList) {
      const goodsList = marketingBean.get('goodsList');
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('goodsInfoPage')
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('goodsInfoId')));
      } else {
        selectedRows = goodsList.get('goodsInfoPage').get('content');
      }
      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          const cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(goodsList.get('cates') || []).find((s) => s.get('cateId') === cId);
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find((s) => s.get('brandId') === bId);
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          return goodInfo;
        })
      );
    } else {
      return fromJS([]);
    }
  };

  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId))
    });
  };

  /**
   * 处理返回结果
   * @param response
   * @private
   */
  _responseThen = (response) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      history.push('/marketing-list');
    }
    // this.setState({ saveLoading: false });
  };
}

export default injectIntl(FreeShippingAddForm)
