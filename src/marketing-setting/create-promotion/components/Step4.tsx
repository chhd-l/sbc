import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Radio, Select, Tree, TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { RadioChangeEvent } from 'antd/es/radio';
import { cache, Const, ValidConst } from 'qmkit';
import * as webapi from '../../webapi';
import { treeNesting } from '../../../../web_modules/qmkit/utils/utils';
import { fromJS } from 'immutable';
import { FormContext } from '@/marketing-setting/create-promotion';
import SelectedGoodsGrid from '@/marketing-add/common-components/selected-goods-grid';
import { GoodsModal } from 'biz';
import { enumConst } from '@/marketing-setting/create-promotion/enum';


const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const WrapperCol = {offset: 4,span:20}
function Step4({form}){
  const { match,formData,changeFormData,setStep,formItemLayout } = useContext<any>(FormContext);
  const {getFieldDecorator,validateFields,setFields} = form

  const [purchaseType,setPurchaseType] = useState<number>(0)
  const [isSuperimposeSubscription,setIsSuperimposeSubscription] = useState<boolean>(false)


  const [customerType,setCustomerType] = useState<number>(0)
  const [scopeType,setScopeType] = useState<number>(0)
  const [customProductsType,setCustomProductsType] = useState<number>(0)
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


  const [cartLimits,setCartLimits] = useState<number>(0)



  useEffect(()=>{
    getGroupsList()
    getGoodsCateList()
    getAllAttribute()
    if(match.params.id){
      editInit()
    }
  },[])

  const toNext =() =>{
    validateFields((err, values) => {
      if(scopeType === 1 && selectedSkuIds.length === 0){
        setFields({
          goods:{
            value:null,
            errors:[
              new Error((window as any).RCi18n({
                id: 'Marketing.PleaseAddProducts'
              }))
            ]
          }
        })
        return
      }
      if (!err) {
        changeFormData(enumConst.stepEnum[3],{
          ...values,
          isSuperimposeSubscription:isSuperimposeSubscription ? 0 : 1,//判断是有选中isSuperimposeSubscription
          scopeIds:selectedSkuIds,
        })
        setStep(4)
      }
    });
  }

  /**
   * 当时编辑进入时初始化所有的值
   */
  const editInit = async ()=>{
    setPurchaseType(formData.Conditions.promotionType)
    setIsSuperimposeSubscription(formData.Conditions.isSuperimposeSubscription === 0 ? true : false)
    setCartLimits(formData.Conditions.CartLimit)
    setCustomerType(formData.Conditions.joinLevel)
    setScopeType(formData.Conditions.scopeType)

    setSelectedSkuIds(formData.Conditions.skuIds || [])
    setSelectedRows(fromJS(formData.Conditions.selectedRows) || fromJS([]))
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
    if(selectedSkuIds.length === 0){
      setFields({
        goods:{
          value:null,
          errors:[
            new Error((window as any).RCi18n({
              id: 'Marketing.PleaseAddProducts'
            }))
          ]
        }
      })
    }else {
      setFields({ goods:{ value:null }})
    }
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
        <FormattedMessage id="Marketing.Conditions" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPurchase" />}>
          {getFieldDecorator('promotionType', {
            initialValue: formData.Conditions.promotionType,
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
            <Radio.Group onChange={(e:RadioChangeEvent)=>setPurchaseType(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Autoship" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Club" /></Radio>
              <Radio value={3}><FormattedMessage id="Marketing.Singlepurchase" /></Radio>
            </Radio.Group>
          )}
          {
            purchaseType !== 3 &&  (
              <div>
                <Checkbox checked={isSuperimposeSubscription} onChange={(e=>{
                  setIsSuperimposeSubscription(e.target.checked)
                })}>
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </Checkbox>
              </div>
            )
          }
        </Form.Item>

        {/*Group of customer*/}
        <Form.Item label={<FormattedMessage id="Marketing.GroupOfCustomer" />} >
          {getFieldDecorator('joinLevel', {
            initialValue: customerType,
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
              <Radio value={-4}><FormattedMessage id="Marketing.Byemail" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <>
          {customerType === -3 && (
            <Form.Item wrapperCol={WrapperCol}>
              {getFieldDecorator('segmentIds', {
                initialValue: formData.Conditions.segmentIds?.[0],
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
            <>
              <Form.Item wrapperCol={WrapperCol}>
                {getFieldDecorator('emailSuffixList', {
                  initialValue: formData.Conditions.emailSuffixList?.[0],
                  rules: [
                    {
                      validator: (_rule, value, callback) => {
                        if (!value || value.length === 0) {
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
            </>

          )}
        </>

        {/*Products in the cart*/}
        <>
          <Form.Item label={<FormattedMessage id="Marketing.ProductsInTheCart" />} >
            {getFieldDecorator('scopeType', {
              initialValue: formData.Conditions.scopeType,
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
          <>
            {
              scopeType === 1 && (
                <>
                  <Form.Item wrapperCol={WrapperCol} required={true}>
                    {getFieldDecorator('customProductsType', {
                      initialValue: formData.Conditions.customProductsType || 0,
                      // onChange: (e) => this.onBeanChange({ customProductsType: e.target.value }),
                    })(<RadioGroup onChange={(e:RadioChangeEvent)=>setCustomProductsType(e.target.value)}>
                      <Radio value={0}>
                        <FormattedMessage id="Marketing.Includeproduct" />
                      </Radio>
                      <Radio value={1}>
                        <FormattedMessage id="Marketing.Excludeproduct" />
                      </Radio>
                    </RadioGroup>)}
                  </Form.Item>
                  <Form.Item wrapperCol={WrapperCol} required={true}>
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
              scopeType === 2 && (
                <>
                  <Form.Item wrapperCol={WrapperCol}>
                    {getFieldDecorator('storeCateIds', {
                      initialValue: formData.Conditions.storeCateIds,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            if ((!value || value.length === 0)) {
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
                  </Form.Item>
                </>
              )
            }
            {
              scopeType === 3 && (
                <>
                  <Form.Item wrapperCol={WrapperCol}>
                    {getFieldDecorator('attributeValueIds', {
                      initialValue: formData.Conditions.attributeValueIds,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            console.log(value)
                            if (!value || value.length === 0) {
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
                  </Form.Item>
                </>
              )
            }
          </>

        </>


        {/*CartLimit*/}
        <Form.Item label={<FormattedMessage id="Marketing.CartLimit" />}>
          {getFieldDecorator('CartLimit', {
            initialValue: formData.Conditions.CartLimit,
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
            <Radio.Group onChange={(e)=>{
              setCartLimits(e.target.value)
            }}>
              <Radio value={0}><FormattedMessage id="Order.none" /></Radio>
              <Radio value={2}><FormattedMessage id="Order.Quantity" /></Radio>
              <Radio value={1}><FormattedMessage id="Order.Amount" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {
          cartLimits === 2 && (
            <>
              <Form.Item wrapperCol={WrapperCol}>
                <span>Full&nbsp;</span>
                {getFieldDecorator('fullItem', {
                  initialValue: formData.Conditions.fullItem,
                  rules: [
                    {
                      required: true,
                      message:
                        (window as any).RCi18n({
                          id: 'Marketing.ustenterrules',
                        })
                    },
                    {
                      validator: (_rule, value, callback) => {
                        if (value) {
                          if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                            callback(
                              (window as any).RCi18n({
                                id: 'Marketing.1-9999',
                              })
                            );
                          }
                        }
                        callback();
                      }
                    }
                  ],
                })(
                  <Input style={{ width: 300 }} placeholder={(window as any).RCi18n({
                    id: 'Marketing.1-9999',
                  })}/>,
                )}
                <span>&nbsp;<FormattedMessage id="Marketing.items" /></span>
              </Form.Item>
            </>
          )
        }
        {
          cartLimits === 1 && (
            <>
              <Form.Item wrapperCol={WrapperCol}>
                <span>Full&nbsp;</span>
                {getFieldDecorator('fullMoney', {
                  initialValue: formData.Conditions.fullMoney,
                  rules: [
                    {
                      required: true,
                      message:
                        (window as any).RCi18n({
                          id: 'Marketing.ustenterrules',
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
                  <Input style={{ width: 300 }} placeholder={(window as any).RCi18n({ id: 'Marketing.0.01-99999999.99' })}/>,
                )}
                <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
              </Form.Item>
            </>
          )
        }
      </Form>


      <GoodsModal visible={goodsModal._modalVisible} selectedSkuIds={goodsModal._selectedSkuIds} selectedRows={goodsModal._selectedRows} onOkBackFun={skuSelectedBackFun} onCancelBackFun={closeGoodsModal} />
      <ButtonLayer step={3} toNext={toNext} />
    </div>
  )
}

export default Form.create<any>()(Step4);