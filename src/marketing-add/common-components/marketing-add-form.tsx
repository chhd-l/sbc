import * as React from 'react';
import { fromJS, List, Map } from 'immutable';

import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Spin, Tree, TreeSelect } from 'antd';
import { Const, history, QMMethod, util, cache, ValidConst, noop } from 'qmkit';
import moment from 'moment';
import GiftLevels from '../full-gift/components/gift-levels';
import DiscountLevels from '../full-discount/components/discount-levels';
import FirstDiscountLevels from '../first-order-discount/components/discount-levels';
import ReductionLevels from '../full-reduction/components/reduction-levels';
// import ReductionSubscritionLevels from '../full-reduction/components/reduction-subscrition-levels';
import { GoodsModal } from 'biz';
import SelectedGoodsGrid from './selected-goods-grid';

import * as webapi from '../webapi';
import * as Enum from './marketing-enum';
import { Relax } from 'plume2';

import { doc } from 'prettier';
import { IList } from '../../../typings/globalType';
// import debug = doc.debug;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;
const { SHOW_PARENT } = TreeSelect;

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
const radioStyle = {
  display: 'block',
  height: '40px',
  lineHeight: '40px'
};

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0'
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1'
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2'
      }
    ]
  }
];
const TreeNode = Tree.TreeNode;

