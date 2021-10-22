import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Radio, Select, Tree, TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { RadioChangeEvent } from 'antd/es/radio';
import { cache, Const, ValidConst } from 'qmkit';
import * as webapi from '../../webapi';
import { treeNesting } from '../../../../web_modules/qmkit/utils/utils';
import * as commonWebapi from '@/marketing-add/webapi';
import { fromJS } from 'immutable';
import SelectedGoodsGrid from '@/marketing-add/common-components/selected-goods-grid';
import { GoodsModal } from 'biz';

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function Step4({setStep,form}){
  const {getFieldDecorator,validateFields} = form

  const [purchaseType,setPurchaseType] = useState<number>(0)
  const [customerType,setCustomerType] = useState<number>(-1)
  const [scopeType,setScopeType] = useState<number>(0)
  const [cartLimits,setCartLimits] = useState<number>(0)

  const [storeCateList,setStoreCateList] = useState<any>([])
  const [attributeList,setAttributeList] = useState<any>([])
  const [allGroups,setAllGroups] = useState<any>([])

  const [goodsModal,setGoodsModal] = useState({
    _modalVisible: false,
    _selectedSkuIds: [],
    _selectedRows: []
  })

  useEffect(()=>{
    getGroupsList()
    getGoodsCateList()
    getAllAttribute()
  },[])
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

  const selectGroupOnChange = ()=>{

  }


  /**
   * Group of customer
   */
  const Group = (
    <Form.Item wrapperCol={{offset: 6,span:18}}>
      {getFieldDecorator('segmentIds', {
        initialValue: '',
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
        <Select style={{ width: 520 }} onChange={selectGroupOnChange}>
          {allGroups.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  )
  const ByEmail = (
    <Form.Item wrapperCol={{offset: 6,span:18}}>
      {getFieldDecorator('emailSuffixList', {
        initialValue: '',
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
  )
  /**
   * cartLimit
   */
  const cartLimitQuantity = (
    <Form.Item wrapperCol={{offset: 6,span:18}}>
      <span>Full&nbsp;</span>
      {getFieldDecorator('time', {
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
  )
  const cartLimitAmount = (
    <Form.Item wrapperCol={{offset: 6,span:18}}>
      <span>Full&nbsp;</span>
      {getFieldDecorator('time', {
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
                      id: 'Marketing.0-99999999.99',
                    })
                  );
                }
              }
              callback();
            }
          }
        ],
      })(
        <Input style={{ width: 300 }} placeholder={(window as any).RCi18n({ id: 'Marketing.0-99999999.99' })}/>,
      )}
      <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
    </Form.Item>
  )
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Conditions" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPurchase" />}>
          {getFieldDecorator('promotionType', {
            initialValue: 0,
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
            purchaseType !== 1 &&  (
              <div>
                <Checkbox>
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </Checkbox>
              </div>
            )
          }
        </Form.Item>

        {/*Group of customer*/}
        <Form.Item label={<FormattedMessage id="Marketing.GroupOfCustomer" />}>
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
              <Radio value={-1}><FormattedMessage id="Marketing.all" /></Radio>
              <Radio value={-3}><FormattedMessage id="Marketing.Group" /></Radio>
              <Radio value={-4}><FormattedMessage id="Marketing.Byemail" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {customerType === -3 && Group}
        {customerType === -4 && ByEmail}

        {/*Products in the cart*/}
        <Form.Item label={<FormattedMessage id="Marketing.ProductsInTheCart" />}>
          {getFieldDecorator('scopeType', {
            initialValue: scopeType,
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
                  initialValue: 0,
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
                            // onClick={this.openGoodsModal}
                    >
                      <FormattedMessage id="Marketing.AddProducts" />
                    </Button>
                    &nbsp;&nbsp;
                    {/*<SelectedGoodsGrid selectedRows={selectedRows} skuExists={skuExists} deleteSelectedSku={deleteSelectedSku} />*/}
                  </div>
                )}
              </Form.Item>
            </>
          )
        }
        {
          scopeType === 2 && (<Form.Item wrapperCol={{offset: 6,span:18}}>
              {getFieldDecorator('storeCateIds', {
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
              // initialValue: attributeDefaultValue,
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
        {/*CartLimit*/}
        <Form.Item label={<FormattedMessage id="Marketing.CartLimit" />}>
          {getFieldDecorator('CartLimit', {
            initialValue: 0,
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
            <Radio.Group onChange={(e)=>{setCartLimits(e.target.value)}}>
              <Radio value={0}><FormattedMessage id="Order.none" /></Radio>
              <Radio value={2}><FormattedMessage id="Order.Quantity" /></Radio>
              <Radio value={1}><FormattedMessage id="Order.Amount" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {
          cartLimits === 1 && (cartLimitQuantity)
        }
        {
          cartLimits === 2 && (cartLimitAmount)
        }
      </Form>

      <ButtonLayer setStep={setStep} step={2} validateFields={validateFields}/>


      <GoodsModal visible={goodsModal._modalVisible} selectedSkuIds={goodsModal._selectedSkuIds} selectedRows={goodsModal._selectedRows} onOkBackFun={this.skuSelectedBackFun} onCancelBackFun={this.closeGoodsModal} />
    </div>
  )
}

export default Form.create<any>()(Step4);