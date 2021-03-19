import React, { Component } from 'react';

import { Button, Col, DatePicker, Form, Input, message, Radio, Row, Select, Spin, Tree, TreeSelect } from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';

import { Const, noop, QMMethod, ValidConst, history, cache } from 'qmkit';
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
export default class CouponInfoForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
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
    fieldsValue: noop,
    changeDateRange: noop,
    chooseScopeType: noop,
    addCoupon: noop,
    editCoupon: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop,
    changeBtnDisabled: noop,
    dealErrorCode: noop
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

  targetCustomerRadioChange = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({
      field: 'couponJoinLevel',
      value: value
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
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      couponName,
      couponCates,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
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
      couponDiscount
    } = this.props.relaxProps;
    debugger;
    console.log(storeCateIds, 'storeCateIds----');
    console.log(couponJoinLevel, 'couponJoinLevel----');
    console.log(segmentIds, 'segmentIds----');
    const storeCateValues = [];
    const parentIds = sourceStoreCateList ? sourceStoreCateList.toJS().map((x) => x.cateParentId) : [];
    if (storeCateIds) {
      storeCateIds.toJS().map((id) => {
        if (!parentIds.includes(id)) {
          storeCateValues.push({ value: id });
        }
      });
    }
    console.log(storeCateValues, 'storeCateValues----');
    return (
      <RightContent>
        <Form labelAlign={'left'}>
          <FormItem {...formItemSmall} label="Coupon type" required={true}>
            {getFieldDecorator('couponPromotionType', {
              initialValue: couponPromotionType
            })(
              <RadioGroup value={couponPromotionType} onChange={(e) => this.couponPromotionTypeOnChange((e as any).target.value)}>
                <Radio value={0}>
                  <span style={styles.darkColor}>Amount</span>
                </Radio>
                <Radio value={1}>
                  <span style={styles.darkColor}>Percentage</span>
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div className="bold-title">Basic Setting</div>
          <FormItem {...formItemSmall} label="Coupon name" required={true}>
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
                placeholder="No more than one hundred words"
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
          <FormItem {...formItemLayout} label="Start and end time" required={true}>
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
                    message: 'Please input the start and end time'
                  }
                ]
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: 360 }}
                  disabled={rangeDayType === 1}
                  getCalendarContainer={() => document.getElementById('page-content')}
                  format="YYYY-MM-DD"
                  placeholder={['Start date', 'End date']}
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
              <span style={styles.greyColor}>&nbsp;&nbsp;Coupons can be created but not used before the start time</span>
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
            <FormItem {...formItemSmall} label="Coupon value" required={true}>
              <Row>
                {getFieldDecorator('denomination', {
                  initialValue: denomination,
                  rules: [
                    { required: true, message: 'Please input the face value of coupon' },
                    {
                      validator: (_rule, value, callback) => {
                        if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                          callback('Integers between 1-99999 are allowed');
                          return;
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input
                    placeholder="integer from 1 to 99999"
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
            <FormItem {...formItemSmall} label="Coupon discount" required={true}>
              <Row>
                {getFieldDecorator('couponDiscount', {
                  initialValue: couponDiscount,
                  rules: [
                    { required: true, message: 'Please input coupon discount.' },
                    {
                      validator: (_rule, value, callback) => {
                        if (value) {
                          if (!/(^[0-9]?(\.[0-9])?$)/.test(value)) {
                            callback('Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off');
                          }
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input
                    placeholder="0.1-9.9"
                    maxLength={3}
                    onChange={async (e) => {
                      await fieldsValue({
                        field: 'couponDiscount',
                        value: e.currentTarget.value
                      });
                    }}
                    style={{ width: 360 }}
                  />
                )}
                {/*<span style={styles.darkColor}>&nbsp;&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>*/}
              </Row>
            </FormItem>
          )}
          <ErrorDiv>
            <FormItem {...formItemLayout} label="Threshold" required={true} style={{ marginTop: '40px' }}>
              <RadioGroup value={fullBuyType} onChange={(e) => this.changeFullBuyType((e as any).target.value)}>
                <FormItem>
                  <Radio value={1}>
                    {/* <span style={styles.darkColor}>满&nbsp;&nbsp;</span> */}
                    {getFieldDecorator('fullBuyPrice', {
                      initialValue: fullBuyPrice,
                      rules: [
                        {
                          required: fullBuyType === 1,
                          message: 'Please input the usage threshold'
                        },
                        {
                          validator: (_rule, value, callback) => {
                            if (fullBuyType == 1 && (value || value === 0)) {
                              if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                                callback('Integers between 1-99999 are allowed');
                                return;
                              } else if (value <= parseInt(`${denomination}`)) {
                                callback('The threshold must be greater than the face value of the coupon');
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
                        placeholder="integer from 1 to 9999"
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
                    <span style={styles.darkColor}>No threshold</span>
                  </Radio>
                </FormItem>
              </RadioGroup>
            </FormItem>
          </ErrorDiv>

          <div className="bold-title">Select product</div>
          <FormItem {...formItemLayout} required={true}>
            <RadioGroup value={scopeType} onChange={(e) => chooseScopeType((e as any).target.value)}>
              <Radio value={0}>
                <span style={styles.darkColor}>All products</span>
              </Radio>
              <Radio value={5}>
                <span style={styles.darkColor}>Category</span>
              </Radio>
              <Radio value={4}>
                <span style={styles.darkColor}>Custom</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          {scopeType === 4 ? (
            <FormItem id={'page-content'}>
              {/* {this.chooseGoods().dom}  {...this._scopeBoxStyle(scopeType)}*/}
              <div style={{ width: 800 }}>
                <SelectedGoodsGrid />
              </div>
            </FormItem>
          ) : null}
          {scopeType === 5 ? (
            <FormItem>
              {getFieldDecorator('storeCateIds', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (!value && scopeType === 5) {
                        callback('Please select store cate.');
                      }
                      callback();
                    }
                  }
                ]
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
                  placeholder="Please select category"
                  notFoundContent="No sales category"
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

          <div className="bold-title">Target consumer</div>
          {console.log(couponJoinLevel, 'couponJoinLevel99999999999')}
          <FormItem {...formItemLayout} required={true}>
            <RadioGroup value={-3} onChange={(e) => this.targetCustomerRadioChange(e.target.value)}>
              <Radio value={0}>All</Radio>
              <Radio value={-3}>Select group</Radio>
            </RadioGroup>
          </FormItem>
          {couponJoinLevel === -3 && (
            <FormItem>
              {getFieldDecorator('segmentIds', {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (!value && couponJoinLevel === -3) {
                        callback('Please select group.');
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Select style={{ width: 520 }} onChange={this.selectGroupOnChange} defaultValue={segmentIds && segmentIds.size > 0 ? segmentIds.toJS()[0] : null}>
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
          <div className="bold-title">Instructions for use</div>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('couponDesc', {
              initialValue: couponDesc,
              rules: [{ max: 500, message: '使用说明最多500个字符' }]
            })(
              <TextArea
                maxLength={500}
                style={{ width: 800, marginTop: '10px' }}
                placeholder={'0 to 500 Words'}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponDesc',
                    value: e.target.value
                  });
                }}
              />
            )}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button disabled={btnDisabled} type="primary" onClick={() => this.saveCoupon()} style={{ marginRight: 10 }}>
            Save
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            Cancel
          </Button>
        </div>
        {loading && <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />}
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
    const { addCoupon, editCoupon, couponId, changeBtnDisabled, startTime, rangeDayType, dealErrorCode } = this.props.relaxProps;
    changeBtnDisabled();
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
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        changeBtnDisabled();
        return;
      }
    }
    this.props.form.validateFields(null, async (errs) => {
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
    if (value == 0) {
      setFieldsValue({ fullBuyPrice: null });
    }
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