@Relax
export default class MarketingAddForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    // const relaxProps = props.store.state();
    this.state = {
      //????????????????????????
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },

      //????????????
      customerLevel: [],
      //???????????????
      selectedLevelIds: [],
      // //????????????
      // marketingBean: relaxProps.get('marketingBean'),
      //????????????????????????
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //????????????????????????
      // isFullCount: null,
      //????????????????????????????????????????????????skuId
      skuExists: [],
      saveLoading: false,
      promotionCode: '',
      promotionCode2: '', //???????????????????????????promotionCode
      timeZone: moment,
      // allGroups: relaxProps.get('allGroups'),
      // storeCateList: relaxProps.get('storeCateList'),
      // sourceStoreCateList: relaxProps.get('sourceStoreCateList'),
      // attributesList: relaxProps.get('attributesList'),
      // loading: relaxProps.get('loading')
    };
  }

  props: {
    form: any;
    relaxProps?: {
      allGroups: any;
      marketingBean: any;
      loading: boolean;
      storeCateList: any;
      sourceStoreCateList: any;
      attributesList: any;
      selectedRows: any;
      selectedSkuIds: any;
      submitFullGift: Function;
      submitFullDiscount: Function;
      submitFullReduction: Function;
      discountBeanOnChange: Function;
      reductionBeanOnChange: Function;
      giftBeanOnChange: Function;
      deleteSelectedSku: Function;
      setSelectedProductRows: Function;
      initDefualtLevelList: Function;
      initReductionDefualtLevelList: Function;
    };
  };
  static relaxProps = {
    allGroups: 'allGroups',
    marketingBean: 'marketingBean',
    loading: 'loading',
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    attributesList: 'attributesList',
    selectedRows: 'selectedRows',
    selectedSkuIds: 'selectedSkuIds',
    submitFullGift: noop,
    submitFullDiscount: noop,
    submitFullReduction: noop,
    discountBeanOnChange: noop,
    reductionBeanOnChange: noop,
    giftBeanOnChange: noop,
    deleteSelectedSku: noop,
    setSelectedProductRows: noop,
    initDefualtLevelList: noop,
    initReductionDefualtLevelList: noop
  };

  componentDidMount() {
    // this.init();
  }

  getPromotionCode = () => {
    if (!this.state.promotionCode) {
      let randomNumber = ('0'.repeat(8) + parseInt(Math.pow(2, 40) * Math.rdmValue()).toString(32)).slice(-8);
      let timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
      let promotionCode = randomNumber + timeStamp;
      this.setState({
        promotionCode: promotionCode,
        promotionCode2: promotionCode
      });
      return promotionCode;
    } else {
      return this.state.promotionCode;
    }
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



  scopeTypeOnChange = (value) => {
    this.setState({
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      // selectedSkuIds: [],
      // selectedRows: fromJS([])
    });
    this.onBeanChange({
      scopeType: value,
      storeCateIds: [],
      attributeValueIds: []
    });
  };
  targetCustomerRadioChange = (value) => {
    this.onBeanChange({
      joinLevel: value,
      emailSuffixList: [],
      segmentIds: []
    });
  };

  selectGroupOnChange = (value) => {
    let segmentIds = [];
    segmentIds.push(value);
    this.onBeanChange({ segmentIds });
  };
  // selectAttributeOnChange = (value) => {
  //   let attributeIds = [];
  //   attributeIds.push(value);
  //   this.onBeanChange({ attributeIds });
  // };

  attributeChange = (value) => {
    let attributeValueIds = [];
    value.forEach((item) => {
      attributeValueIds.push(item.value);
    });
    this.onBeanChange({
      attributeValueIds
    });
  };
  storeCateChange = (value, _label, extra) => {
    const { sourceStoreCateList } = this.props.relaxProps;
    const sourceGoodCateList = sourceStoreCateList;
    // ???????????????????????? [{value: 1, label: xx},{value: 2, label: yy}]
    // ??????????????????

    // ???????????????????????????
    let originValues = fromJS(value.map((v) => v.value));

    // ????????????x????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (extra.clear || !extra.checked) {
      sourceGoodCateList.forEach((cate) => {
        // ????????????????????????
        if (extra.triggerValue == cate.get('storeCateId') && cate.get('cateParentId') == 0) {
          // ???????????????????????????????????????
          const children = sourceGoodCateList.filter((ss) => ss.get('cateParentId') == extra.triggerValue);
          // ?????????????????????????????????
          originValues = originValues.filter((v) => children.findIndex((c) => c.get('storeCateId') == v) == -1);
        }
      });
    }

    // ??????????????????????????????????????????????????????
    // ????????????extra??????????????????api????????????????????????????????????????????????????????????????????????else???
    originValues.forEach((v) => {
      sourceGoodCateList.forEach((cate) => {
        // ?????????????????????????????????????????????r
        if (v == cate.get('storeCateId') && cate.get('cateParentId') != 0) {
          // ???????????????????????????????????????????????????????????????
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
    this.onBeanChange({
      storeCateIds
    });
  };

  /**
   * ???????????????????????????
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
  /**
   * Attribute?????????????????????
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

  // @ts-ignore
  render() {
    const { marketingType, marketingId, form } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { customerLevel, sourceGoodCateList, skuExists, saveLoading } = this.state;
    const { marketingBean, allGroups, attributesList, loading, storeCateList, selectedRows, deleteSelectedSku, selectedSkuIds } = this.props.relaxProps;
    const parentIds = sourceGoodCateList ? sourceGoodCateList.toJS().map((x) => x.cateParentId) : [];
    const storeCateValues = [];
    const storeCateIds = marketingBean.get('storeCateIds'); //fromJS([1275])
    if (storeCateIds) {
      storeCateIds.toJS().map((id) => {
        if (!parentIds.includes(id)) {
          storeCateValues.push({ value: id });
        }
      });
    }
    const attributeDefaultValue = [];
    if (marketingBean.get('attributeValueIds')) {
      marketingBean.get('attributeValueIds').map((item) => {
        attributeDefaultValue.push({ value: item });
      });
    }

    let settingLabel = '';
    let settingLabel1 = 'setting rules';
    let settingType = 'discount';
    let settingRuleFrom = { ...formItemLayout };
    if (marketingBean.get('promotionType') === 1) {
      if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
        settingRuleFrom = { ...largeformItemLayout };
        settingLabel = 'For the first subscription order,discount';
        settingLabel1 = 'For the rest subscription order,discount';
        settingType = 'discount';
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
        settingRuleFrom = { ...largeformItemLayout };
        settingLabel = 'For the first subscription order,reduction';
        settingLabel1 = 'For the rest subscription order,reduction';
        settingType = 'reduction';
      }
    }
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
        <FormItem {...formItemLayout} label="Promotion type:" labelAlign="left">
          <div className="ant-form-inline">
            <Radio.Group onChange={e => this.promotionType(marketingType, e)} value={marketingBean.get('promotionType')}>
              <Radio value={0}>Normal promotion</Radio>
              <Radio value={1}>Subscription promotion</Radio>
            </Radio.Group>
            {/*{marketingBean.get('promotionType') === 1 ? (*/}
            {/*  <Checkbox onChange={(e) => this.onBeanChange({*/}
            {/*    isClub: e.target.checked*/}
            {/*  })} checked={marketingBean.get('isClub')}>*/}
            {/*    Club*/}
            {/*  </Checkbox>*/}
            {/*) : null}*/}
          </div>
        </FormItem>
        <div className="bold-title">Basic Setting</div>
        <FormItem {...smallformItemLayout} label="Promotion Code" labelAlign="left">
          {getFieldDecorator('promotionCode', {
            initialValue: marketingBean.get('promotionCode') ? marketingBean.get('promotionCode') : this.getPromotionCode(),
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input promotion code'
              },
              { min: 1, max: 20, message: '1-20 words' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, 'Promotion code');
                }
              }
            ]
          })(
            <Input
              onChange={(e) => {
                this.setState({
                  promotionCode: e.target.value
                });
              }}
              disabled={marketingBean.get('promotionType') === 1 || marketingBean.get('publicStatus') == 1}
              style={{ width: 160 }}
            />
          )}

          <Checkbox
            style={{ marginLeft: 20 }}
            disabled={marketingBean.get('promotionType') === 1}
            checked={marketingBean.get('publicStatus') == 1}
            onChange={(e) => {
              this.onBeanChange({
                publicStatus: e.target.checked ? 1 : 0
              });
            }}
          >
            Public
          </Checkbox>
        </FormItem>

        <FormItem {...smallformItemLayout} label="Promotion Name" labelAlign="left">
          {getFieldDecorator('marketingName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input Promotion Name'
              },
              { min: 1, max: 40, message: '1-40 words' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, 'Promotion Name');
                }
              }
            ],
            onChange: (e) => this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(<Input placeholder="Please input promotion name ,no  more than 40 words." style={{ width: 360 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Start and end time" labelAlign="left">
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: 'Please select Starting and end time'
              },
              {
                validator: (_rule, value, callback) => {
                  if (value[0]) {
                    callback();
                  } else {
                    callback('Please select Starting and end time');
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
          })(
            <RangePicker
              getCalendarContainer={() => document.getElementById('page-content')}
              allowClear={false}
              format={Const.DATE_FORMAT}
              //defaultValue = {moment[undefined,undefined]}
              //format={'YYYY-MM-DD' + ' ' + moment(sessionStorage.getItem('zoneDate')).format('hh:mm:ss ')}
              // format={'YYYY-MM-DD' + ' ' + this.state.timeZone}
              placeholder={['Start time', 'End time']}
              showTime={{ format: 'HH:mm' }}
              onOpenChange={this.handleEndOpenChange}
            />
          )}
        </FormItem>
        {marketingType === Enum.MARKETING_TYPE.FIRST_DISCOUNT && (
          <>
            <div className="bold-title">Discount type:</div>
            <FormItem {...formItemLayout} labelAlign="left">
              {getFieldDecorator('subType', {
                rules: [
                  {
                    required: true,
                    message: `full ${Enum.GET_MARKETING_STRING(marketingType)} type`
                  }
                ],
                initialValue: marketingBean.get('subType')
              })(
                <RadioGroup onChange={(e) => this.subTypeChange(marketingType, e)}>
                  <Radio style={radioStyle} value={0}>
                    Direct discount
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
          </>
        )}
        {marketingType === Enum.MARKETING_TYPE.FULL_GIFT && (
          <>
            <div className="bold-title">Gift type:</div>
            <FormItem {...formItemLayout} labelAlign="left">
              {getFieldDecorator('subType', {
                rules: [
                  {
                    required: true,
                    message: `full ${Enum.GET_MARKETING_STRING(marketingType)} type`
                  }
                ],
                initialValue: marketingBean.get('subType')
              })(
                <RadioGroup onChange={(e) => this.subTypeChange(marketingType, e)}>
                  <Radio style={radioStyle} value={2}>
                    Direct gift
                  </Radio>
                  {marketingBean.get('promotionType') === 1 && (
                    <Radio value={3} style={radioStyle}>
                      For <Input /> refill
                    </Radio>
                  )}
                  {marketingBean.get('promotionType') === 0 && (
                    <Radio value={0} style={radioStyle}>
                      Full amount gift
                    </Radio>
                  )}
                  {marketingBean.get('promotionType') === 0 && (
                    <Radio value={1} style={radioStyle}>
                      Full quantity gift{' '}
                    </Radio>
                  )}
                </RadioGroup>
              )}
            </FormItem>
          </>
        )}
        {marketingType === Enum.MARKETING_TYPE.FULL_DISCOUNT && (
          <>
            <div className="bold-title">Discount type:</div>
            {marketingBean.get('promotionType') === 0 && (
              <FormItem {...formItemLayout} labelAlign="left">
                {getFieldDecorator('subType', {
                  rules: [
                    {
                      required: true,
                      message: `full ${Enum.GET_MARKETING_STRING(marketingType)} type`
                    }
                  ],
                  initialValue: marketingBean.get('subType')
                })(
                  <RadioGroup onChange={(e) => this.subTypeChange(marketingType, e)}>
                    {/*<Radio style={radioStyle} value={2}>*/}
                    {/*  Direct discount*/}
                    {/*</Radio>*/}
                    <Radio value={2} style={radioStyle}>
                      Full amount discount
                    </Radio>
                    <Radio value={3} style={radioStyle}>
                      Full quantity discount{' '}
                    </Radio>
                    {/*{this.state.PromotionTypeValue == 0 ? <Radio value={0}>Full amount {Enum.GET_MARKETING_STRING(marketingType)}</Radio> : <div></div>}*/}
                    {/*<Radio value={1}>Full quantity {Enum.GET_MARKETING_STRING(marketingType)}</Radio>*/}
                  </RadioGroup>
                )}
              </FormItem>
            )}
          </>
        )}

        {marketingType === Enum.MARKETING_TYPE.FULL_REDUCTION && (
          <>
            <div className="bold-title">Reduction type:</div>
            {marketingBean.get('promotionType') === 0 && (
              <FormItem {...formItemLayout} labelAlign="left">
                {getFieldDecorator('subType', {
                  rules: [
                    {
                      required: true,
                      message: `full ${Enum.GET_MARKETING_STRING(marketingType)} type`
                    }
                  ],
                  initialValue: marketingBean.get('subType')
                })(
                  <RadioGroup onChange={(e) => this.subTypeChange(marketingType, e)}>
                    {/*<Radio style={radioStyle} value={2}>*/}
                    {/*  Direct reduction*/}
                    {/*</Radio>*/}
                    <Radio value={0} style={radioStyle}>
                      Full amount reduction
                    </Radio>
                    <Radio value={1} style={radioStyle}>
                      Full quantity reduction{' '}
                    </Radio>
                    {/*{this.state.PromotionTypeValue == 0 ? <Radio value={0}>Full amount {Enum.GET_MARKETING_STRING(marketingType)}</Radio> : <div></div>}*/}
                    {/*<Radio value={1}>Full quantity {Enum.GET_MARKETING_STRING(marketingType)}</Radio>*/}
                  </RadioGroup>
                )}
              </FormItem>
            )}
          </>
        )}

        <FormItem {...settingRuleFrom} label={settingLabel} required={true} labelAlign="left">
          {marketingType == Enum.MARKETING_TYPE.FIRST_DISCOUNT &&
            getFieldDecorator(
              'rules',
              {}
            )(
              <FirstDiscountLevels
                form={this.props.form}
                fullDiscountLevelList={marketingBean.get('fullDiscountLevelList') && marketingBean.get('fullDiscountLevelList').toJS()}
                onChangeBack={this.onRulesChange}
                isFullCount={marketingBean.get('subType') % 2 }
                isNormal={marketingBean.get('promotionType') === 0}
              />
            )}
          {marketingType == Enum.MARKETING_TYPE.FULL_GIFT &&
            getFieldDecorator(
              'rules',
              {}
            )(
              <GiftLevels
                form={this.props.form}
                selectedRows={selectedRows}
                isNormal={marketingBean.get('promotionType') === 0}
                fullGiftLevelList={marketingBean.get('fullGiftLevelList') && marketingBean.get('fullGiftLevelList').toJS()}
                onChangeBack={this.onRulesChange}
                isFullCount={marketingBean.get('subType') % 2 }
              />
            )}
          {marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT &&
            getFieldDecorator(
              'rules',
              {}
            )(
              marketingBean.get('promotionType') === 0 ? (
                <DiscountLevels
                  form={this.props.form}
                  fullDiscountLevelList={marketingBean.get('fullDiscountLevelList') && marketingBean.get('fullDiscountLevelList').toJS()}
                  onChangeBack={this.onRulesChange}
                  isFullCount={marketingBean.get('subType') % 2}
                  isNormal={marketingBean.get('promotionType') === 0}
                />
              ) : (
                <div style={{ display: 'flex' }}>
                  <FormItem labelAlign="left">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{settingType}&nbsp;&nbsp;</span>
                    {getFieldDecorator('firstSubscriptionOrderDiscount', {
                      rules: [
                        { required: true, message: 'Amount must be entered' },
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
                      ],
                      initialValue: marketingBean.get('firstSubscriptionOrderDiscount')
                    })(
                      <Input
                        style={{ width: 100 }}
                        title={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                        placeholder={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                        onChange={(e) => {
                          this.onBeanChange({ firstSubscriptionOrderDiscount: e.target.value });
                        }}
                      />
                    )}
                    <span>&nbsp;of orginal price,&nbsp;</span>
                  </FormItem>

                  {/*<FormItem>*/}
                  {/*  <span>&nbsp;discount limit&nbsp;&nbsp;</span>*/}
                  {/*  {getFieldDecorator('subscriptionFirstLimit', {*/}
                  {/*    rules: [*/}
                  {/*      // { required: true, message: 'Must enter rules' },*/}
                  {/*      {*/}
                  {/*        validator: (_rule, value, callback) => {*/}
                  {/*          if (value) {*/}
                  {/*            if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {*/}
                  {/*              callback('1-9999');*/}
                  {/*            }*/}
                  {/*          }*/}
                  {/*          callback();*/}
                  {/*        }*/}
                  {/*        // callback();*/}
                  {/*      }*/}
                  {/*    ],*/}
                  {/*    initialValue: marketingBean.get('subscriptionFirstLimit')*/}
                  {/*  })(*/}
                  {/*    <Input*/}
                  {/*      style={{ width: 100 }}*/}
                  {/*      title={'1-9999'}*/}
                  {/*      placeholder={'1-9999'}*/}
                  {/*      onChange={(e) => {*/}
                  {/*        this.onBeanChange({ subscriptionFirstLimit: e.target.value });*/}
                  {/*      }}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*  &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}*/}
                  {/*</FormItem>*/}
                </div>
              )
            )}
          {marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION &&
            getFieldDecorator(
              'rules',
              {}
            )(
              marketingBean.get('promotionType') === 0 ? (
                <ReductionLevels
                  form={this.props.form}
                  fullReductionLevelList={marketingBean.get('fullReductionLevelList') && marketingBean.get('fullReductionLevelList').toJS()}
                  onChangeBack={this.onRulesChange}
                  isFullCount={marketingBean.get('subType') % 2 }
                  isNormal={marketingBean.get('promotionType') === 0}
                  PromotionTypeValue={marketingBean.get('promotionType')}
                />
              ) : (
                <div>
                  <FormItem labelAlign="left">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;reduction&nbsp;&nbsp;</span>
                    {getFieldDecorator('firstSubscriptionOrderReduction', {
                      rules: [
                        { required: true, message: 'Amount must be entered' },
                        {
                          validator: (_rule, value, callback) => {
                            if (value) {
                              if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                callback('0.01-99999999.99');
                              }
                            }
                            callback();
                          }
                        }
                      ],
                      initialValue: marketingBean.get('firstSubscriptionOrderReduction')
                    })(
                      <Input
                        style={{ width: 200 }}
                        placeholder={'0.01-99999999.99'}
                        onChange={(e) => {
                          this.onBeanChange({ firstSubscriptionOrderReduction: e.target.value });
                        }}
                      />
                    )}
                  </FormItem>
                </div>
              )
            )}
        </FormItem>

        {marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION && marketingBean.get('promotionType') == 1 && (
          <FormItem {...settingRuleFrom} label={settingLabel1} required={true} labelAlign="left" style={{ marginTop: '-50px' }}>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;{settingType}&nbsp;&nbsp;</span>
            {getFieldDecorator('restSubscriptionOrderReduction', {
              rules: [
                { required: true, message: 'Amount must be entered' },
                {
                  validator: (_rule, value, callback) => {
                    if (value) {
                      if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                        callback('0.01-99999999.99');
                      }
                    }
                    callback();
                  }
                }
              ],
              initialValue: marketingBean.get('restSubscriptionOrderReduction')
            })(
              <Input
                style={{ width: 200 }}
                placeholder="0.01-99999999.9922222"
                onChange={(e) => {
                  this.onBeanChange({ restSubscriptionOrderReduction: e.target.value });
                }}
              />
            )}
          </FormItem>
        )}
        {marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT && marketingBean.get('promotionType') == 1 && (
          <FormItem {...settingRuleFrom} label={settingLabel1} required={true} style={{ marginTop: '-20px' }} labelAlign="left">
            <div style={{ display: 'flex' }}>
              <FormItem>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{settingType}&nbsp;&nbsp;</span>
                {getFieldDecorator('restSubscriptionOrderDiscount', {
                  rules: [
                    { required: true, message: 'Amount must be entered' },
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
                  ],
                  initialValue: marketingBean.get('restSubscriptionOrderDiscount')
                })(
                  <Input
                    style={{ width: 100 }}
                    title={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                    placeholder={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                    onChange={(e) => {
                      this.onBeanChange({ restSubscriptionOrderDiscount: e.target.value });
                    }}
                  />
                )}
                <span>&nbsp;of orginal price,&nbsp;</span>
              </FormItem>
              {/*<FormItem>*/}
              {/*  <span>&nbsp;discount limit&nbsp;&nbsp;</span>*/}
              {/*  {getFieldDecorator('subscriptionRestLimit', {*/}
              {/*    rules: [*/}
              {/*      // { required: true, message: 'Must enter rules' },*/}
              {/*      {*/}
              {/*        validator: (_rule, value, callback) => {*/}
              {/*          if (value) {*/}
              {/*            if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {*/}
              {/*              callback('1-9999');*/}
              {/*            }*/}
              {/*          }*/}
              {/*          callback();*/}
              {/*        }*/}
              {/*        // callback();*/}
              {/*      }*/}
              {/*    ],*/}
              {/*    initialValue: marketingBean.get('subscriptionRestLimit')*/}
              {/*  })(*/}
              {/*    <Input*/}
              {/*      style={{ width: 100 }}*/}
              {/*      title={'1-9999'}*/}
              {/*      placeholder={'1-9999'}*/}
              {/*      onChange={(e) => {*/}
              {/*        this.onBeanChange({ subscriptionRestLimit: e.target.value });*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*  &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}*/}
              {/*</FormItem>*/}
            </div>
          </FormItem>
        )}

        <div className="bold-title">Select products:</div>
        <FormItem {...formItemLayout} required={true} labelAlign="left">
          {getFieldDecorator('scopeType', {
            initialValue: marketingBean.get('scopeType') ? marketingBean.get('scopeType') : 0
          })(
            <Radio.Group onChange={(e) => this.scopeTypeOnChange(e.target.value)} value={marketingBean.get('scopeType')}>
              <Radio value={0}>All</Radio>
              <Radio value={2}>Category</Radio>
              <Radio value={1}>Custom</Radio>
              <Radio value={3}>Attribute</Radio>
            </Radio.Group>
          )}
        </FormItem>
        {marketingBean.get('scopeType') === 2 && (
          <FormItem {...formItemLayout}>
            {getFieldDecorator('storeCateIds', {
              // initialValue: marketingBean.get('segmentIds') && marketingBean.get('segmentIds').size > 0 ? marketingBean.get('segmentIds').toJS()[0] : null,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if ((!value)) {//!marketingBean.get('storeCateIds') || marketingBean.get('storeCateIds').size === 0)
                      //
                      callback('Please select category.');
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
                placeholder="Please select category"
                notFoundContent="No sales category"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto', top: '390' }}
                showSearch={false}
                onChange={this.storeCateChange}
                style={{ width: 500 }}
                treeDefaultExpandAll
              >
                {this.generateStoreCateTree(storeCateList)}
              </TreeSelect>
            )}
          </FormItem>
        )}
        {marketingBean.get('scopeType') === 1 ? (
          <FormItem {...formItemLayout} required={true}>
            {getFieldDecorator(
              'goods',
              {}
            )(
              <div>
                <Button type="primary" icon="plus" onClick={this.openGoodsModal}>
                  Add products
                </Button>
                &nbsp;&nbsp;
                <SelectedGoodsGrid selectedRows={selectedRows} skuExists={skuExists} deleteSelectedSku={deleteSelectedSku} />
              </div>
            )}
          </FormItem>
        ) : null}
        {marketingBean.get('scopeType') === 3 && (
          <FormItem {...formItemLayout} required={true} labelAlign="left">
            {getFieldDecorator('attributeValueIds', {
              // initialValue: marketingBean.get('segmentIds') && marketingBean.get('segmentIds').size > 0 ? marketingBean.get('segmentIds').toJS()[0] : null,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if ((!value && marketingBean.get('scopeType') === 3)) { //marketingBean.get('attributeValueIds') || marketingBean.get('attributeValueIds').size === 0)
                      //
                      callback('Please select attribute.');
                    }
                    callback();
                  }
                }
              ]
            })(
              <TreeSelect
                id="attributeValueIds"
                defaultValue={attributeDefaultValue}
                getPopupContainer={() => document.getElementById('page-content')}
                treeCheckable={true}
                showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                treeCheckStrictly={true}
                //treeData ={getGoodsCate}
                // showCheckedStrategy = {SHOW_PARENT}
                placeholder="Please select attribute"
                notFoundContent="No sales attribute"
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
        <div className="bold-title">Target consumer:</div>
        <FormItem {...formItemLayout} required={true} labelAlign="left">
          {getFieldDecorator('joinLevel', {
            // rules: [{required: true, message: 'Please select target consumer'}],
          })(
            <div>
              <RadioGroup
                onChange={(e) => {
                  this.targetCustomerRadioChange(e.target.value);
                }}
                value={marketingBean.get('joinLevel') ? Number(marketingBean.get('joinLevel')) : -1}
              >
                {/*<Radio value={-1}>Full platform consumer</Radio>*/}
                {/*{util.isThirdStore() && <Radio value={0}>In-store customer</Radio>}*/}
                <Radio value={-1}>All</Radio>
                <Radio value={-3}>Select group</Radio>
                <Radio value={-4}>By email</Radio>
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
                      callback('Please select group.');
                    }
                    callback();
                  }
                }
              ]
            })(
              <Select style={{ width: 520 }} onChange={this.selectGroupOnChange} defaultValue={marketingBean.get('segmentIds') && marketingBean.get('segmentIds').size > 0 ? marketingBean.get('segmentIds').toJS()[0] : null}>
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
        {marketingBean.get('joinLevel') == -4 && (
          <FormItem {...formItemLayout} required={true} labelAlign="left">
            {getFieldDecorator('emailSuffixList', {
              initialValue: marketingBean.get('emailSuffixList') ? marketingBean.get('emailSuffixList').toJS()[0] : null,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value && marketingBean.get('joinLevel') === -4) {
                      callback('Please enter email suffix.');
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input
                style={{ width: 300 }}
                // defaultValue={marketingBean.get('emailSuffixList') ? marketingBean.get('emailSuffixList').toJS()[0] : null}
                onChange={(e) => {
                  const emailSuffixList = [e.target.value];
                  this.onBeanChange({ emailSuffixList });
                }}
                maxLength={30}
              />
            )}
          </FormItem>
        )}

        <Row type="flex" justify="start">
          {/*<Col span={3} />*/}
          <Col span={10}>
            <Button type="primary" htmlType="submit" loading={saveLoading}>
              Save
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}>Cancel</Button>
          </Col>
        </Row>
        {loading && <Spin className="loading-spin" />}
        <GoodsModal visible={this.state.goodsModal._modalVisible} selectedSkuIds={this.state.goodsModal._selectedSkuIds} selectedRows={this.state.goodsModal._selectedRows} onOkBackFun={this.skuSelectedBackFun} onCancelBackFun={this.closeGoodsModal} />
      </Form>
    );
  }

  /**
   * ???????????????
   * @returns {Promise<void>}
   */
  // init = async () => {
  //   let levelList = [];
  //   if (util.isThirdStore()) {
  //     const levRes = await webapi.getUserLevelList();
  //     if (levRes.res.code != Const.SUCCESS_CODE) {
  //       return;
  //     }
  //     levelList = levRes.res.context.storeLevelVOList;
  //     // ????????????????????????????????????,?????????????????????????????????
  //     levelList.forEach((level) => {
  //       level.customerLevelId = level.storeLevelId;
  //       level.customerLevelName = level.levelName;
  //     });
  //   }
  //   this.setState({ customerLevel: levelList });
  //
  //   let { marketingBean } = this.props.relaxProps;
  //   this.setState({
  //     promotionCode2: marketingBean.get('promotionCode') ? marketingBean.get('promotionCode') : this.getPromotionCode()
  //   });
  //   const subType = marketingBean.get('subType');
  //   if (subType != undefined && subType != null) {
  //     this.setState(
  //       {
  //         isFullCount: subType % 2,
  //         PromotionTypeValue: subType === 6 || subType === 7 ? 1 : 0
  //       },
  //       () => {
  //         if (marketingBean.get('marketingId')) {
  //           this.setState({
  //             PromotionTypeChecked: marketingBean.get('publicStatus') == 1
  //           });
  //         } else {
  //           this.setState({
  //             PromotionTypeChecked: this.state.PromotionTypeValue === 1 ? true : false
  //           });
  //         }
  //
  //         if (subType === 6) {
  //           let bean = marketingBean.get('fullReductionLevelList') ? marketingBean.get('fullReductionLevelList').toJS() : null;
  //           if (bean && this.state.PromotionTypeValue === 1) {
  //             marketingBean = marketingBean.set('firstSubscriptionOrderReduction', bean[0].firstSubscriptionOrderReduction);
  //             marketingBean = marketingBean.set('restSubscriptionOrderReduction', bean[0].restSubscriptionOrderReduction);
  //             this.setState({
  //               marketingBean
  //             });
  //           }
  //         } else if (subType === 7) {
  //           let bean = marketingBean.get('fullDiscountLevelList') ? marketingBean.get('fullDiscountLevelList').toJS() : null;
  //           if (bean && this.state.PromotionTypeValue === 1) {
  //             marketingBean = marketingBean.set('firstSubscriptionOrderDiscount', bean[0].firstSubscriptionOrderDiscount ? bean[0].firstSubscriptionOrderDiscount * 10 : null);
  //             marketingBean = marketingBean.set('restSubscriptionOrderDiscount', bean[0].restSubscriptionOrderDiscount ? bean[0].restSubscriptionOrderDiscount * 10 : null);
  //             this.setState({
  //               marketingBean
  //             });
  //           }
  //         }
  //       }
  //     );
  //   } else {
  //     this.setState({
  //       isFullCount: 0
  //     });
  //   }
  //   this.levelInit(marketingBean.get('joinLevel'));
  //   // render selectedRows
  //   const scopeArray = marketingBean.get('marketingScopeList');
  //   if (scopeArray && !scopeArray.isEmpty()) {
  //     const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
  //     this.setState({
  //       selectedRows: this.makeSelectedRows(scopeIds),
  //       selectedSkuIds: scopeIds.toJS()
  //     });
  //   }
  //   sessionStorage.setItem('PromotionTypeValue', 0);
  // };

  /**
   * Promotion type
   * @param joinLevel
   */
  promotionType = (marketingType, e) => {
    const { initDefualtLevelList, initReductionDefualtLevelList } = this.props.relaxProps
    if (e.target.value === 0) {
      this.onBeanChange({
        promotionType: e.target.value,
        subType:  marketingType === Enum.MARKETING_TYPE.FULL_REDUCTION ? 0 : marketingType === Enum.MARKETING_TYPE.FULL_DISCOUNT ?  2 : 0
      });
    } else {
      this.onBeanChange({
        promotionType: e.target.value,
        subType:  marketingType === Enum.MARKETING_TYPE.FULL_REDUCTION ? 6 : marketingType === Enum.MARKETING_TYPE.FULL_DISCOUNT ?  7 : 0
      });
    }
    switch (marketingType) {
      case Enum.MARKETING_TYPE.FULL_REDUCTION :
        initReductionDefualtLevelList()
        break;
      case  Enum.MARKETING_TYPE.FULL_REDUCTION:
        initDefualtLevelList()
        break;
      default:
    }
  };

  /**
   * ?????????????????????marketingBean???????????????
   * @param params
   */
  onBeanChange = (params) => {
    const { marketingBean, discountBeanOnChange, reductionBeanOnChange, giftBeanOnChange } = this.props.relaxProps;
    const { marketingType } = this.props;
    if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      discountBeanOnChange(marketingBean.merge(params));
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      reductionBeanOnChange(marketingBean.merge(params));
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      giftBeanOnChange(marketingBean.merge(params));
    }
  };
  /**
   * ???????????????
   * @param joinLevel
   */
  levelInit = (joinLevel) => {
    if (joinLevel == undefined || joinLevel == null) {
      const { customerLevel } = this.state;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      this.setState({
        level: {
          _indeterminate: false,
          _checkAll: true,
          _checkedLevelList: levelIds,
          _allCustomer: true,
          _levelPropsShow: false
        }
      });
    } else {
      if (+joinLevel === 0) {
        //?????????????????????
        this.allLevelChecked(true);
      } else if (+joinLevel === -1) {
        //???????????????
        this.levelRadioChange(-1);
      } else {
        //??????????????????
        this.levelGroupChange(joinLevel.split(','));
      }
    }
  };

  /**
   * ????????????
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { submitFullGift, submitFullDiscount, submitFullReduction, selectedSkuIds } = this.props.relaxProps;
    let { marketingBean } = this.props.relaxProps;
    let levelList = fromJS([]);
    let errorObject = {};
    const { marketingType, form } = this.props;
    // form.resetFields();
    this.setState({
      count: 1
    });
    const isFullCount = marketingBean.get('subType') % 2;
    //??????????????????
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelList = marketingBean.get('fullReductionLevelList');
      // if (marketingBean.get('promotionType') === 0) {
      //   marketingBean = marketingBean.set('subType', isFullCount ? Enum.SUB_TYPE.REDUCTION_FULL_COUNT : Enum.SUB_TYPE.REDUCTION_FULL_AMOUNT);
      // } else {
      //   marketingBean = marketingBean.set('subType', 6);
      // }
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelList = marketingBean.get('fullDiscountLevelList');

      // if (marketingBean.get('promotionType') === 0) {
      //   marketingBean = marketingBean.set('subType', isFullCount ? Enum.SUB_TYPE.DISCOUNT_FULL_COUNT : Enum.SUB_TYPE.DISCOUNT_FULL_AMOUNT);
      // } else {
      //   marketingBean = marketingBean.set('subType', 7);
      // }
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelList = marketingBean.get('fullGiftLevelList');
      // marketingBean = marketingBean.set('subType', isFullCount ? Enum.SUB_TYPE.GIFT_FULL_COUNT : Enum.SUB_TYPE.GIFT_FULL_AMOUNT);
    }
    if (!levelList || (levelList.isEmpty() && marketingBean.get('promotionType') == 0)) {
      errorObject['rules'] = {
        value: null,
        errors: [new Error('Please setting rules')]
      };
    } else {
      let ruleArray = List();

      if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION && marketingBean.get('promotionType') === 0) {
        levelList.toJS().forEach((level, index) => {
          //??????????????????????????????????????????
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          if (level.fullAmount != 0) {
            if (!isFullCount && +level.fullAmount <= +level.reduction) {
              if (marketingBean.get('promotionType') == 0) {
                errorObject[`level_rule_value_${index}`] = {
                  errors: [new Error('The conditional amount must be greater than the deductible amount')]
                };
                errorObject[`level_rule_reduction_${index}`] = {
                  errors: [new Error('The deductible amount must be less than the conditional amount')]
                };
              } else {
                errorObject[`level_rule_reduction_${index}`] = {
                  errors: [new Error('The deductible amount must be less than the conditional amount')]
                };
              }
            }
          }
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT && marketingBean.get('promotionType') === 0) {
        levelList.toJS().forEach((level, index) => {
          //??????????????????????????????????????????
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
        //??????????????????????????????
        levelList.toJS().forEach((level, index) => {
          //??????????????????????????????????????????
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          //????????????????????????
          if (!level.fullGiftDetailList || level.fullGiftDetailList.length == 0) {
            errorObject[`level_${index}`] = {
              value: null,
              errors: [new Error('A full gift cannot be empty')]
            };
          }
        });
      }
      //????????????????????????????????????
      ruleArray
        .groupBy((item) => +(item as any).get('value'))
        .filter((value) => value.size > 1)
        .forEach((item) => {
          item.forEach((level) => {
            errorObject[`level_rule_value_${(level as any).get('index')}`] = {
              errors: [new Error('Multi-level promotion conditions are not the same')]
            };
          });
        });
    }

    //??????????????????
    if (selectedSkuIds.length > 0) {
      marketingBean = marketingBean.set('skuIds', selectedSkuIds);
    } else {
      if (marketingBean.get('scopeType') === 1) {
        errorObject['goods'] = {
          value: null,
          errors: [new Error('Please select the product to be marketed')]
        };
      } else if (marketingBean.get('scopeType') === 2 && (!marketingBean.get('storeCateIds') || marketingBean.get('storeCateIds').size === 0)) {
        errorObject['storeCateIds'] = {
          value: null,
          errors: [new Error('Please select category.')]
        };
      } else if (marketingBean.get('scopeType') === 3 && (!marketingBean.get('attributeValueIds') || marketingBean.get('attributeValueIds').size === 0)) {
        errorObject['attributeValueIds'] = {
          value: null,
          errors: [new Error('Please select attribute.')]
        };
      }
    }
    // if (marketingBean.get('joinLevel') == -3 && (!marketingBean.get('segmentIds') || marketingBean.get('segmentIds').size === 0)) {
    //   errorObject['joinLevel'] = {
    //     value: null,
    //     errors: [new Error('Please select group.')]
    //   };
    // }
    // if (marketingBean.get('joinLevel') == -4) {
    //   if (!marketingBean.get('emailSuffixList') || marketingBean.get('emailSuffixList').length === 0) {
    //     errorObject['joinLevel'] = {
    //       value: null,
    //       errors: [new Error('Please enter email suffix.')]
    //     };
    //   }
    //   else if (!ValidConst.email.test(marketingBean.get('emailSuffixList').toJS()[0])) {
    //     errorObject['joinLevel'] = {
    //       value: null,
    //       errors: [new Error('Please enter correct email.')]
    //     };
    //   }
    // }
    if (this.state.promotionCode) {
      marketingBean = marketingBean.set('promotionCode', this.state.promotionCode);
    }
    if (!marketingBean.get('publicStatus')) {
      marketingBean = marketingBean.set('publicStatus', '1');
    }
    form.validateFieldsAndScroll((err) => {
      if (Object.keys(errorObject).length != 0) {
        form.setFields(errorObject);
        this.setState({ saveLoading: false });
      } else {
        if (!err) {
          this.setState({ saveLoading: true });
          //??????????????????
          marketingBean = marketingBean.set('marketingType', marketingType); //.set('scopeType', 1);

          if (!marketingBean.get('joinLevel')) {
            marketingBean = marketingBean.set('joinLevel', -1); //.set('scopeType', 1);
          }
          if (!marketingBean.get('scopeType')) {
            marketingBean = marketingBean.set('scopeType', 0); //.set('scopeType', 1);
          }
          //?????????????????? + ?????????????????? => ??????  ????????????????????????????????????????????????
          if (marketingBean.get('beginTime') && marketingBean.get('endTime')) {
            // webapi
            //   .skuExists({
            //     skuIds: selectedSkuIds,
            //     marketingType,
            //     startTime: marketingBean.get('beginTime'),
            //     endTime: marketingBean.get('endTime'),
            //     excludeId: marketingBean.get('marketingId')
            //   })
            //   .then(({ res }) => {
            // if (res.code == Const.SUCCESS_CODE) {
            if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
              submitFullGift(marketingBean.toJS()).then((res) => this._responseThen(res));
            } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
              marketingBean = marketingBean.set(
                'fullDiscountLevelList',
                marketingBean.get('fullDiscountLevelList').map((item) => item.set('discount', item.get('discount') / 10))
              );
              let obj = {
                firstSubscriptionOrderDiscount: marketingBean.get('firstSubscriptionOrderDiscount') / 10,
                restSubscriptionOrderDiscount: marketingBean.get('restSubscriptionOrderDiscount') / 10,
                subscriptionFirstLimit: marketingBean.get('subscriptionFirstLimit'),
                subscriptionRestLimit: marketingBean.get('subscriptionRestLimit')
              };

              marketingBean = marketingBean.set('marketingSubscriptionDiscount', obj);
              submitFullDiscount(marketingBean.toJS()).then((res) => this._responseThen(res));
            } else {
              let obj = {
                firstSubscriptionOrderReduction: marketingBean.get('firstSubscriptionOrderReduction'),
                restSubscriptionOrderReduction: marketingBean.get('restSubscriptionOrderReduction'),
                subscriptionFirstLimit: marketingBean.get('subscriptionFirstLimit'),
                subscriptionRestLimit: marketingBean.get('subscriptionRestLimit')
              };
              marketingBean = marketingBean.set('marketingSubscriptionReduction', obj);
              submitFullReduction(marketingBean.toJS()).then((res) => this._responseThen(res));
            }
            //  }
            // });
          }
        }
      }
    });
  };
  initLevel = (levelType) => {
    const initLevel = [
      {
        key: this.makeRandom(),
        fullAmount: null,
        fullCount: null,
        discount: null
      }
    ];
  }
  /**
   * ????????????????????????key???
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.rdmValue() as any).toFixed(6) * 1000000;
  };
  /**
   * ??????????????????
   * @param marketingType
   * @param e
   */
  subTypeChange = (marketingType, e) => {
    const { initDefualtLevelList, initReductionDefualtLevelList, marketingBean } = this.props.relaxProps
    const _thisRef = this;
    let levelType = '';
    // Session ??????????????????????????????seesion, ???????????????cookie???
    // JWT???????????????: ????????????JWT????????????(?????????????????????????????????)?????????????????????
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelType = 'fullReductionLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelType = 'fullDiscountLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelType = 'fullGiftLevelList';
    }
    if (levelType == '' || !marketingBean.get(levelType)) return;
    if (marketingBean.get(levelType).size > 0) {
      Confirm({
        title: 'Switch type',
        content: 'Switching types will clear the set rules. Do you want to continue?',
        onOk() {
          for (let i = 0; i < marketingBean.get(levelType).size; i++) {
            _thisRef.props.form.resetFields(`level_${i}`);
          }
          let beanObject = {
            // [levelType]: fromJS([]),
            subType: e.target.value
          };
          _thisRef.onBeanChange(beanObject);
          if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
            initReductionDefualtLevelList()
          } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
            initDefualtLevelList()
          } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {

          }
        }
        // onCancel() {
        //   _thisRef.props.form.setFieldsValue({ subType: isFullCount });
        // }
      });
    }
  };

  /**
   * ??????????????????
   * @param checked
   */
  allLevelChecked = (checked) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    this.setState({
      level: {
        _indeterminate: false,
        _checkAll: checked,
        _checkedLevelList: checked ? levelIds : [],
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * ???????????? ??? ????????????  ??????
   * @param value
   */
  levelRadioChange = (value) => {
    this.props.form.resetFields('targetCustomer');
    let { level, customerLevel } = this.state;
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    level._allCustomer = value === -1;
    level._levelPropsShow = value === 0;
    if (value == 0 && level._checkedLevelList.length == 0) {
      level._indeterminate = false;
      level._checkAll = true;
      level._checkedLevelList = levelIds;
    }
    this.setState(level);
  };

  /**
   * ????????????????????????
   * @param checkedList
   */
  levelGroupChange = (checkedList) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
    this.setState({
      level: {
        _indeterminate: !!checkedList.length && checkedList.length < customerLevel.length,
        _checkAll: checkedList.length === customerLevel.length,
        _checkedLevelList: checkedList,
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * ??????????????????
   * @param rules
   */
  onRulesChange = (rules) => {
    const { marketingType } = this.props;
    this.props.form.resetFields('rules');
    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      this.onBeanChange({ fullGiftLevelList: rules });
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      this.onBeanChange({ fullDiscountLevelList: rules });
    } else {
      this.onBeanChange({ fullReductionLevelList: rules });
    }
  };

  onSubscriptionChange = (props, value) => {
    const { marketingBean } = this.props.relaxProps;
    const { marketingType } = this.props;
    // this.props.form.resetFields('rules');
    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      let obj = marketingBean.get('marketingSubscriptionDiscount');
      obj[props] = value;
      this.onBeanChange({ marketingSubscriptionDiscount: obj });
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      let obj = marketingBean.get('marketingSubscriptionDiscount');
      obj[props] = value;
      this.onBeanChange({ marketingSubscriptionDiscount: obj });
    } else {
      let obj = marketingBean.get('marketingSubscriptionReduction') ? marketingBean.get('marketingSubscriptionReduction').toJS() : {};
      obj[props] = value;
      this.onBeanChange({ marketingSubscriptionReduction: obj });
    }
  };

  /**
   * ?????????????????????????????????
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    this.props.form.resetFields('goods');
    const { setSelectedProductRows } = this.props.relaxProps;
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows,
      goodsModal: { _modalVisible: false }
    });
    setSelectedProductRows({ selectedRows, selectedSkuIds: selectedSkuIds });
  };

  /**
   * ??????????????????modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.props.relaxProps;
    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * ??????????????????modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * ???????????????checkBox
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
   * ??????????????????
   * @param response
   * @private
   */
  _responseThen = (response) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      history.push('/marketing-list');
    }
    this.setState({ saveLoading: false });
  };
}
