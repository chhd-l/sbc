import React, {useCallback, useEffect, useState} from 'react';
import {Button, Row, Col, Input, Checkbox, InputNumber, message, Spin} from 'antd';
import ProductList from './price/ProductList';
import {listCategory, listGoodsByCategory, priceSetting} from "../webapi";

export const FormContext = React.createContext({});

const enumType = {
  0:'Cat',
  1:'Dog'
}
export default function Step4({ setStep,userInfo,step }) {
  const [formData, setFormData] = useState({});

  const [allObj,setAllObj] = useState({})//平铺所有sku选项结构{Cat:{},Dog:{}}
  const [checkAllObj,setCheckAllObj] = useState({Cat:false,Dog:false})//cat或者dog是否全选

  const [dataSource,setDataSource] = useState({})
  const [loading, setLoading] = useState(false);

  const [salesPercentage,setSalesPercentage] = useState(1)
  const [subscriptionPercentage,setSubscriptionPercentage] = useState(1)
  const [percentageObj,setPercentageObj] = useState({salesPercentage:1,subscriptionPercentage:1})//用于点击apply
  const [roundOff,setRoundOff] = useState(false)
  useEffect(()=>{
    if(step === 3) getCateGory()
  },[step])
  const getCateGory = ()=>{
    setLoading(true)
    listCategory().then(res=>{
      let promises = []
      res.context.categoryList.forEach((item,index)=>{
        if(item.categoryValue === 'Cat'){
          promises[0] = listGoodsByCategory({
            categoryId: item.categoryId,
            categoryValueId: item.categoryValueId
          })
        }
        if(item.categoryValue === 'Dog'){
          promises[1] = listGoodsByCategory({
            categoryId: item.categoryId,
            categoryValueId: item.categoryValueId
          })
        }
      })
      console.log(promises)
      Promise.all(promises).then(function (posts) {
        posts.forEach((post,index)=>{
          let spuList = {}
          let skuList = {}
          post.context.libGoodsList.forEach(it=>{
            skuList[it.sku] = {
               ...it,
              isChecked:true,
            }
            if(spuList[it.spu]){
              spuList[it.spu].children.push(it)
              spuList[it.spu].skuList.push(it.sku)
              spuList[it.spu].height = spuList[it.spu].height + 56
            }else {
              spuList[it.spu] = {
                spu:it.spu,
                spuName:it.spuName,
                children:[{...it}],
                skuList:[it.sku],
                height:112,
              }
            }
          })
          let arr = []
          for (let i in spuList) {
            let o = {};
            o = spuList[i]; //即添加了key值也赋了value值 o[i] 相当于o.name 此时i为变量
            arr.push(o)
          }
          dataSource[enumType[index]] = {
            title:enumType[index],
            array:arr,
          }
          allObj[enumType[index]] = skuList
        })
        console.log(allObj)
        setAllObj(allObj)
        setDataSource({...dataSource})
        setLoading(false)
      })
    })
  }
  /**
   * 点apply对选中条目价格进行计算
   */
  const applyPercentage =useCallback(()=>{
    setPercentageObj({
      salesPercentage,
      subscriptionPercentage
    })
  },[salesPercentage,subscriptionPercentage])

  /**
   * 收集所有修改过的price,和选中的值
   * @param sku
   * @param data
   */
  const changeFormData = (sku, data) => {
    formData[sku] = Object.assign({},data)
    // console.log(formData)
    setFormData(formData)
  };
  // 保存全选/全不选的状态 （因为虚拟列表所有在此处对所有数据进行操作）
  const saveCheckAll = (isChecked,type) => {
    checkAllObj[type] = isChecked
    setCheckAllObj(checkAllObj)
  };
  /**
   * 保存价格设置
   */
  const savePrice = () => {
    let newChooseObj = {...formData}
    checkAllObj.Cat ? newChooseObj = {...allObj.cat,...newChooseObj} : ''
    checkAllObj.Dog ? newChooseObj = {...allObj.Dog,...newChooseObj} : ''
    let array = []
    for(let i in newChooseObj){
      if(newChooseObj[i].isChecked){
        array.push(newChooseObj[i])
      }
    }
    if(array.length > 0){
      setLoading(true)
      priceSetting({
        email: userInfo.accountName,
        storeId: userInfo.storeId,
        sourceStoreId: 123457915,
        priceSettingList: array,
        companyInfoId:userInfo.companyInfoId
      }).then(res=>{
        setLoading(false)
        setStep(4)
      }).catch(err=>{
        setLoading(false)
      })
    }else {
      message.warn('You did not make any changes')
      setStep(4)
    }
  };

  return (
      <FormContext.Provider
          value={{
            changeFormData: changeFormData,
            saveCheckAll: saveCheckAll,
            formData,
            percentageObj,
            roundOff:roundOff ? 0 : 6
          }}
      >
        <Spin spinning={loading} size="large">
          <div className="vmargin-level-4 align-item-center word big">4 / 5 Set a price for your product</div>
          <div style={{width:800,margin:'20px auto'}}>
            <Row gutter={24} style={{marginBottom:'10px'}}>
              <Col span={6}>
                <div className="word small tip">Sales price percentage</div>
              </Col>
              <Col span={6}>
                <div className="word small tip">Subscription price percentage</div>
              </Col>
            </Row>
            <Row gutter={24} type="flex" align="middle">
              <Col span={6}>
                <InputNumber min={0}
                             value={salesPercentage}
                             style={{width:180}}
                             step={0.1}
                             onChange={(value)=>setSalesPercentage(value)} />
              </Col>
              <Col span={6}>
                <InputNumber min={0}
                             style={{width:180}}
                             value={subscriptionPercentage}
                             step={0.1}
                             onChange={(value)=>setSubscriptionPercentage(value)} />
              </Col>
              <Col span={4}>
                <Checkbox checked={roundOff} onChange={(e)=>{
                  setRoundOff(e.target.checked)
                }}>
                  <span className="word small tip">round off</span>
                </Checkbox>
              </Col>
              <Col span={6}>
                <>
                  <Button type="primary" onClick={applyPercentage}>Apply</Button>
                  <Button loading={loading} type="primary" onClick={savePrice}>Save and Next</Button>
                  <Button onClick={() => setStep(2)}>back</Button>
                </>
              </Col>
            </Row>
          </div>
          <div className="vmargin-level-4 hpadding-level-4">
            <Row gutter={24}>
              <Col span={12}>
                <ProductList dataSource={dataSource?.Cat?.array}
                             allObj={allObj?.Cat?.array}
                             title="Cat"
                />
              </Col>
              <Col span={12}>
                <ProductList dataSource={dataSource?.Dog?.array}
                             allObj={allObj?.Dog?.array}
                             title="Dog"
                />
              </Col>
            </Row>
          </div>
        </Spin>
      </FormContext.Provider>
  );
}


