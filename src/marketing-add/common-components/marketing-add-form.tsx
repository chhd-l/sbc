import * as React from 'react';
import { fromJS, List } from 'immutable';

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row
} from 'antd';
import { Const, history, QMMethod, util } from 'qmkit';
import moment from 'moment';
import GiftLevels from '../full-gift/components/gift-levels';
import DiscountLevels from '../full-discount/components/discount-levels';
import ReductionLevels from '../full-reduction/components/reduction-levels';
import { GoodsModal } from 'biz';
import SelectedGoodsGrid from './selected-goods-grid';

import * as webapi from '../webapi';
import * as Enum from './marketing-enum';
import { doc } from 'prettier';
// import debug = doc.debug;

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
    span: 6
  },
  wrapperCol: {
    span: 10
  }
};

export default class MarketingAddForm extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    const relaxProps = props.store.state();
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //营销活动已选的商品信息
      selectedSkuIds: [],
      selectedRows: fromJS([]),
      //全部等级
      customerLevel: [],
      //选择的等级
      selectedLevelIds: [],
      //营销实体
      marketingBean: relaxProps.get('marketingBean'),
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //满金额还是满数量
      isFullCount: null,
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      saveLoading: false,
      promotionCode: '',
      promotionCode2: '', //记录初始自动生成的promotionCode
      PromotionTypeValue: 0,
      PromotionTypeChecked: true
    };
  }

  componentDidMount() {
    this.init();
  }

  getPromotionCode = () => {
    if (!this.state.promotionCode) {
      let randomNumber = (
        '0'.repeat(8) + parseInt(Math.pow(2, 40) * Math.random()).toString(32)
      ).slice(-8);
      let timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime'))
        .getTime()
        .toString()
        .slice(-10);
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

  // @ts-ignore
  render() {
    const { marketingType, marketingId, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      customerLevel,
      selectedRows,
      marketingBean,
      level,
      isFullCount,
      skuExists,
      saveLoading
    } = this.state;
    let settingLabel = 'setting rules';
    let settingRuleFrom = { ...formItemLayout };

    if (this.state.PromotionTypeValue === 1) {
      settingRuleFrom = { ...largeformItemLayout };
      if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
        settingLabel = 'For the first subscription order,discount';
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
        settingLabel = 'For the first subscription order,reduction';
      }
    }

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
        <FormItem {...formItemLayout} label="Promotion type:">
          <Radio.Group
            onChange={this.promotionType}
            value={this.state.PromotionTypeValue}
          >
            <Radio value={0}>Normal promotion</Radio>
            <Radio value={1}>Subscription promotion</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem {...smallformItemLayout} label="Promotion Code">
          {getFieldDecorator('promotionCode', {
            initialValue: marketingBean.get('promotionCode')
              ? marketingBean.get('promotionCode')
              : this.getPromotionCode(),
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input promotion code'
              },
              { min: 4, max: 20, message: '4-20 words' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(
                    rule,
                    value,
                    callback,
                    'Promotion code'
                  );
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
              disabled={this.state.PromotionTypeChecked}
              style={{ width: 160 }}
            />
          )}

          <Checkbox
            style={{ marginLeft: 20 }}
            checked={this.state.PromotionTypeChecked}
            onChange={(e) => {
              if (this.state.PromotionTypeValue === 0) {
                this.setState({
                  PromotionTypeChecked: e.target.checked
                });

                if (e.target.checked) {
                  this.props.form.setFieldsValue({
                    promotionCode: this.state.promotionCode2
                  });
                }
              } else {
                this.setState({
                  PromotionTypeChecked: true
                });
              }
              this.onBeanChange({
                publicStatus: e.target.checked ? '1' : '0'
              });
            }}
          >
            Public
          </Checkbox>
        </FormItem>

        <FormItem {...smallformItemLayout} label="Promotion Name">
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
                  QMMethod.validatorEmoji(
                    rule,
                    value,
                    callback,
                    'Promotion Name'
                  );
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(
            <Input
              placeholder="Please input promotion name ,no  more than 40 words."
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Start and end time">
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: 'Please select Starting and end time'
              },
              {
                validator: (_rule, value, callback) => {
                  console.log(value[0].unix(), 1111);
                  console.log(
                    moment(new Date(sessionStorage.getItem('zoneDate')))
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix(),
                    1111
                  );

                  if (
                    value &&
                    moment(new Date(sessionStorage.getItem('zoneDate')))
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix() > value[0].unix()
                  ) {
                    callback("You can't start earlier than now");
                  } else {
                    callback();
                  }
                }
              }
            ],
            onChange: (date, dateString) => {
              if (date) {
                console.log(
                  moment(sessionStorage.getItem('zoneDate')).format('h:mm:ss '),
                  1111111
                );
                this.onBeanChange({
                  beginTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },
            initialValue: marketingBean.get('beginTime') &&
              marketingBean.get('endTime') && [
                moment(marketingBean.get('beginTime')),
                moment(marketingBean.get('endTime'))
              ]
          })(
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              //format={Const.DATE_FORMAT}
              format={
                'YYYY-MM-DD' +
                ' ' +
                moment(sessionStorage.getItem('zoneDate')).format('hh:mm:ss ')
              }
              placeholder={['Start time', 'End time']}
              showTime={{ format: 'HH:mm' }}
            />
          )}
        </FormItem>
        {isFullCount != null && this.state.PromotionTypeValue === 0 && (
          <FormItem
            {...formItemLayout}
            label={`full ${Enum.GET_MARKETING_STRING(marketingType)} type`}
          >
            {getFieldDecorator('subType', {
              rules: [
                {
                  required: true,
                  message: `full ${Enum.GET_MARKETING_STRING(
                    marketingType
                  )} type`
                }
              ],
              initialValue: isFullCount
            })(
              <RadioGroup
                onChange={(e) => this.subTypeChange(marketingType, e)}
              >
                {this.state.PromotionTypeValue == 0 ? (
                  <Radio value={0}>
                    Full amount {Enum.GET_MARKETING_STRING(marketingType)}
                  </Radio>
                ) : (
                  <div></div>
                )}
                <Radio value={1}>
                  Full quantity {Enum.GET_MARKETING_STRING(marketingType)}
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
        )}
        {isFullCount != null && (
          <FormItem {...settingRuleFrom} label={settingLabel} required={true}>
            {marketingType == Enum.MARKETING_TYPE.FULL_GIFT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <GiftLevels
                  form={this.props.form}
                  selectedRows={this.makeSelectedRows(null)}
                  fullGiftLevelList={
                    marketingBean.get('fullGiftLevelList') &&
                    marketingBean.get('fullGiftLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <DiscountLevels
                  form={this.props.form}
                  fullDiscountLevelList={
                    marketingBean.get('fullDiscountLevelList') &&
                    marketingBean.get('fullDiscountLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                  isNormal={this.state.PromotionTypeValue === 0}
                />
              )}
            {marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION &&
              getFieldDecorator(
                'rules',
                {}
              )(
                <ReductionLevels
                  form={this.props.form}
                  fullReductionLevelList={
                    marketingBean.get('fullReductionLevelList') &&
                    marketingBean.get('fullReductionLevelList').toJS()
                  }
                  onChangeBack={this.onRulesChange}
                  isFullCount={isFullCount}
                  isNormal={this.state.PromotionTypeValue === 0}
                  PromotionTypeValue={this.state.PromotionTypeValue}
                />
              )}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="Select products" required={true}>
          {getFieldDecorator(
            'goods',
            {}
          )(
            <div>
              <Button type="primary" icon="plus" onClick={this.openGoodsModal}>
                Add products
              </Button>
              &nbsp;&nbsp;
              <SelectedGoodsGrid
                selectedRows={selectedRows}
                skuExists={skuExists}
                deleteSelectedSku={this.deleteSelectedSku}
              />
            </div>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Target consumer" required={true}>
          {getFieldDecorator('targetCustomer', {
            // rules: [{required: true, message: '请选择目标客户'}],
          })(
            <div>
              <RadioGroup
                onChange={(e) => {
                  this.levelRadioChange(e.target.value);
                }}
                value={level._allCustomer ? -1 : 0}
              >
                <Radio value={-1}>Full platform consumer</Radio>
                {util.isThirdStore() && (
                  <Radio value={0}>In-store customer</Radio>
                )}
              </RadioGroup>
              {level._levelPropsShow && (
                <div>
                  <Checkbox
                    indeterminate={level._indeterminate}
                    onChange={(e) => this.allLevelChecked(e.target.checked)}
                    checked={level._checkAll}
                  >
                    All Leave
                  </Checkbox>
                  <CheckboxGroup
                    options={this.renderCheckboxOptions(customerLevel)}
                    onChange={this.levelGroupChange}
                    value={level._checkedLevelList}
                  />
                </div>
              )}
            </div>
          )}
        </FormItem>
        <Row type="flex" justify="start">
          <Col span={3} />
          <Col span={10}>
            <Button type="primary" htmlType="submit" loading={saveLoading}>
              Save
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}>
              Cancle
            </Button>
          </Col>
        </Row>
        <GoodsModal
          visible={this.state.goodsModal._modalVisible}
          selectedSkuIds={this.state.goodsModal._selectedSkuIds}
          selectedRows={this.state.goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
        />
      </Form>
    );
  }

  /**
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.setState({ customerLevel: levelList });

    let { marketingBean } = this.state;
    this.setState({
      promotionCode2: marketingBean.get('promotionCode')
        ? marketingBean.get('promotionCode')
        : this.getPromotionCode()
    });
    const subType = marketingBean.get('subType');
    if (subType != undefined && subType != null) {
      this.setState(
        {
          isFullCount: subType % 2,
          PromotionTypeValue: subType === 6 || subType === 7 ? 1 : 0
        },
        () => {
          this.setState({
            PromotionTypeChecked:
              this.state.PromotionTypeValue === 1 ? true : false
          });
        }
      );
    } else {
      this.setState({
        isFullCount: 0
      });
    }
    this.levelInit(marketingBean.get('joinLevel'));
    // render selectedRows
    const scopeArray = marketingBean.get('marketingScopeList');
    if (scopeArray && !scopeArray.isEmpty()) {
      const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
      this.setState({
        selectedRows: this.makeSelectedRows(scopeIds),
        selectedSkuIds: scopeIds.toJS()
      });
    }
    sessionStorage.setItem('PromotionTypeValue', 0);
  };

  /**
   * Promotion type
   * @param joinLevel
   */
  promotionType = (e) => {
    sessionStorage.setItem('PromotionTypeValue', e.target.value);
    let { marketingBean } = this.state;
    this.setState(
      {
        PromotionTypeValue: e.target.value,
        marketingBean: this.state.marketingBean.merge({
          publicStatus: e.target.value
        })
      },
      () => {
        if (this.state.PromotionTypeValue === 1) {
          this.setState({
            PromotionTypeChecked: true
            // promotionCode: this.state.promotionCode2
          });
          this.props.form.setFieldsValue({
            promotionCode: this.state.promotionCode2
          });
        }
      }
    );

    marketingBean.set('publicStatus', '1');
  };

  /**
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    this.setState({
      marketingBean: this.state.marketingBean.merge(params)
      // PromotionTypeChecked: true
    });
  };
  /**
   * 等级初始化
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
        //店铺内客户全选
        this.allLevelChecked(true);
      } else if (+joinLevel === -1) {
        //全平台客户
        this.levelRadioChange(-1);
      } else {
        //勾选某些等级
        this.levelGroupChange(joinLevel.split(','));
      }
    }
  };

  /**
   * 提交方法
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    let {
      marketingBean,
      level,
      isFullCount,
      selectedSkuIds,
      PromotionTypeValue
    } = this.state;

    let levelList = fromJS([]);
    let errorObject = {};
    marketingBean = marketingBean.set('promotionType', PromotionTypeValue);
    const { marketingType, form } = this.props;
    form.resetFields();

    //判断设置规则
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelList = marketingBean.get('fullReductionLevelList');
      if (this.state.PromotionTypeValue === 0) {
        marketingBean = marketingBean.set(
          'subType',
          isFullCount
            ? Enum.SUB_TYPE.REDUCTION_FULL_COUNT
            : Enum.SUB_TYPE.REDUCTION_FULL_AMOUNT
        );
      } else {
        marketingBean = marketingBean.set('subType', 6);
      }
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelList = marketingBean.get('fullDiscountLevelList');

      if (this.state.PromotionTypeValue === 0) {
        marketingBean = marketingBean.set(
          'subType',
          isFullCount
            ? Enum.SUB_TYPE.DISCOUNT_FULL_COUNT
            : Enum.SUB_TYPE.DISCOUNT_FULL_AMOUNT
        );
      } else {
        marketingBean = marketingBean.set('subType', 7);
      }
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelList = marketingBean.get('fullGiftLevelList');
      marketingBean = marketingBean.set(
        'subType',
        isFullCount
          ? Enum.SUB_TYPE.GIFT_FULL_COUNT
          : Enum.SUB_TYPE.GIFT_FULL_AMOUNT
      );
    }
    if (
      !levelList ||
      (levelList.isEmpty() && this.state.PromotionTypeValue == 0)
    ) {
      errorObject['rules'] = {
        value: null,
        errors: [new Error('Please setting rules')]
      };
    } else {
      let ruleArray = List();

      if (
        marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION &&
        this.state.PromotionTypeValue === 0
      ) {
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          if (!isFullCount && +level.fullAmount <= +level.reduction) {
            if (this.state.PromotionTypeValue == 0) {
              errorObject[`level_rule_value_${index}`] = {
                errors: [
                  new Error(
                    'The conditional amount must be greater than the deductible amount'
                  )
                ]
              };
              errorObject[`level_rule_reduction_${index}`] = {
                errors: [
                  new Error(
                    'The deductible amount must be less than the conditional amount'
                  )
                ]
              };
            } else {
              errorObject[`level_rule_reduction_${index}`] = {
                errors: [
                  new Error(
                    'The deductible amount must be less than the conditional amount'
                  )
                ]
              };
            }
          }
        });
      } else if (
        marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT &&
        this.state.PromotionTypeValue === 0
      ) {
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
        //满赠规则具体内容校验
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          //校验赠品是否为空
          if (
            !level.fullGiftDetailList ||
            level.fullGiftDetailList.length == 0
          ) {
            errorObject[`level_${index}`] = {
              value: null,
              errors: [new Error('A full gift cannot be empty')]
            };
          }
        });
      }
      //校验多级促销条件是否相同
      ruleArray
        .groupBy((item) => +(item as any).get('value'))
        .filter((value) => value.size > 1)
        .forEach((item) => {
          item.forEach((level) => {
            errorObject[`level_rule_value_${(level as any).get('index')}`] = {
              errors: [
                new Error('Multi-level promotion conditions are not the same')
              ]
            };
          });
        });
    }

    //判断目标等级
    if (level._allCustomer) {
      marketingBean = marketingBean.set('joinLevel', -1);
    } else {
      if (level._checkAll) {
        marketingBean = marketingBean.set('joinLevel', 0);
      } else {
        if (level._checkedLevelList.length != 0) {
          marketingBean = marketingBean.set(
            'joinLevel',
            level._checkedLevelList.join(',')
          );
        } else {
          errorObject['targetCustomer'] = {
            errors: [new Error('Please select target customers')]
          };
        }
      }
    }

    //判断选择商品
    if (selectedSkuIds.length > 0) {
      marketingBean = marketingBean.set('skuIds', fromJS(selectedSkuIds));
    } else {
      errorObject['goods'] = {
        value: null,
        errors: [new Error('Please select the product to be marketed')]
      };
    }
    if (this.state.promotionCode) {
      marketingBean = marketingBean.set(
        'promotionCode',
        this.state.promotionCode
      );
    }
    if (!marketingBean.get('publicStatus')) {
      marketingBean = marketingBean.set('publicStatus', '0');
    }

    form.validateFieldsAndScroll((err) => {
      if (Object.keys(errorObject).length != 0) {
        form.setFields(errorObject);
        this.setState({ saveLoading: false });
      } else {
        if (!err) {
          this.setState({ saveLoading: true });
          //组装营销类型
          marketingBean = marketingBean
            .set('marketingType', marketingType)
            .set('scopeType', 1);

          //商品已经选择 + 时间已经选择 => 判断  同类型的营销活动下，商品是否重复
          if (marketingBean.get('beginTime') && marketingBean.get('endTime')) {
            webapi
              .skuExists({
                skuIds: selectedSkuIds,
                marketingType,
                startTime: marketingBean.get('beginTime'),
                endTime: marketingBean.get('endTime'),
                excludeId: marketingBean.get('marketingId')
              })
              .then(({ res }) => {
                if (res.code == Const.SUCCESS_CODE) {
                  if (res.context.length > 0) {
                    this.setState({ skuExists: res.context });
                    message.error(
                      `${res.context.length} items are in conflict with each other. Please delete them before saving them`
                    );
                    this.setState({ saveLoading: false });
                  } else {
                    if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
                      this.props.store
                        .submitFullGift(marketingBean.toJS())
                        .then((res) => this._responseThen(res));
                    } else if (
                      marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT
                    ) {
                      marketingBean = marketingBean.set(
                        'fullDiscountLevelList',
                        marketingBean
                          .get('fullDiscountLevelList')
                          .map((item) =>
                            item.set('discount', item.get('discount') / 10)
                          )
                      );
                      this.props.store
                        .submitFullDiscount(marketingBean.toJS())
                        .then((res) => this._responseThen(res));
                    } else {
                      this.props.store
                        .submitFullReduction(marketingBean.toJS())
                        .then((res) => this._responseThen(res));
                    }
                  }
                }
              });
          }
        }
      }
    });
  };

  /**
   * 满系类型改变
   * @param marketingType
   * @param e
   */
  subTypeChange = (marketingType, e) => {
    const _thisRef = this;
    let levelType = '';
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelType = 'fullReductionLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelType = 'fullDiscountLevelList';
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelType = 'fullGiftLevelList';
    }
    const { marketingBean, isFullCount } = this.state;
    if (levelType == '' || !marketingBean.get(levelType)) return;
    if (marketingBean.get(levelType).size > 0) {
      Confirm({
        title: 'Switch type',
        content:
          'Switching types will clear the set rules. Do you want to continue?',
        onOk() {
          for (let i = 0; i < marketingBean.get(levelType).size; i++) {
            _thisRef.props.form.resetFields(`level_${i}`);
          }
          let beanObject = {
            [levelType]: fromJS([]),
            subType: marketingType * 2 + e.target.value
          };
          _thisRef.onBeanChange(beanObject);
          _thisRef.setState({ isFullCount: e.target.value });
        },
        onCancel() {
          _thisRef.props.form.setFieldsValue({ subType: isFullCount });
        }
      });
    }
  };

  /**
   * 勾选全部等级
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
   * 全部客户 ～ 全部等级  选择
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
   * 勾选部分等级方法
   * @param checkedList
   */
  levelGroupChange = (checkedList) => {
    this.props.form.resetFields('targetCustomer');
    const { customerLevel } = this.state;
    this.setState({
      level: {
        _indeterminate:
          !!checkedList.length && checkedList.length < customerLevel.length,
        _checkAll: checkedList.length === customerLevel.length,
        _checkedLevelList: checkedList,
        _allCustomer: false,
        _levelPropsShow: true
      }
    });
  };

  /**
   * 规则变化方法
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

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    this.props.form.resetFields('goods');
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows,
      goodsModal: { _modalVisible: false }
    });
  };

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
          const cate = fromJS(goodsList.get('cates') || []).find(
            (s) => s.get('cateId') === cId
          );
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find(
            (s) => s.get('brandId') === bId
          );
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
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    });
  };

  /**
   * 处理返回结果
   * @param response
   * @private
   */
  _responseThen = (response) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('save successful');
      history.push('/marketing-list');
    } else {
      message.error(response.res.message);
    }
    this.setState({ saveLoading: false });
  };
}
