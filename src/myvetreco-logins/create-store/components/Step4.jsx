import React, {useCallback, useEffect, useState} from 'react';
import {Button, Row, Col, Input, Checkbox, InputNumber, message, Spin} from 'antd';
import ProductList from './price/ProductList';
import {listCategory, listGoodsByCategory, priceSetting} from "../webapi";
import {bignumber, multiply, round, format} from "mathjs";

export const FormContext = React.createContext({});

const enumType = {
  0:'Cat',
  1:'Dog'
}
export default function Step4({ setStep,userInfo,step,sourceStoreId }) {
  const [formData, setFormData] = useState({});
  const [checkedObject,setCheckedObject] = useState({Cat:{},Dog:{}})//选中状态{Cat:{},Dog:{}}

  const [allObj,setAllObj] = useState({})//平铺所有sku选项结构{Cat:{},Dog:{}}
  const [checkAllObj,setCheckAllObj] = useState({Cat:false,Dog:false})//cat或者dog是否全选

  const [dataSource,setDataSource] = useState({})
  const [loading, setLoading] = useState(false);

  const [salesPercentage,setSalesPercentage] = useState(100)
  const [subscriptionPercentage,setSubscriptionPercentage] = useState(100)
  const [percentageObj,setPercentageObj] = useState({salesPercentage:100,subscriptionPercentage:100})//用于点击apply
  const [roundOff,setRoundOff] = useState(true)
 
  useEffect(()=>{
    if(step === 3) getCateGory()
  },[step])
  const getCateGory = ()=>{
    setLoading(true)
    listCategory().then(({res})=>{
      let animalTypeList=res.context.categoryList;
      let dog=animalTypeList.find(item=>item.categoryValue==='Dog')
      let Cat=animalTypeList.find(item=>item.categoryValue==='Cat')
      let promises = [listGoodsByCategory({
        categoryId: Cat.categoryId,
        categoryValueId: Cat.categoryValueId
      }),listGoodsByCategory({
        categoryId: dog.categoryId,
        categoryValueId: dog.categoryValueId
      })]
      console.log(promises)
      Promise.all(promises).then(function (posts) {
        console.log(posts);
        posts.forEach((result,index)=>{
          let post =result.res
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
        setAllObj(Object.assign({}, {...allObj}))
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
   * 保存选中状态（虚拟列表会重刷组件，导致状态丢失）
   * @param spu
   * @param list
   */
  const saveCheckStatus = (title,spu,list)=>{
    if(spu==='clear'){
      checkedObject[title] = []
    }else {
      checkedObject[title][spu] = [...list]
      console.log(checkedObject)
      setCheckedObject(checkedObject)
    }
  }
  /**
   * 保存价格设置
   */
  const savePrice = () => {
    let newChooseObj = {...formData}
    //点击全选时插入所有数据
    if(checkAllObj.Cat){
      for(let i in allObj.Cat){
        allObj.Cat[i] = {
          isChecked: allObj.Cat[i].isChecked,
          salePrice: format(multiply(bignumber(format(multiply(bignumber(allObj.Cat[i].marketPrice), bignumber(format(multiply(salesPercentage, bignumber(0.01))))))), bignumber(1.21))),
          sku: allObj.Cat[i].sku,
          spu: allObj.Cat[i].spu,
          subscriptionPrice: format(multiply(bignumber(format(multiply(bignumber(allObj.Cat[i].marketPrice), bignumber(format(multiply(subscriptionPercentage, bignumber(0.01))))))), bignumber(1.21))),
        }
      }
      newChooseObj = {...allObj.Cat,...newChooseObj}
    }
    if(checkAllObj.Dog){
      for(let i in allObj.Dog){
        allObj.Dog[i] = {
          isChecked: allObj.Dog[i].isChecked,
          salePrice: format(multiply(bignumber(format(multiply(bignumber(allObj.Dog[i].marketPrice), bignumber(format(multiply(salesPercentage, bignumber(0.01))))))), bignumber(1.21))),
          sku: allObj.Dog[i].sku,
          spu: allObj.Dog[i].spu,
          subscriptionPrice: format(multiply(bignumber(format(multiply(bignumber(allObj.Dog[i].marketPrice), bignumber(format(multiply(subscriptionPercentage, bignumber(0.01))))))), bignumber(1.21))),
        }
        allObj.Dog[i]['salePrice'] = parseFloat(allObj.Dog[i]['salePrice']);
        allObj.Dog[i]['subscriptionPrice'] = parseFloat(allObj.Dog[i]['subscriptionPrice']);
      }
      newChooseObj = {...allObj.Dog,...newChooseObj}
    }
    let array = []
    for(let i in newChooseObj){
      newChooseObj[i]['salePrice'] = parseFloat(newChooseObj[i]['salePrice']);
      newChooseObj[i]['subscriptionPrice'] = parseFloat(newChooseObj[i]['subscriptionPrice']);
      if(newChooseObj[i].isChecked){
        array.push(newChooseObj[i])
      }
    }
    setLoading(true)
    priceSetting({
      email: userInfo.accountName,
      storeId: userInfo.storeId,
      sourceStoreId: sourceStoreId,
      priceSettingList: array,
      companyInfoId:userInfo.companyInfoId
    }).then(res=>{
      setLoading(false)
      setStep(4)
    }).catch(err=>{
      setLoading(false)
    })
  };

  return (
      <FormContext.Provider
          value={{
            changeFormData: changeFormData,
            saveCheckAll: saveCheckAll,
            saveCheckStatus: saveCheckStatus,
            checkedObject:checkedObject,
            formData,
            percentageObj,
            roundOff:roundOff ? 2 : 6
          }}
      >
        <Spin spinning={loading} size="large">
          <div className="vmargin-level-4 align-item-center word big">4 / 5 Set a price for your product</div>
          <div style={{width:850,margin:'20px auto'}}>
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
                             step={10}
                             onChange={(value)=>setSalesPercentage(value)} />
              </Col>
              <Col span={6}>
                <InputNumber min={0}
                             style={{width:180}}
                             value={subscriptionPercentage}
                             step={10}
                             onChange={(value)=>setSubscriptionPercentage(value)} />
              </Col>
              {/* <Col span={3}>
                <Checkbox checked={roundOff} onChange={(e)=>{
                  setRoundOff(e.target.checked)
                }}>
                  <span className="word small tip">round off</span>
                </Checkbox>
              </Col> */}
              <Col span={12}>
                <div style={{display:'inline-flex'}}>
                  <Button type="primary" onClick={applyPercentage} style={{marginRight:6}}>Apply</Button>
                  <Button loading={loading} type="primary" onClick={savePrice} style={{marginRight:6}}>Save and Next</Button>
                  <Button onClick={() => setStep(2)}>back</Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="vmargin-level-4 hpadding-level-4">
            <Row gutter={24}>
              <Col span={12}>
                <ProductList dataSource={dataSource?.Cat?.array}
                             title="Cat"
                />
              </Col>
              <Col span={12}>
                <ProductList dataSource={dataSource?.Dog?.array}
                             title="Dog"
                />
              </Col>
            </Row>
          </div>
        </Spin>
      </FormContext.Provider>
  );
}


