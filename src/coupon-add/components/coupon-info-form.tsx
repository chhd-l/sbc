import React, { Component } from 'react';

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Tree,
  TreeSelect
} from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Const, noop, QMMethod, ValidConst, history, cache, RCi18n } from 'qmkit';
import moment from 'moment';
import SelectedGoodsGrid from './selected-goods-grid';
import { fromJS } from 'immutable';
import { GoodsModal } from 'biz';
import '../index.less';

const ErrorDiv = styled.div`
  margin-top: -15px;
  margin-bottom: -25px;
  .ant-form-explain {
    margin-top: 0;
  }
  .ant-col-xl-8 {
    min-width: 330px;
  }
`;

const RightContent = styled.div``;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
const formItemSmall = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const Option = Select.Option;

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
class CouponInfoForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    intl;
    relaxProps?: {
      // 优惠券Id
      couponId: string;
      // 优惠券名称
      couponName: string;
      // 优惠券分类
      couponCates: IList;
      // 优惠券分类选中Id
      couponCateIds: IList;
      // 起止时间类型 0：按起止时间，1：按N天有效
      rangeDayType: Number;
      // 优惠券开始时间
      startTime: string;
      // 优惠券结束时间
      endTime: string;
      // 有效天数
      effectiveDays: Number;
      // 优惠券面值
      denomination: Number;
      // 购满类型 0：无门槛，1：满N元可使用
      fullBuyType: Number;
      // 购满多少钱
      fullBuyPrice: Number;

      fullbuyCount: string | number;
      // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
      scopeType: Number;
      // 商品品牌
      brands: IList;
      // 商品分类
      cates: IList;
      // 选中的品牌
      chooseBrandIds: IList;
      // 选中的分类
      chooseCateIds: IList;
      // 选中的商品
      chooseSkuIds: IList;
      // 优惠券
      couponDesc: string;
      goodsModalVisible: boolean;
      goodsRows: IList;
      // 按钮禁用
      btnDisabled: boolean;
      // 聚合分类Ids
      reducedCateIds: IList;
      loading: boolean;
      sourceStoreCateList: any;
      storeCateList: any;
      couponJoinLevel: any;
      allGroups: any;
      segmentIds: any;
      storeCateIds: any;
      couponPromotionType: number | string;
      couponDiscount: number | string;
      attributesList: any;

      attributeValueIds: any;
      couponPurchaseType: any;
      marketingType: any,
      isSuperimposeSubscription: any;
      limitAmount: any;
      customProductsType:number,
      // 键值设置方法
      fieldsValue: Function;
      // 修改时间区间方法
      changeDateRange: Function;
      // 修改营销类型方法
      chooseScopeType: Function;
      // 新增优惠券
      addCoupon: Function;
      // 修改优惠券
      editCoupon: Function;
      onCancelBackFun: Function;
      onOkBackFun: Function;
      dealErrorCode: Function;
      changeBtnDisabled: Function;
      setMarketingType: Function;
    };
  };

  static relaxProps = {
    couponId: 'couponId',
    couponName: 'couponName',
    couponCates: 'couponCates',
    couponCateIds: 'couponCateIds',
    rangeDayType: 'rangeDayType',
    startTime: 'startTime',
    endTime: 'endTime',
    effectiveDays: 'effectiveDays',
    denomination: 'denomination',
    fullBuyType: 'fullBuyType',
    fullBuyPrice: 'fullBuyPrice',
    fullbuyCount: 'fullbuyCount',
    scopeType: 'scopeType',
    brands: 'brands',
    cates: 'cates',
    chooseBrandIds: 'chooseBrandIds',
    chooseCateIds: 'chooseCateIds',
    couponDesc: 'couponDesc',
    chooseSkuIds: 'chooseSkuIds',
    goodsModalVisible: 'goodsModalVisible',
    goodsRows: 'goodsRows',
    btnDisabled: 'btnDisabled',
    reducedCateIds: 'reducedCateIds',
    loading: 'loading',
    sourceStoreCateList: 'sourceStoreCateList',
    storeCateList: 'storeCateList',
    cateIds: 'cateIds',
    couponJoinLevel: 'couponJoinLevel',
    allGroups: 'allGroups',
    segmentIds: 'segmentIds',
    couponPromotionType: 'couponPromotionType',
    couponDiscount: 'couponDiscount',
    storeCateIds: 'storeCateIds',
    attributesList: 'attributesList',
    attributeValueIds: 'attributeValueIds',
    couponPurchaseType: 'couponPurchaseType',
    isSuperimposeSubscription: 'isSuperimposeSubscription',
    marketingType: 'marketingType',
    limitAmount: 'limitAmount',
    customProductsType:'customProductsType',
    fieldsValue: noop,
    changeDateRange: noop,
    chooseScopeType: noop,
    addCoupon: noop,
    editCoupon: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop,
    changeBtnDisabled: noop,
    dealErrorCode: noop,
    setMarketingType: noop
  };

  storeCateChange = (value, _label, extra) => {
    const { fieldsValue, sourceStoreCateList } = this.props.relaxProps;
    const sourceGoodCateList = sourceStoreCateList;

    // 店铺分类，结构如 [{value: 1, label: xx},{value: 2, label: yy}]
    // 店铺分类列表

    // 勾选的店铺分类列表
    let originValues = fromJS(value.map((v) => v.value));

    // 如果是点x清除某个节点或者是取消勾选某个节点，判断清除的是一级还是二级，如果是二级可以直接清；如果是一级，连带把二级的清了
    if (extra.clear || !extra.checked) {
      sourceGoodCateList.forEach((cate) => {
        // 删的是某个一级的
        if (extra.triggerValue == cate.get('storeCateId') && cate.get('cateParentId') == 0) {
          // 找到此一级节点下的二级节点
          const children = sourceGoodCateList.filter((ss) => ss.get('cateParentId') == extra.triggerValue);
          // 把一级的子节点也都删了
          originValues = originValues.filter((v) => children.findIndex((c) => c.get('storeCateId') == v) == -1);
        }
      });
    }

    // 如果子节点被选中，上级节点也要被选中
    // 为了防止extra对象中的状态api变化，业务代码未及时更新，这里的逻辑不放在上面的else中
    originValues.forEach((v) => {
      sourceGoodCateList.forEach((cate) => {
        // 找到选中的分类，判断是否有上级r
        if (v == cate.get('storeCateId') && cate.get('cateParentId') != 0) {
          // 判断上级是否已添加过，如果没有添加过，添加
          let secondLevel = sourceGoodCateList.find((x) => x.get('storeCateId') === cate.get('cateParentId'));
          if (secondLevel && secondLevel.get('cateParentId') !== 0) {
            let exsit = originValues.toJS().includes(secondLevel.get('cateParentId'));
            if (!exsit) {
              originValues = originValues.push(secondLevel.get('cateParentId')); // first level
            }
          }

          let exsit = originValues.toJS().includes(cate.get('cateParentId'));
          if (!exsit) {
            originValues = originValues.push(cate.get('cateParentId')); // second level
          }
        }
      });
    });
    const storeCateIds = originValues;
    fieldsValue({
      field: 'storeCateIds',
      value: storeCateIds
    });
  };

  /**
   * 店铺分类树形下拉框
   * @param storeCateList
   */
  generateStoreCateTree = (storeCateList) => {
    return (
      storeCateList &&
      storeCateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} disabled checkable={false}>
              {this.generateStoreCateTree(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
      })
    );
  };

  targetCommonChangeValue=(field,value)=>{
    const { fieldsValue } = this.props.relaxProps;
    console.log(field,value)
      fieldsValue({
        field: field,
        value: value
      });
  }

  targetCustomerRadioChange = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({
      field: 'couponJoinLevel',
      value: value
    });
    fieldsValue({
      field: 'segmentIds',
      value: []
    });
  };

  selectGroupOnChange = (value) => {
    let segmentIds = [];
    segmentIds.push(value);
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({
      field: 'segmentIds',
      value: segmentIds
    });
  };
  couponPromotionTypeOnChange = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({
      field: 'couponPromotionType',
      value
    });

    fieldsValue({
      field: 'denomination',
      value: null
    });

    fieldsValue({
      field: 'couponDiscount',
      value: null
    });

    fieldsValue({
      field: 'fullBuyPrice',
      value: null
    })
    fieldsValue({
      field: 'fullbuyCount',
      value: null
    })
    fieldsValue({
      field: 'fullBuyType',
      value: 1
    });
  };

  attributeChange = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    let attributeValueIds = [];
    value.forEach((item) => {
      attributeValueIds.push(item.value);
    });
    fieldsValue({
      field: 'attributeValueIds',
      value: attributeValueIds
    });
  };

  /**
   * Attribute分类树形下拉框
   * @param storeCateList
   */
  generateAttributeTree = (attributesList) => {
    return (
      attributesList &&
      attributesList.map((item) => {
        if (item.get('attributesValuesVOList') && item.get('attributesValuesVOList').count()) {
          return (
            <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('attributeName')} disabled checkable={false}>
              {this.generateAttributeTree(item.get('attributesValuesVOList'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('attributeName')} />;
      })
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      couponName,
      limitAmount,
      couponCates,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      fullbuyCount,
      scopeType,
      couponDesc,
      fieldsValue,
      changeDateRange,
      chooseScopeType,
      onCancelBackFun,
      goodsModalVisible,
      chooseSkuIds,
      goodsRows,
      btnDisabled,
      loading,
      sourceStoreCateList,
      storeCateList,
      storeCateIds,
      allGroups,
      couponJoinLevel,
      segmentIds,
      couponPromotionType,
      couponDiscount,
      attributesList,
      attributeValueIds,
      couponPurchaseType,
      isSuperimposeSubscription,
      marketingType,
      setMarketingType,
      customProductsType
    } = this.props.relaxProps;
    const storeCateValues = [];
    const parentIds = sourceStoreCateList ? sourceStoreCateList.toJS().map((x) => x.cateParentId) : [];
    if (storeCateIds) {
      storeCateIds.toJS().map((id) => {
        if (!parentIds.includes(id)) {
          storeCateValues.push({ value: id });
        }
      });
    }
    const attributeDefaultValue = [];
    if (attributeValueIds) {
      attributeValueIds.map((item) => {
        attributeDefaultValue.push({ value: item });
      });
    }
    return (
      <RightContent>
        <Form labelAlign={'left'}>
          {/*<div className="bold-title"><FormattedMessage id="Marketing.CodeType" />:</div>*/}
          {/*<FormItem {...formItemLayout} labelAlign="left">*/}
          {/*  <div className="ant-form-inline">*/}
          {/*    <Radio.Group value={marketingType} onChange={(e) => {*/}
          {/*      setMarketingType(e.target.value)*/}
          {/*      fieldsValue({*/}
          {/*        field: 'marketingType',*/}
          {/*        value: e.target.value*/}
          {/*      });*/}
          {/*    }}>*/}
          {/*      <Radio value={0}><FormattedMessage id="Marketing.Promotion" /></Radio>*/}
          {/*      <Radio value={3}><FormattedMessage id="Marketing.Coupon" /></Radio>*/}
          {/*    </Radio.Group>*/}
          {/*  </div>*/}
          {/*</FormItem>*/}
          <FormItem {...formItemSmall} label={<FormattedMessage id="Marketing.Coupontype" />} required={true}>
            {getFieldDecorator('couponPromotionType', {
              initialValue: couponPromotionType
            })(
              <>
                <RadioGroup value={couponPromotionType} onChange={(e) => this.couponPromotionTypeOnChange((e as any).target.value)}>
                  <Radio value={0}>
                    <span style={styles.darkColor}><FormattedMessage id="Marketing.Amount" /></span>
                  </Radio>
                  <Radio value={1}>
                    <span style={styles.darkColor}><FormattedMessage id="Marketing.Percentage" /></span>
                  </Radio>
                  <Radio value={3}>
                    <span style={styles.darkColor}><FormattedMessage id="Marketing.Freeshipping" /></span>
                  </Radio>
                </RadioGroup>
              </>
            )}
          </FormItem>
          <div className="bold-title"><FormattedMessage id="Marketing.PromotionType" />:</div>
          <FormItem {...formItemLayout} labelAlign="left">
            <div className="ant-form-inline">
              <Radio.Group
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponPurchaseType',
                    value: e.target.value
                  });
                  fieldsValue({
                    field: 'isSuperimposeSubscription',
                    value: 1
                  });
                }}
                value={couponPurchaseType}>
                <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
                <Radio value={1}><FormattedMessage id="Marketing.Autoship" /></Radio>
                {Const.SITE_NAME !== 'MYVETRECO' && <Radio value={2}><FormattedMessage id="Marketing.Club" /></Radio>}
                <Radio value={3}><FormattedMessage id="Marketing.Singlepurchase" /></Radio>
              </Radio.Group>
            </div>
          </FormItem>
          {
            couponPurchaseType == 0 &&
            <FormItem {...formItemLayout} labelAlign="left">
              <div className="ant-form-inline">
                <Checkbox checked={isSuperimposeSubscription === 0} onChange={(e) => {

                  fieldsValue({
                    field: 'isSuperimposeSubscription',
                    value: e.target.checked ? 0 : 1
                  });
                }}>
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </Checkbox>
              </div>
            </FormItem>
          }
          <div className="bold-title"><FormattedMessage id="Marketing.BasicSetting" /></div>
          <FormItem {...formItemSmall} label={couponPromotionType !== 3 ? <FormattedMessage id="Marketing.CouponName" /> : <FormattedMessage id="Marketing.Freeshippingname" />} required={true}>
            {getFieldDecorator('couponName', {
              initialValue: couponName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(rule, value, callback, 'Coupon name', 1, 100);
                  }
                }
              ]
            })(
              <Input
                placeholder={(window as any).RCi18n({
                  id: 'Marketing.Nomorethanonehundredwords'
                })}
                maxLength={100}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
                style={{ width: 360 }}
              />
            )}
          </FormItem>
          {/*<FormItem {...formItemSmall} label="优惠券分类">
            <Col span={16}>
              {getFieldDecorator('couponCateIds', {
                initialValue: couponCateIds.toJS(),
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value && value.length > 3) {
                        callback('最多可选三个分类');
                        return;
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择优惠券分类"
                  onChange={this.chooseCouponCateIds}
                >
                  {couponCates.map((cate) => {
                    return (
                      <Option
                        key={cate.get('couponCateId')}
                        disabled={cate.get('onlyPlatformFlag') == 1}
                      >
                        {cate.get('couponCateName') +
                          (cate.get('onlyPlatformFlag') == 1
                            ? '（仅限平台选择）'
                            : '')}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Col>
            <Col span={8}>
              <span style={styles.greyColor}>&nbsp;&nbsp;最多可选三个分类</span>
            </Col>
          </FormItem>*/}
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.StartAndEndTime" />} required={true}>
            {/* <RadioGroup
              value={rangeDayType}
              onChange={(e) => {
                this.changeRangeDayType((e as any).target.value);
              }}
            > */}
            <FormItem style={{ width: 800, marginBottom: 0 }}>
              {/* <Radio value={0} style={styles.radioStyle}> */}
              {getFieldDecorator('rangeDay', {
                initialValue: startTime && endTime && [moment(startTime), moment(endTime)],
                rules: [
                  {
                    required: rangeDayType === 0,
                    message: (window as any).RCi18n({
                      id: 'Marketing.PleaseInputTheStart'
                    })
                  }
                ]
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: 360 }}
                  disabled={rangeDayType === 1}
                  getCalendarContainer={() => document.getElementById('page-content')}
                  format="YYYY-MM-DD"
                  placeholder={[
                    (window as any).RCi18n({
                      id: 'Marketing.StartTime'
                    }),
                    (window as any).RCi18n({
                      id: 'Marketing.EndTime'
                    })
                  ]}
                  onChange={(e) => {
                    if (e.length > 0) {
                      changeDateRange({
                        startTime: e[0].format(Const.DAY_FORMAT),
                        endTime: e[1].format(Const.DAY_FORMAT)
                      });
                    }
                  }}
                />
              )}
              <span style={styles.greyColor}>&nbsp;&nbsp;<FormattedMessage id="Marketing.CouponsCanBe" /></span>
              {/* </Radio> */}
            </FormItem>
            {/* <FormItem>
                <Radio value={1} style={styles.lastRadioStyle}>
                  <span style={styles.darkColor}>Valid for&nbsp;&nbsp;</span>
                  {getFieldDecorator('effectiveDays', {
                    initialValue: effectiveDays,
                    rules: [
                      { required: rangeDayType === 1, message: '请输入天数' },
                      {
                        validator: (_rule, value, callback) => {
                          if (rangeDayType == 1 && (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 365)) {
                            callback('只允许输入1-365之间的整数');
                            return;
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 'auto' }}
                      disabled={rangeDayType === 0}
                      placeholder="integer from 1 to 365"
                      maxLength={'3' as any}
                      onChange={(e) => {
                        fieldsValue({
                          field: 'effectiveDays',
                          value: e.currentTarget.value
                        });
                      }}
                    />
                  )}
                  <span style={styles.darkColor}>&nbsp;&nbsp;days from the day of collection, Fill in 1 and it will be invalid at 24:00</span>
                </Radio>
              </FormItem> */}
            {/* </RadioGroup> */}
          </FormItem>
          {couponPromotionType === 0 && (
            <FormItem {...formItemSmall} label={<FormattedMessage id="Marketing.CouponValue" />} required={true}>
              <Row>
                {getFieldDecorator('denomination', {
                  initialValue: denomination,
                  rules: [
                    {
                      required: true,
                      message:
                        (window as any).RCi18n({
                          id: 'Marketing.theFaceValueOfCoupon'
                        })
                    },
                    {
                      validator: (_rule, value, callback) => {
                        if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                          callback(
                            (window as any).RCi18n({
                              id: 'Marketing.IntegersBetweenAreAllowed'
                            })
                          );
                          return;
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input
                    placeholder={
                      (window as any).RCi18n({
                        id: 'Marketing.integerfrom1to99999'
                      })
                    }
                    prefix={sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    maxLength={5}
                    onChange={async (e) => {
                      await fieldsValue({
                        field: 'denomination',
                        value: e.currentTarget.value
                      });
                      this.props.form.validateFields(['fullBuyPrice'], {
                        force: true
                      });
                    }}
                    style={{ width: 360 }}
                  />
                )}
                {/*<span style={styles.darkColor}>&nbsp;&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>*/}
              </Row>
            </FormItem>
          )}
          {couponPromotionType === 1 && (
            <FormItem {...formItemSmall} label={<FormattedMessage id="Marketing.Coupondiscount" />} required={true}>
              <div style={{ display: 'flex' }}>
                <FormItem>
                  {getFieldDecorator('couponDiscount', {
                    initialValue: couponDiscount,
                    rules: [
                      {
                        required: true,
                        message:
                          (window as any).RCi18n({
                            id: 'Marketing.Pleaseinputcoupondiscount'
                          })
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (!/^(?:[1-9][0-9]?)$/.test(value)) {
                              callback(
                                (window as any).RCi18n({
                                  id: 'Marketing.InputValuefrom1to99'
                                })
                              );
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      placeholder="1-99"
                      maxLength={3}
                      value={couponDiscount}
                      onChange={async (e) => {
                        await fieldsValue({
                          field: 'couponDiscount',
                          value: e.currentTarget.value
                        });
                      }}
                      style={{ width: 160 }}
                    />
                  )} %,
                </FormItem>
                <FormItem>
                  <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                  {getFieldDecorator(`limitAmount`, {
                    initialValue: limitAmount,
                    rules: [
                      // { required: true, message: 'Must enter rules' },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                              callback(
                                (window as any).RCi18n({
                                  id: 'Marketing.1-9999'
                                })
                              );
                            }
                          }
                          callback();
                        }
                        // callback();
                      }
                    ],
                  })(
                    <Input
                      // style={{ width: 200 }}
                      className="input-width"
                      title={
                        (window as any).RCi18n({
                          id: 'Marketing.1-9999'
                        })
                      }
                      placeholder={
                        (window as any).RCi18n({
                          id: 'Marketing.1-9999'
                        })
                      }
                      onChange={(e) => {
                        fieldsValue({
                          field: 'limitAmount',
                          value: e.target.value
                        });
                      }}
                      value={null}
                      style={{ width: 160 }}
                    />
                  )}
                  &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </FormItem>
              </div>
            </FormItem>
          )}
          {

            couponPromotionType !== 3 && (
              <>
                <ErrorDiv>
                  <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Threshold" />} required={true} style={{ marginTop: '40px' }}>
                    <RadioGroup value={fullBuyType} onChange={(e) => this.changeFullBuyType((e as any).target.value)}>
                      <FormItem>
                        <Radio value={1}>
                          {/* <span style={styles.darkColor}>满&nbsp;&nbsp;</span> */}
                          {getFieldDecorator('fullBuyPrice', {
                            initialValue: fullBuyPrice,
                            rules: [
                              {
                                required: fullBuyType === 1,
                                message: (window as any).RCi18n({
                                  id: 'Marketing.theUsageThreshold'
                                })
                              },
                              {
                                validator: (_rule, value, callback) => {
                                  if (fullBuyType == 1 && (value || value === 0)) {
                                    if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                                      callback(
                                        (window as any).RCi18n({
                                          id: 'Marketing.IntegersBetweenAreAllowed'
                                        })
                                      );
                                      return;
                                    } else if (value <= parseInt(`${denomination}`)) {
                                      callback(
                                        (window as any).RCi18n({
                                          id: 'Marketing.TheThresholdMust'
                                        })
                                      );
                                      return;
                                    }
                                  }
                                  callback();
                                }
                              }
                            ]
                          })(
                            <Input
                              // style={{ maxWidth: 170 }}
                              style={{ width: 338 }}
                              prefix={sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                              disabled={fullBuyType === 0}
                              placeholder={
                                (window as any).RCi18n({
                                  id: 'Marketing.integerfrom1to99999'
                                })
                              }
                              maxLength={5}
                              onChange={(e) => {
                                fieldsValue({
                                  field: 'fullBuyPrice',
                                  value: e.currentTarget.value
                                });
                              }}
                            />
                          )}
                        </Radio>
                        <Radio value={0}>
                          <span style={styles.darkColor}><FormattedMessage id="Marketing.NoThreshold" /></span>
                        </Radio>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                </ErrorDiv>
                <div className="bold-title"><FormattedMessage id="Marketing.SelectProducts" /></div>
                <FormItem {...formItemLayout} required={true}>
                  <RadioGroup value={scopeType} onChange={(e) => chooseScopeType((e as any).target.value)}>
                    <Radio value={0}>
                      <span style={styles.darkColor}><FormattedMessage id="Marketing.AllProducts" /></span>
                    </Radio>
                    {Const.SITE_NAME !== 'MYVETRECO' && <Radio value={5}>
                      <span style={styles.darkColor}><FormattedMessage id="Marketing.Category" /></span>
                    </Radio>}
                    <Radio value={4}>
                      <span style={styles.darkColor}><FormattedMessage id="Marketing.Custom" /></span>
                    </Radio>
                    <Radio value={6}>
                      <span style={styles.darkColor}><FormattedMessage id="Marketing.Attribute" /></span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </>
            )
          }
          {
            couponPromotionType === 3 && (
              <>
                <div className="bold-title"><FormattedMessage id="Marketing.Freeshippingtype" />:</div>
                <FormItem {...formItemLayout} labelAlign="left">
                  {getFieldDecorator(
                    'subType',
                    {}
                  )(
                    <>
                      <RadioGroup
                        value={fullBuyType} onChange={(e) => this.changeFullBuyType((e as any).target.value)}
                      >
                        {/*<FormItem>*/}
                        {/*  <Radio value={1}>All order</Radio>*/}
                        {/*</FormItem>*/}
                        <FormItem>
                          <Radio value={1}>
                            <span>
                              <FormattedMessage id="Marketing.Orderreach" /> &nbsp;
                              {getFieldDecorator('fullBuyPrice', {
                                initialValue: fullBuyPrice,
                                rules: [
                                  {
                                    required: fullBuyType === 1,
                                    message: (window as any).RCi18n({
                                      id: 'Marketing.theUsageThreshold'
                                    })
                                  },
                                  {
                                    validator: (_rule, value, callback) => {
                                      if (fullBuyType == 1 && (value || value === 0)) {
                                        if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                                          callback(
                                            (window as any).RCi18n({
                                              id: 'Marketing.IntegersBetweenAreAllowed'
                                            })
                                          );
                                          return;
                                        } else if (value <= parseInt(`${denomination}`)) {
                                          callback(
                                            (window as any).RCi18n({
                                              id: 'Marketing.TheThresholdMust'
                                            })
                                          );
                                          return;
                                        }
                                      }
                                      callback();
                                    }
                                  }
                                ]
                              })(
                                <Input
                                  style={{ width: 200 }}
                                  title={
                                    (window as any).RCi18n({
                                      id: 'Marketing.0-9999',
                                    })
                                  }
                                  disabled={fullBuyType !== 1}
                                  placeholder={
                                    (window as any).RCi18n({
                                      id: 'Marketing.integerfrom1to99999'
                                    })
                                  }
                                  maxLength={5}
                                  onChange={(e) => {
                                    fieldsValue({
                                      field: 'fullBuyPrice',
                                      value: e.currentTarget.value
                                    });
                                  }}
                                />
                              )}
                              <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                            </span>
                          </Radio>
                        </FormItem>
                        <FormItem>
                          <Radio value={2}>
                            <span>
                              <FormattedMessage id="Marketing.Orderreach" />&nbsp;
                              {getFieldDecorator('fullbuyCount', {
                                // rules: [
                                //   {
                                //     validator: (_rule, value, callback) => {
                                //       if(shippingBean.get('subType') !== 11) {
                                //         callback()
                                //       }else if (!value) {//shippingBean.get('shippingItemValue')
                                //         callback(
                                //           (window as any).RCi18n({
                                //             id: 'Marketing.Itemsmustbeentered',
                                //           })
                                //         );
                                //       } else if(!/^\+?[1-9]\d{0,3}?$/.test(value)) {
                                //         callback(
                                //           (window as any).RCi18n({
                                //             id: 'Marketing.1-9999',
                                //           })
                                //         );
                                //       }
                                //       callback();
                                //     }
                                //   }
                                // ],
                                initialValue: fullbuyCount
                              })(
                                <Input style={{ width: 200 }}
                                  onChange={(e) => {
                                    fieldsValue({
                                      field: 'fullbuyCount',
                                      value: e.currentTarget.value
                                    });
                                  }}
                                  disabled={fullBuyType !== 2}
                                />)}
                              <span>&nbsp;<FormattedMessage id="Marketing.items" /></span>
                            </span>
                          </Radio>
                        </FormItem>
                      </RadioGroup>
                    </>
                  )}
                </FormItem>
              </>
            )
          }
          {scopeType === 4 && couponPromotionType !== 3 ? (
            <>
              <FormItem {...formItemLayout} required={true}>
                {getFieldDecorator('customProductsType', {
                  initialValue: customProductsType||0,
                  onChange:(e)=>this.targetCommonChangeValue('customProductsType',e.target.value)
                })(<RadioGroup >
                  <Radio value={0}>
                    <span style={styles.darkColor}><FormattedMessage id="Marketing.Includeproduct" /></span>
                  </Radio>
                  <Radio value={1}>
                    <span style={styles.darkColor}><FormattedMessage id="Marketing.Excludeproduct" /></span>
                  </Radio>
                </RadioGroup>)}

              </FormItem>

              <FormItem id={'page-content'}>
                {/* {this.chooseGoods().dom}  {...this._scopeBoxStyle(scopeType)}*/}
                <div style={{ width: 800 }}>
                  <SelectedGoodsGrid />
                </div>
              </FormItem>
            </>
          ) : null}
          {scopeType === 5 && couponPromotionType !== 3 ? (
            <FormItem>
              {getFieldDecorator('storeCateIds', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if ((!value || value.length === 0) && scopeType === 5) {
                        //storeCateIds.size === 0
                        callback(
                          (window as any).RCi18n({
                            id: 'Marketing.Pleaseselectcategory'
                          })
                        );
                      }
                      callback();
                    }
                  }
                ],
                initialValue: storeCateValues
              })(
                <TreeSelect
                  id="storeCateIds"
                  defaultValue={storeCateValues}
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={getGoodsCate}
                  // showCheckedStrategy = {SHOW_PARENT}
                  placeholder={
                    (window as any).RCi18n({
                      id: 'Marketing.Pleaseselectcategory'
                    })
                  }
                  notFoundContent={
                    (window as any).RCi18n({
                      id: 'Marketing.Nosalescategory'
                    })
                  }
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={this.storeCateChange}
                  style={{ width: 500 }}
                  treeDefaultExpandAll
                >
                  {this.generateStoreCateTree(storeCateList)}
                </TreeSelect>
              )}
            </FormItem>
          ) : null}
          {scopeType === 6 && couponPromotionType !== 3 && (
            <FormItem {...formItemLayout} required={true} labelAlign="left">
              {getFieldDecorator('attributeValueIds', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if ((!value || value.length === 0) && scopeType === 6) {
                        //attributeValueIds.size === 0
                        callback(
                          (window as any).RCi18n({
                            id: 'Marketing.Pleaseselectattribute'
                          })
                        );
                      }
                      callback();
                    }
                  }
                ],
                initialValue: attributeDefaultValue
              })(
                <TreeSelect
                  id="attributeValueIds"
                  // defaultValue={[{value: 'A20210225023548243'}]}
                  defaultValue={attributeDefaultValue}
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={getGoodsCate}
                  // showCheckedStrategy = {SHOW_PARENT}
                  placeholder={
                    (window as any).RCi18n({
                      id: 'Marketing.Pleaseselectattribute'
                    })
                  }
                  notFoundContent={
                    (window as any).RCi18n({
                      id: 'Marketing.Noattribute'
                    })
                  }
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={this.attributeChange}
                  style={{ width: 500 }}
                  treeDefaultExpandAll
                >
                  {this.generateAttributeTree(attributesList)}
                </TreeSelect>
              )}
            </FormItem>
          )}
          <div className="bold-title"><FormattedMessage id="Marketing.TargetConsumer" /></div>
          <FormItem {...formItemLayout} required={true}>
            <RadioGroup defaultValue={couponJoinLevel} value={couponJoinLevel} onChange={(e) => this.targetCustomerRadioChange(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
              <Radio value={-3}><FormattedMessage id="Marketing.Selectgroup" /></Radio>
            </RadioGroup>
          </FormItem>
          {couponJoinLevel === -3 && (
            <FormItem>
              {getFieldDecorator('segmentIds', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (segmentIds.size === 0 && couponJoinLevel === -3) {
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
                <>
                  <Select style={{ width: 520 }} onChange={this.selectGroupOnChange} defaultValue={segmentIds && segmentIds.size > 0 ? segmentIds.toJS()[0] : null} value={segmentIds && segmentIds.size > 0 ? segmentIds.toJS()[0] : null}>
                    {allGroups.size > 0 &&
                      allGroups.map((item) => (
                        <Select.Option key={item.get('id')} value={item.get('id')}>
                          {item.get('name')}
                        </Select.Option>
                      ))}
                  </Select>
                </>
              )}
            </FormItem>
          )}
          {
            couponPromotionType !== 3 && (
              <>
                <div className="bold-title"> <FormattedMessage id="Marketing.InstructionsForUse" /></div>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('couponDesc', {
                    initialValue: couponDesc,
                    rules: [{
                      max: 500, message:
                        (window as any).RCi18n({
                          id: 'Marketing.Instructionsareupto500'
                        })
                    }]
                  })(
                    <TextArea
                      maxLength={500}
                      style={{ width: 800, marginTop: '10px' }}
                      placeholder={
                        (window as any).RCi18n({
                          id: 'Marketing.Instructionsareupto500'
                        })
                      }
                      onChange={(e) => {
                        fieldsValue({
                          field: 'couponDesc',
                          value: e.target.value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </>
            )
          }
        </Form>
        <div>
          <Button disabled={btnDisabled} type="primary" onClick={() => this.saveCoupon()} style={{ marginRight: 10 }}>
            <FormattedMessage id="Marketing.Save" />
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            <FormattedMessage id="Marketing.Cancel" />
          </Button>
        </div>
        {loading && <Spin className="loading-spin" />}
        <GoodsModal showValidGood={true} visible={goodsModalVisible} selectedSkuIds={chooseSkuIds.toJS()} selectedRows={goodsRows.toJS()} onOkBackFun={this._onOkBackFun} onCancelBackFun={onCancelBackFun} />
      </RightContent>
    );
  }

  /**
   * 优惠券分类选择
   */
  chooseCouponCateIds = (value) => {
    this.props.relaxProps.fieldsValue({ field: 'couponCateIds', value });
  };

  /**
   * 禁用昨天及昨天之前的日期
   */
  disabledDate = (current) => {
    return current && current.endOf('day') < moment().endOf('day');
  };

  /**
   * 品牌选择结构
   */
  _getBrandSelect = () => {
    const { brands, fieldsValue } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择品牌"
        notFoundContent="No brand"
        mode="multiple"
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
        }}
        onChange={(value) => {
          fieldsValue({ field: 'chooseBrandIds', value });
        }}
      >
        {brands.map((item) => {
          return (
            <Option key={item.get('brandId')} value={`${item.get('brandId')}`}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) =>
    cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter((cate) => cate.get('cateParentId') == item.get('storeCateId'));
        if (childCates && childCates.count()) {
          return (
            <Tree.TreeNode key={item.get('storeCateId').toString()} value={item.get('storeCateId').toString()} title={item.get('cateName').toString()}>
              {this.loop(oldCateList, childCates, item.get('storeCateId'))}
            </Tree.TreeNode>
          );
        }
        return <Tree.TreeNode key={item.get('storeCateId').toString()} value={item.get('storeCateId').toString()} title={item.get('cateName').toString()} />;
      });

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { scopeType, chooseBrandIds, chooseCateIds, cates, chooseSkuIds } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (scopeType === 0) {
      return { dom: 'All products' };
    } else if (scopeType === 1) {
      return {
        dom: getFieldDecorator('chooseBrandIds', {
          initialValue: chooseBrandIds.toJS(),
          rules: [{ required: true, message: '请选择品牌' }]
        })(this._getBrandSelect())
      };
    } else if (scopeType === 3) {
      return {
        dom: getFieldDecorator('chooseCateIds', {
          initialValue: chooseCateIds.toJS(),
          rules: [{ required: true, message: '请选择店铺分类' }]
        })(
          <TreeSelect
            treeCheckable={true}
            getPopupContainer={() => document.getElementById('page-content')}
            placeholder="请选择店铺分类"
            notFoundContent="暂无店铺分类"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={(TreeSelect as any).SHOW_PARENT}
            onChange={(value) => {
              this.chooseCate(value);
            }}
          >
            {this.loop(fromJS(cates), fromJS(cates), 0)}
          </TreeSelect>
        )
      };
    } else if (scopeType == 4) {
      return {
        dom: getFieldDecorator('chooseSkuIds', {
          initialValue: chooseSkuIds.toJS(),
          rules: [{ required: true, message: '请选择商品' }]
        })(<SelectedGoodsGrid />)
      };
    }
  };

  /**
   * 保存优惠券
   */
  saveCoupon = () => {
    const { addCoupon, editCoupon, couponId, changeBtnDisabled, startTime, rangeDayType, dealErrorCode, attributeValueIds, storeCateIds } = this.props.relaxProps;
    changeBtnDisabled();
    let errorObject = {};
    if (!couponId) {
      //强制校验创建时间
      if (
        rangeDayType == 0 &&
        moment(new Date(sessionStorage.getItem('defaultLocalDateTime')))
          .hour(0)
          .minute(0)
          .second(0)
          .unix() > moment(startTime).unix()
      ) {
        this.props.form.setFields({
          rangeDay: {
            errors: [new Error(
              (window as any).RCi18n({
                id: 'Marketing.starttimecannotbelessthancurrenttime'
              })
            )]
          }
        });
        changeBtnDisabled();
        return;
      }
    }
    // if(!attributeValueIds || attributeValueIds.size === 0) {
    //   errorObject['attributeValueIds'] = {
    //     value: null,
    //     errors: [new Error('Please select attribute.')]
    //   };
    //
    // } else if (!storeCateIds || storeCateIds.size === 0) {
    //   errorObject['storeCateIds'] = {
    //     value: null,
    //     errors: [new Error('Please select store cate.')]
    //   };
    // }
    this.props.form.validateFields(null, async (errs) => {
      // if (Object.keys(errorObject).length != 0) {
      //   this.props.form.setFields(errorObject);
      //   return
      // }
      //如果校验通过
      if (!errs) {
        const res = await (couponId ? editCoupon() : addCoupon());
        //成功时候没有返回
        if (!res) {
          return;
        }
        if (res.code === 'K-080103') {
          const ids = await dealErrorCode(res);
          this.props.form.setFieldsValue({
            couponCateIds: ids.toJS()
          });
        } else {
        }
      } else {
        changeBtnDisabled();
      }
    });
  };

  /**
   * 修改区间天数类型
   */
  changeRangeDayType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    if (value === 0 || value === 1) {
      resetFields(['effectiveDays', 'rangeDay']);
    }
    if (value == 0) {
      setFieldsValue({ effectiveDays: '' });
    } else if (value == 1) {
      setFieldsValue({ rangeDay: [0, 0] });
    }
    fieldsValue({ field: 'rangeDayType', value });
  };

  /**
   * 修改使用门槛类型
   */
  changeFullBuyType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    resetFields('fullBuyPrice');
    resetFields('fullbuyCount');
    setFieldsValue({ fullBuyPrice: null });
    setFieldsValue({ fullbuyCount: null });
    fieldsValue({
      field: 'fullBuyPrice',
      value: null
    })
    fieldsValue({
      field: 'fullbuyCount',
      value: null
    })
    fieldsValue({
      field: 'fullBuyType',
      value
    });
  };

  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }

  /**
   * 改变已选商品的样式
   */
  _scopeBoxStyle = (scopeType) => {
    return scopeType === 4 ? { ...formItemLayout } : { ...formItemSmall };
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    // this.props.form.validateFields((_errs) => {});
    this.props.relaxProps.onOkBackFun(skuIds, rows);
  };

  /**
   * 选择店铺分类
   */
  chooseCate = (value) => {
    const { fieldsValue, reducedCateIds } = this.props.relaxProps;
    let ids = fromJS([]);
    fromJS(value).forEach((v) => {
      const cate = reducedCateIds.find((c) => c.get('cateId') == v);
      if (cate) {
        ids = ids.concat(cate.get('cateIds'));
      } else {
        ids = ids.push(v);
      }
    });
    fieldsValue({ field: 'chooseCateIds', value: ids });
  };
}

export default injectIntl(CouponInfoForm)
const styles = {
  greyColor: {
    fontSize: 12,
    color: '#999',
    wordBreak: 'keep-all'
  },
  darkColor: {
    fontSize: 12,
    color: '#333'
  },
  radioStyle: {
    display: 'block'
  },
  lastRadioStyle: {
    display: 'block',
    marginTop: 10
  }
} as any;
