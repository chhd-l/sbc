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
      saveLoading: false
    };
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const { marketingType, form } = this.props;

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

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
        <FormItem {...smallformItemLayout} label="促销名称">
          {getFieldDecorator('marketingName', {
            rules: [
              { required: true, whitespace: true, message: '请填写促销名称' },
              { min: 1, max: 40, message: '1-40字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '促销名称');
                }
              }
            ],
            onChange: (e) =>
              this.onBeanChange({ marketingName: e.target.value }),
            initialValue: marketingBean.get('marketingName')
          })(
            <Input
              placeholder="请填写促销名称，不超过40字"
              style={{ width: 360 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="起止时间">
          {getFieldDecorator('time', {
            rules: [
              { required: true, message: '请选择起止时间' },
              {
                validator: (_rule, value, callback) => {
                  if (
                    value &&
                    moment(new Date())
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .unix() > value[0].unix()
                  ) {
                    callback('开始时间不能早于现在');
                  } else {
                    callback();
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
              format={Const.DATE_FORMAT}
              placeholder={['起始时间', '结束时间']}
              showTime={{ format: 'HH:mm' }}
            />
          )}
        </FormItem>
        {isFullCount != null && (
          <FormItem
            {...formItemLayout}
            label={`满${Enum.GET_MARKETING_STRING(marketingType)}类型`}
          >
            {getFieldDecorator('subType', {
              rules: [
                {
                  required: true,
                  message: `满${Enum.GET_MARKETING_STRING(marketingType)}类型`
                }
              ],
              initialValue: isFullCount
            })(
              <RadioGroup
                onChange={(e) => this.subTypeChange(marketingType, e)}
              >
                <Radio value={0}>
                  满金额{Enum.GET_MARKETING_STRING(marketingType)}
                </Radio>
                <Radio value={1}>
                  满数量{Enum.GET_MARKETING_STRING(marketingType)}
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
        )}
        {isFullCount != null && (
          <FormItem {...formItemLayout} label="设置规则" required={true}>
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
                />
              )}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="选择商品" required={true}>
          {getFieldDecorator(
            'goods',
            {}
          )(
            <div>
              <Button type="primary" icon="plus" onClick={this.openGoodsModal}>
                添加商品
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
        <FormItem {...formItemLayout} label="目标客户" required={true}>
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
                <Radio value={-1}>全平台客户</Radio>
                {util.isThirdStore() && <Radio value={0}>店铺内客户</Radio>}
              </RadioGroup>
              {level._levelPropsShow && (
                <div>
                  <Checkbox
                    indeterminate={level._indeterminate}
                    onChange={(e) => this.allLevelChecked(e.target.checked)}
                    checked={level._checkAll}
                  >
                    全部等级
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
              保存
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}>
              返回
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
    const subType = marketingBean.get('subType');
    if (subType != undefined && subType != null) {
      this.setState({ isFullCount: subType % 2 });
    } else {
      this.setState({ isFullCount: 0 });
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
    let { marketingBean, level, isFullCount, selectedSkuIds } = this.state;

    let levelList = fromJS([]);
    let errorObject = {};

    const { marketingType, form } = this.props;
    form.resetFields();

    //判断设置规则
    if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
      levelList = marketingBean.get('fullReductionLevelList');
      marketingBean = marketingBean.set(
        'subType',
        isFullCount
          ? Enum.SUB_TYPE.REDUCTION_FULL_COUNT
          : Enum.SUB_TYPE.REDUCTION_FULL_AMOUNT
      );
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
      levelList = marketingBean.get('fullDiscountLevelList');
      marketingBean = marketingBean.set(
        'subType',
        isFullCount
          ? Enum.SUB_TYPE.DISCOUNT_FULL_COUNT
          : Enum.SUB_TYPE.DISCOUNT_FULL_AMOUNT
      );
    } else if (marketingType == Enum.MARKETING_TYPE.FULL_GIFT) {
      levelList = marketingBean.get('fullGiftLevelList');
      marketingBean = marketingBean.set(
        'subType',
        isFullCount
          ? Enum.SUB_TYPE.GIFT_FULL_COUNT
          : Enum.SUB_TYPE.GIFT_FULL_AMOUNT
      );
    }
    if (!levelList || levelList.isEmpty()) {
      errorObject['rules'] = {
        value: null,
        errors: [new Error('请设置规则')]
      };
    } else {
      let ruleArray = List();

      if (marketingType == Enum.MARKETING_TYPE.FULL_REDUCTION) {
        levelList.toJS().forEach((level, index) => {
          //为下面的多级条件校验加入因子
          ruleArray = ruleArray.push(
            fromJS({
              index: index,
              value: isFullCount ? level.fullCount : level.fullAmount
            })
          );
          if (!isFullCount && +level.fullAmount <= +level.reduction) {
            errorObject[`level_rule_value_${index}`] = {
              errors: [new Error('条件金额必须大于减免金额')]
            };
            errorObject[`level_rule_reduction_${index}`] = {
              errors: [new Error('减免金额必须小于条件金额')]
            };
          }
        });
      } else if (marketingType == Enum.MARKETING_TYPE.FULL_DISCOUNT) {
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
              errors: [new Error('满赠赠品不能为空')]
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
              errors: [new Error('多级促销条件不可相同')]
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
            errors: [new Error('请选择目标客户')]
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
        errors: [new Error('请选择参加营销的商品')]
      };
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
                      `${res.context.length}款商品活动时间冲突，请删除后再保存`
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
        title: '切换类型',
        content: '切换类型会清空已经设置的规则，是否继续？',
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
   * 内部方法，修改marketingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    this.setState({ marketingBean: this.state.marketingBean.merge(params) });
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
