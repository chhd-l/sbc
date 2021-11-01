import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Tree, Select, TreeSelect } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormattedMessage } from 'react-intl';
import { cache, Const, ValidConst } from 'qmkit';
import GiftLevels from '@/marketing-add/full-gift/components/gift-levels';
import { fromJS } from 'immutable';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import { FormContext } from '@/marketing-setting/create-promotion';
import { RadioChangeEvent } from 'antd/es/radio';
import SelectedGoodsGrid from '@/marketing-add/common-components/selected-goods-grid';
import { GoodsModal } from 'biz';
import * as webapi from '@/marketing-setting/webapi';
import { treeNesting } from '../../../../web_modules/qmkit/utils/utils';

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

function Step5({ setStep, form }) {
  const { changeFormData,formData,match } = useContext<any>(FormContext);
  const { getFieldDecorator, validateFields } = form;
  const [couponPromotionType,setCouponPromotionType] = useState(0)

  const [selectedGiftRows,setSelectedGiftRows] = useState<any>(fromJS([]))
  const [fullGiftLevelList,setFullGiftLevelList]  = useState<any>()


  const [customerType,setCustomerType] = useState<number>(0)
  const [scopeType,setScopeType] = useState<number>(0)
  const [storeCateList,setStoreCateList] = useState<any>([])
  const [attributeList,setAttributeList] = useState<any>([])
  const [allGroups,setAllGroups] = useState<any>([])

  const [goodsModal,setGoodsModal] = useState({
    _modalVisible: false,
    _selectedSkuIds: [],
    _selectedRows: []
  })
  const [selectedSkuIds,setSelectedSkuIds] = useState<any>([])
  const [selectedRows,setSelectedRows] = useState<any>(fromJS([]))


  useEffect(()=>{
    getGroupsList()
    getGoodsCateList()
    getAllAttribute()
    setFullGiftLevelList([{
      key: makeRandom(),
      fullAmount: null,
      fullCount: null,
      giftType: 1,
      fullGiftDetailList: []
    }])
    if(match.params.id){
      editInit()
      setCouponPromotionType(formData.Advantage.couponPromotionType)
      if(formData.subType === 4 || formData.subType === 5){
        setFullGiftLevelList(formData.Advantage.fullGiftLevelList)
        setFullGiftLevelList(fromJS(formData.Advantage.selectedRows))
      }
    }
  },[])
  useEffect(()=>{
    console.log(formData)
    console.log(formData.Advantage.couponPromotionType)
    setCouponPromotionType(formData.Advantage.couponPromotionType)
  },[formData])


  /**
   * 当时编辑进入时初始化所有的值
   */
  const editInit = async ()=>{
    setCustomerType(formData.Advantage.joinLevel)
    setScopeType(formData.Advantage.scopeType)

    setSelectedSkuIds(formData.Advantage.skuIds || [])
    setSelectedRows(fromJS(formData.Advantage.selectedRows) || fromJS([]))
  }
  /**
   * 规则变化方法
   * @param rules
   */
  const onRulesChange = (rules) => {
    form.resetFields('rules');
    console.log(rules)
    setFullGiftLevelList(rules)
    changeFormData(enumConst.stepEnum[4],{fullGiftLevelList: rules,couponPromotionType:couponPromotionType})
    let errorObject = {};
    //满赠规则具体内容校验
    rules.forEach((level, index) => {
      //校验赠品是否为空
      if (!level.fullGiftDetailList || level.fullGiftDetailList.length == 0) {
        errorObject[`level_${index}`] = {
          value: null,
          errors: [new Error('A full gift cannot be empty')]
        };
      } else {
        errorObject[`level_${index}`] = {
          value: null,
          errors: null
        };
      }
    });
    form.setFields(errorObject);
  };

  const GiftRowsOnChange = (rows) => {
    console.log(rows)
    setSelectedGiftRows(rows)
  }








  /**
   * 后添加进入方法
   */
  const getGroupsList = async () => {
    const { res }:any = await webapi.getAllGroups({
      pageNum: 0,
      pageSize: 1000000,
      segmentType: 0,
      isPublished: 1
    });
    setAllGroups(res.context.segmentList)
  }
  const getGoodsCateList = async () => {
    const { res }:any = await webapi.getGoodsCate();
    let list = treeNesting(res.context,'cateParentId','storeCateId')
    setStoreCateList(list)
  }
  const getAllAttribute = async () => {
    let params = {
      attributeName: '',
      displayName: '',
      attributeValue: '',
      displayValue: '',
      pageSize: 10000,
      pageNum: 0
    };
    const { res }:any = await webapi.getAllAttribute(params);

    if (res.code == Const.SUCCESS_CODE) {
      res.context.attributesList.forEach((item) => {
        if (item.attributesValuesVOList) {
          item.attributesValuesVOList.forEach((child) => {
            child.attributeName = child.attributeDetailName;
          });
        }
      });
      console.log(res.context.attributesList)
      setAttributeList(fromJS(res.context.attributesList))
    }
  };
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  const makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };

  /**
   * 关闭货品选择modal
   */
  const closeGoodsModal = () => {
    setGoodsModal({...goodsModal,_modalVisible: false})
  };
  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  const skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    form.resetFields('goods');
    setSelectedSkuIds(selectedSkuIds);
    setSelectedRows(selectedRows);
    // changeFormData(enumConst.stepEnum[3],{scopeIds: selectedSkuIds})//保存到公共formData中
    setGoodsModal({...goodsModal,_modalVisible: false});
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  const deleteSelectedSku = (skuId) => {
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    let SelectedRows = selectedRows.delete(selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId));
    setSelectedSkuIds(selectedSkuIds);
    setSelectedRows(SelectedRows);
  };

  /**
   * 回显StoreCateIds
   * @param storeCateIds
   */
  const ReStoreCateIds = (storeCateIds)=>{
    let array = []
    storeCateIds.forEach(item=>{
      array.push({value:item})
    })
    return array
  }
  //展示相关
  /**
   * 店铺分类树形下拉框
   * @param storeCateList
   */
  const generateStoreCateTree = (storeCateList) => {
    return (
      storeCateList &&
      storeCateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} disabled checkable={false}>
              {generateStoreCateTree(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
      })
    );
  };
  /**
   * Attribute分类树形下拉框
   * @param storeCateList
   */
  const generateAttributeTree = (attributesList) => {
    return (
      attributesList &&
      attributesList.map((item) => {
        if (item.get('attributesValuesVOList') && item.get('attributesValuesVOList').count()) {
          return (
            <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('attributeName')} disabled checkable={false}>
              {generateAttributeTree(item.get('attributesValuesVOList'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('attributeName')} />;
      })
    );
  };
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Advantage" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">

        <Form.Item label={<FormattedMessage id="Marketing.PromotionName" />}>
          {getFieldDecorator('couponPromotionType', {
            initialValue: formData.Advantage.couponPromotionType,
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ]
          })(
            <Radio.Group onChange={(e)=>{setCouponPromotionType(e.target.value)}}>
              {
                !(formData.PromotionType.typeOfPromotion === 1 && formData.Conditions.CartLimit === 2) &&
                  (
                    <Radio value={0}>
                      <FormattedMessage id="Marketing.Amount" />
                    </Radio>
                  )
              }
              {
                !(formData.PromotionType.typeOfPromotion === 1 && formData.Conditions.CartLimit === 2) &&
                (
                  <Radio value={1}>
                    <FormattedMessage id="Marketing.Percentage" />
                  </Radio>
                )
              }
              <Radio value={3}>
                <FormattedMessage id="Marketing.Freeshipping" />
              </Radio>
              {
                (formData?.PromotionType?.typeOfPromotion !== 1 && formData?.Conditions?.promotionType === 0 ) &&
                <Radio value={4}>
                  <FormattedMessage id="Marketing.Gifts" />
                </Radio>
              }

            </Radio.Group>
          )}
        </Form.Item>
        {/*promotion 当选择 autoship和club时展示 首次订阅减免*/}
        {
          formData.PromotionType.typeOfPromotion === 0 && (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2) ?
            (
              <>
                {
                  couponPromotionType === 0 &&
                    (
                      <>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label="For the first subscription order,reduction">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.reduction" />&nbsp;&nbsp;</span>
                        {getFieldDecorator('firstSubscriptionOrderReduction', {
                          initialValue: formData.Advantage.firstSubscriptionOrderReduction,
                          rules: [
                            {
                              required: true, message:
                                (window as any).RCi18n({
                                  id: 'Marketing.AmountMustBeEntered',
                                })
                            },
                            {
                              validator: (_rule, value, callback) => {
                                if (value) {
                                  if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                    callback(
                                      (window as any).RCi18n({
                                        id: 'Marketing.0.01-99999999.99',
                                      })
                                    );
                                  }
                                }
                                callback();
                              }
                            }
                          ],
                        })(
                          <Input
                            style={{ width: 200 }}
                            placeholder={
                              (window as any).RCi18n({
                                id: 'Marketing.0.01-99999999.99',
                              })
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label="For the rest subscription order,reduction" required={false} labelAlign="left" >
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.reduction" />&nbsp;&nbsp;</span>
                        {getFieldDecorator('restSubscriptionOrderReduction', {
                          initialValue: formData.Advantage.restSubscriptionOrderReduction,
                          rules: [
                            {
                              validator: (_rule, value, callback) => {
                                if (value) {
                                  if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                    callback(
                                      (window as any).RCi18n({
                                        id: 'Marketing.0.01-99999999.99',
                                      })
                                    );
                                  }
                                }
                                callback();
                              }
                            }
                          ],
                        })(
                          <Input
                            style={{ width: 200 }}
                            placeholder={
                              (window as any).RCi18n({
                                id: 'Marketing.0.01-99999999.99',
                              })
                            }
                          />
                        )}
                      </Form.Item>
                      </>
                    )
                }
                {
                  couponPromotionType === 1 &&
                  (
                    <>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label={<FormattedMessage id="Marketing.Forthefirstsubscription" />} required={true} labelAlign="left" >
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.discount" />&nbsp;&nbsp;</span>
                            {getFieldDecorator('firstSubscriptionOrderDiscount', {
                              initialValue: formData.Advantage.firstSubscriptionOrderDiscount ?  formData.Advantage.firstSubscriptionOrderDiscount*100 : '',
                              rules: [
                                {
                                  required: true, message:
                                    (window as any).RCi18n({
                                      id: 'Marketing.AmountMustBeEntered',
                                    })
                                },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (value) {
                                      if (!/^(?:[1-9][0-9]?)$/.test(value)) { // 0|[1-9][0-9]?|100
                                        callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.InputValuefrom1to99',
                                          })
                                        );
                                      }
                                    }
                                    callback();
                                  }
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
                                title={
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to99'
                                  })
                                }
                                placeholder={
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to99'
                                  })
                                }
                              />
                            )}
                            <span>&nbsp;<FormattedMessage id="Marketing.percent" />&nbsp;<FormattedMessage id="Marketing.ofOrginalPrice" />,&nbsp;</span>
                          </Form.Item>
                          <Form.Item>
                            <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                            {getFieldDecorator('firstSubscriptionLimitAmount', {
                              initialValue: formData.Advantage.firstSubscriptionLimitAmount,
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
                                style={{ width: 150 }}
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
                              />
                            )}
                            &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </Form.Item>
                        </div>
                      </Form.Item>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label={<FormattedMessage id="Marketing.Fortherestsubscription" />} required={false} labelAlign="left">
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.discount" />&nbsp;&nbsp;</span>
                            {getFieldDecorator('restSubscriptionOrderDiscount', {
                              initialValue: formData.Advantage.restSubscriptionOrderDiscount ?  formData.Advantage.restSubscriptionOrderDiscount*100 : '',
                              rules: [
                                {
                                  validator: (_rule, value, callback) => {
                                    let rule = formData.Conditions.promotionType == 1 ? /^(?:[1-9][0-9]?)$/ : /^(?:[1-9][0-9]?|100)$/
                                    if (value) {
                                      if (!rule.test(value)) {
                                        formData.Conditions.promotionType == 1 ?
                                          callback(
                                            (window as any).RCi18n({
                                              id: 'Marketing.InputValuefrom1to99'
                                            })
                                          ) : callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.InputValuefrom1to100'
                                          })
                                          )
                                      }
                                    }
                                    callback();
                                  }
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
                                title={
                                  formData.Conditions.promotionType == 1 ?
                                    (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to99'
                                    }) : (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to100'
                                    })
                                }
                                placeholder={
                                  formData.Conditions.promotionType == 1 ?
                                    (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to99'
                                    }) : (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to100'
                                    })
                                }
                              />
                            )}
                            <span>&nbsp;<FormattedMessage id="Marketing.percent" />&nbsp;<FormattedMessage id="Marketing.ofOrginalPrice" />,&nbsp;</span>
                          </Form.Item>

                          <Form.Item>
                            <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                            {getFieldDecorator('restSubscriptionLimitAmount', {
                              initialValue: formData.Advantage.restSubscriptionLimitAmount,
                              rules: [
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
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
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
                              />
                            )}
                            &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </Form.Item>



                        </div>
                      </Form.Item>
                    </>
                  )
                }
              </>

            )
            : (
              <>
                {couponPromotionType === 0 && (
                  <Form.Item {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionValue" />} required={true}>
                    {getFieldDecorator('denomination', {
                      initialValue: formData.Advantage.denomination,
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
                            if(value){
                              if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.IntegersBetweenAreAllowed'
                                  })
                                );
                                return;
                              }
                              if(formData.Conditions.fullMoney &&  Number(value) > Number(formData.Conditions.fullMoney)) {
                                callback(
                                  'Value cannot be greater than the previous value.'
                                );
                              }
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
                        style={{ width: 360 }}
                      />
                    )}
                  </Form.Item>
                )}
                {couponPromotionType === 1 && (
                  <Form.Item {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionValue" />} required={true}>
                    <div style={{ display: 'flex' }}>
                      <Form.Item>
                        {getFieldDecorator('couponDiscount', {
                          initialValue: formData.Advantage.couponDiscount ?  formData.Advantage.couponDiscount*100 : '',
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
                            style={{ width: 160 }}
                          />
                        )} %,
                      </Form.Item>
                      <Form.Item>
                        <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                        {getFieldDecorator('limitAmount', {
                          initialValue: formData.Advantage.limitAmount,
                          rules: [
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
                            }
                          ],
                        })(
                          <Input
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
                            style={{ width: 160 }}
                          />
                        )}
                        &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      </Form.Item>
                    </div>
                  </Form.Item>
                )}
                {
                  couponPromotionType === 4 && (
                    <Form.Item wrapperCol={{offset: 6,span:18}} required={true} labelAlign="left">
                      {
                        getFieldDecorator(
                          'rules',
                          {}
                        )(
                          <GiftLevels
                            form={form}
                            selectedRows={selectedGiftRows}
                            isNormal={false}
                            fullGiftLevelList={fullGiftLevelList}
                            onChangeBack={onRulesChange}
                            isFullCount={formData.Conditions.CartLimit === 1 ? 0 : 1}
                            GiftRowsOnChange={GiftRowsOnChange}
                            noMulti={true}
                          />
                        )}
                    </Form.Item>
                  )
                }
              </>
            )
        }



        {/*Group of customer*/}
        <Form.Item label={<FormattedMessage id="Marketing.GroupOfCustomer" />}>
          {getFieldDecorator('joinLevel', {
            initialValue: formData.Advantage.joinLevel,
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ],
          })(
            <Radio.Group onChange={(e)=>setCustomerType(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.all" /></Radio>
              <Radio value={-3}><FormattedMessage id="Marketing.Group" /></Radio>
              {
                formData?.PromotionType?.typeOfPromotion !== 1 &&
                <Radio value={-4}><FormattedMessage id="Marketing.Byemail" /></Radio>
              }

            </Radio.Group>
          )}
        </Form.Item>
        {customerType === -3 && (
          <Form.Item wrapperCol={{offset: 6,span:18}}>
            {getFieldDecorator('segmentIds', {
              initialValue: formData.Advantage.segmentIds?.[0],
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value) {
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
              <Select style={{ width: 520 }}>
                {allGroups.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )}
        {customerType === -4 && (
          <Form.Item wrapperCol={{offset: 6,span:18}}>
            {getFieldDecorator('emailSuffixList', {
              initialValue: formData.Conditions.emailSuffixList?.[0],
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value) {
                      callback(
                        (window as any).RCi18n({
                          id: 'Marketing.Pleaseenteremailsuffix'
                        })
                      );
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input
                style={{ width: 300 }}
                maxLength={30}
              />
            )}
          </Form.Item>
        )}

        {/*Products in the cart*/}
        <Form.Item label={<FormattedMessage id="Marketing.ProductsInTheCart" />}>
          {getFieldDecorator('scopeType', {
            initialValue: formData.Advantage.scopeType,
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ],
          })(
            <Radio.Group onChange={(e:RadioChangeEvent)=>setScopeType(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.all" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Category" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Custom" /></Radio>
              <Radio value={3}><FormattedMessage id="Marketing.Attribute" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {
          scopeType === 1 && (
            <>
              <Form.Item wrapperCol={{offset: 6,span:18}} required={true}>
                {getFieldDecorator('customProductsType', {
                  initialValue: formData.Advantage.customProductsType || 0,
                  // onChange: (e) => this.onBeanChange({ customProductsType: e.target.value }),
                })(<RadioGroup >
                  <Radio value={0}>
                    <FormattedMessage id="Marketing.Includeproduct" />
                  </Radio>
                  <Radio value={1}>
                    <FormattedMessage id="Marketing.Excludeproduct" />
                  </Radio>
                </RadioGroup>)}

              </Form.Item>
              <Form.Item wrapperCol={{offset: 6,span:18}} required={true}>
                {getFieldDecorator(
                  'goods',
                  {}
                )(
                  <div>
                    <Button type="primary" icon="plus"
                            onClick={()=>{setGoodsModal({_selectedSkuIds:selectedSkuIds,_selectedRows:selectedRows,_modalVisible:true})}}
                    >
                      <FormattedMessage id="Marketing.AddProducts" />
                    </Button>
                    &nbsp;&nbsp;
                    <SelectedGoodsGrid selectedRows={selectedRows} skuExists={[]} deleteSelectedSku={deleteSelectedSku} />
                  </div>
                )}
              </Form.Item>
            </>
          )
        }
        {
          scopeType === 2 && (<Form.Item wrapperCol={{offset: 6,span:18}}>
            {getFieldDecorator('storeCateIds', {
              initialValue: ReStoreCateIds(formData.Advantage.storeCateIds),
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if ((!value)) {
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
            })(
              <TreeSelect
                id="storeCateIds"
                getPopupContainer={() => document.getElementById('page-content')}
                treeCheckable={true}
                showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                treeCheckStrictly={true}
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
                dropdownStyle={{ maxHeight: 400, overflow: 'auto', top: '390' }}
                showSearch={false}
                // onChange={this.storeCateChange}
                style={{ width: 500 }}
                treeDefaultExpandAll
              >
                {generateStoreCateTree(storeCateList)}
              </TreeSelect>
            )}
          </Form.Item>)
        }
        {
          scopeType === 3 && (<Form.Item wrapperCol={{offset: 6,span:18}}>
            {getFieldDecorator('attributeValueIds', {
              initialValue: ReStoreCateIds(formData.Advantage.attributeValueIds || []),
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value) {
                      callback(
                        (window as any).RCi18n({
                          id: 'Marketing.Pleaseselectattribute'
                        })
                      );
                    }
                    callback();
                  }
                }
              ]
            })(
              <TreeSelect
                id="attributeValueIds"
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
                // onChange={this.attributeChange}
                style={{ width: 500 }}
                treeDefaultExpandAll
              >
                {generateAttributeTree(attributeList)}
              </TreeSelect>
            )}
          </Form.Item>)
        }

      </Form>

      <GoodsModal visible={goodsModal._modalVisible} selectedSkuIds={goodsModal._selectedSkuIds} selectedRows={goodsModal._selectedRows} onOkBackFun={skuSelectedBackFun} onCancelBackFun={closeGoodsModal} />
      <ButtonLayer setStep={setStep} step={4} validateFields={validateFields} fullGiftLevelList={fullGiftLevelList} scopeIds={selectedSkuIds}/>
    </div>
  );
}

export default Form.create<any>()(Step5);