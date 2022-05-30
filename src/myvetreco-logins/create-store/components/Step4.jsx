import React, { useCallback, useEffect, useState } from 'react';
import { Button, Row, Col, Input, Checkbox, InputNumber, message, Spin } from 'antd';
import ProductList from './price/ProductList';
import { listCategory, listGoodsByCategory, priceSetting } from '../webapi';
import { bignumber, multiply, round, format } from 'mathjs';
import { cache, RCi18n, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

export const FormContext = React.createContext({});

const enumType = {
  0: 'Cat',
  1: 'Dog'
};
const isMYVETRECO = Const.SITE_NAME === 'MYVETRECO';
export default function Step4({ setStep, userInfo, step, sourceStoreId }) {
  const [formData, setFormData] = useState({});
  const [checkedObject, setCheckedObject] = useState({ Cat: {}, Dog: {} }); //选中状态{Cat:{},Dog:{}}

  const [allObj, setAllObj] = useState({}); //平铺所有sku选项结构{Cat:{},Dog:{}}
  const [checkAllObj, setCheckAllObj] = useState({ Cat: true, Dog: true }); //cat或者dog是否全选

  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  const [salesPercentage, setSalesPercentage] = useState(100);
  const [subscriptionPercentage, setSubscriptionPercentage] = useState(100);
  const [percentageObj, setPercentageObj] = useState({
    salesPercentage: 100,
    subscriptionPercentage: 100
  }); //用于点击apply
  const [roundOff, setRoundOff] = useState(true);

  useEffect(() => {
    if (step === 3) getCateGory();
  }, [step]);
  const getCateGory = () => {
    setLoading(true);
    listCategory().then(({ res }) => {
      let animalTypeList = res.context.categoryList;
      let dog = animalTypeList.find((item) => item.categoryValue === 'Dog');
      let Cat = animalTypeList.find((item) => item.categoryValue === 'Cat');
      let promises = [
        listGoodsByCategory({
          categoryId: Cat.categoryId,
          categoryValueId: Cat.categoryValueId
        }),
        listGoodsByCategory({
          categoryId: dog.categoryId,
          categoryValueId: dog.categoryValueId
        })
      ];
      console.log(promises);
      Promise.all(promises).then(function (posts) {
        console.log(posts);
        posts.forEach((result, index) => {
          let post = result.res;
          let spuList = {};
          let skuList = {};
          post.context.libGoodsList.forEach((it) => {
            skuList[it.sku] = {
              ...it,
              isChecked: true
            };
            if (spuList[it.spu]) {
              spuList[it.spu].children.push(it);
              spuList[it.spu].skuList.push(it.sku);
              spuList[it.spu].height = spuList[it.spu].height + 56;
            } else {
              spuList[it.spu] = {
                spu: it.spu,
                spuName: it.spuName,
                children: [{ ...it }],
                skuList: [it.sku],
                height: 112
              };
            }
          });
          let arr = [];
          for (let i in spuList) {
            let o = {};
            o = spuList[i]; //即添加了key值也赋了value值 o[i] 相当于o.name 此时i为变量
            arr.push(o);
          }
          dataSource[enumType[index]] = {
            title: enumType[index],
            array: arr
          };
          allObj[enumType[index]] = skuList;
        });
        console.log(allObj);
        setAllObj(Object.assign({}, { ...allObj }));
        setDataSource({ ...dataSource });
        setLoading(false);
      });
    });
  };
  /**
   * 点apply对选中条目价格进行计算
   */

  const setAbovePrice = () => {
    setPercentageObj({
      salesPercentage: salesPercentage + 100,
      subscriptionPercentage
    });
  };
  const setDiscountPrice = () => {
    setPercentageObj({
      salesPercentage,
      subscriptionPercentage: 100 - subscriptionPercentage
    });
  };
  /**
   * 收集所有修改过的price,和选中的值
   * @param sku
   * @param data
   */
  const changeFormData = (sku, data) => {
    formData[sku] = Object.assign({}, data);
    // console.log(formData)
    setFormData(formData);
  };
  // 保存全选/全不选的状态 （因为虚拟列表所有在此处对所有数据进行操作）
  // const saveCheckAll = (isChecked, type) => {
  //   checkAllObj[type] = isChecked;
  //   setCheckAllObj(checkAllObj);
  // };
  /**
   * 保存选中状态（虚拟列表会重刷组件，导致状态丢失）
   * @param spu
   * @param list
   */
  const saveCheckStatus = (title, spu, list) => {
    if (spu === 'clear') {
      checkedObject[title] = {};
    } else {
      checkedObject[title][spu] = [...list];
      console.log(checkedObject);
      setCheckedObject(checkedObject);
    }
  };
  /**
   * 保存价格设置
   */
  const savePrice = () => {
    let newChooseObj = { ...formData };
    //点击全选时插入所有数据
    if (checkAllObj.Cat) {
      for (let i in allObj.Cat) {
        allObj.Cat[i] = {
          isChecked: allObj.Cat[i].isChecked,
          salePrice: format(
            multiply(
              bignumber(
                format(
                  multiply(
                    bignumber(allObj.Cat[i].marketPrice),
                    bignumber(format(multiply(bignumber(salesPercentage), bignumber(0.01))))
                  )
                )
              ),
              bignumber(1.21)
            )
          ),
          salePriceExclVat: format(
            multiply(
              bignumber(allObj.Cat[i].marketPrice),
              bignumber(format(multiply(bignumber(salesPercentage), bignumber(0.01))))
            )
          ),
          sku: allObj.Cat[i].sku,
          spu: allObj.Cat[i].spu,
          subscriptionPrice: format(
            multiply(
              bignumber(
                format(
                  multiply(
                    bignumber(allObj.Cat[i].marketPrice),
                    bignumber(format(multiply(bignumber(subscriptionPercentage), bignumber(0.01))))
                  )
                )
              ),
              bignumber(1.21)
            )
          )
        };
      }
      newChooseObj = { ...allObj.Cat, ...newChooseObj };
    }
    if (checkAllObj.Dog) {
      for (let i in allObj.Dog) {
        allObj.Dog[i] = {
          isChecked: allObj.Dog[i].isChecked,
          salePrice: format(
            multiply(
              bignumber(
                format(
                  multiply(
                    bignumber(allObj.Dog[i].marketPrice),
                    bignumber(format(multiply(bignumber(salesPercentage), bignumber(0.01))))
                  )
                )
              ),
              bignumber(1.21)
            )
          ),
          salePriceExclVat: format(
            multiply(
              bignumber(allObj.Dog[i].marketPrice),
              bignumber(format(multiply(bignumber(salesPercentage), bignumber(0.01))))
            )
          ),
          sku: allObj.Dog[i].sku,
          spu: allObj.Dog[i].spu,
          subscriptionPrice: format(
            multiply(
              bignumber(
                format(
                  multiply(
                    bignumber(allObj.Dog[i].marketPrice),
                    bignumber(format(multiply(bignumber(subscriptionPercentage), bignumber(0.01))))
                  )
                )
              ),
              bignumber(1.21)
            )
          )
        };
        allObj.Dog[i]['salePrice'] = parseFloat(allObj.Dog[i]['salePrice']);
        allObj.Dog[i]['subscriptionPrice'] = parseFloat(allObj.Dog[i]['subscriptionPrice']);
      }
      newChooseObj = { ...allObj.Dog, ...newChooseObj };
    }
    let array = [];
    for (let i in newChooseObj) {
      newChooseObj[i]['salePrice'] = parseFloat(newChooseObj[i]['salePrice']);
      newChooseObj[i]['subscriptionPrice'] = parseFloat(newChooseObj[i]['subscriptionPrice']);
      newChooseObj[i]['salePriceExclVat'] = parseFloat(newChooseObj[i]['salePriceExclVat']);
      if (newChooseObj[i].isChecked) {
        array.push(newChooseObj[i]);
      }
    }
    setLoading(true);
    priceSetting({
      email: userInfo.accountName,
      storeId: userInfo.storeId,
      sourceStoreId: sessionStorage.getItem(cache.CREATESTORE_SOURCE_STORE_ID) || sourceStoreId,
      priceSettingList: array,
      companyInfoId: userInfo.companyInfoId
    })
      .then((res) => {
        setLoading(false);
        setStep(4);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <FormContext.Provider
      value={{
        changeFormData: changeFormData,
        saveCheckAll: saveCheckAll,
        saveCheckStatus: saveCheckStatus,
        checkedObject: checkedObject,
        formData,
        percentageObj,
        roundOff: roundOff ? 2 : 6
      }}
    >
      <Spin spinning={false} size="large">
        <div className="vmargin-level-4 align-item-center word big">
          4 / 5 <FormattedMessage id="Store.setprice" />
        </div>

        {isMYVETRECO ? (
          <>
            <div className="step4-myvet-top-content-item">
              I would like to set market price (excl. VAT) above the cost with .
              <InputNumber
                min={0}
                value={salesPercentage}
                style={{ width: 180 }}
                step={10}
                precision={2}
                onChange={(value) => setSalesPercentage(value)}
              />
              %
              <Button type="primary" onClick={setAbovePrice} style={{ marginRight: 6 }}>
                <FormattedMessage id="payment.apply" />
              </Button>
            </div>
            <div className="step4-myvet-top-content-item">
              I would like to offer subscription to pet owners with a default discount:
              <InputNumber
                min={0}
                style={{ width: 180 }}
                value={subscriptionPercentage}
                step={10}
                precision={2}
                onChange={(value) => setSubscriptionPercentage(value)}
              />
              %
              <Button type="primary" onClick={setDiscountPrice} style={{ marginRight: 6 }}>
                <FormattedMessage id="payment.apply" />
              </Button>
            </div>
            <div className="step4-myvet-top-content-item word small tip">
              By applying this discount, your market price (incl. VAT) and subscription prices will
              be set automatically in following product catalogues.
            </div>
          </>
        ) : (
          <div style={{ width: 850, margin: '20px auto' }}>
            <Row gutter={24} style={{ marginBottom: '10px' }}>
              <Col span={6}>
                <div className="word small tip">
                  <FormattedMessage id="Store.marketpriceper" />
                </div>
              </Col>
              <Col span={6}>
                <div className="word small tip">
                  <FormattedMessage id="Store.subscriptionper" />
                </div>
              </Col>
            </Row>
            <Row gutter={24} type="flex" align="middle">
              <Col span={6}>
                <InputNumber
                  min={0}
                  value={salesPercentage}
                  style={{ width: 180 }}
                  step={10}
                  precision={2}
                  onChange={(value) => setSalesPercentage(value)}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={0}
                  style={{ width: 180 }}
                  value={subscriptionPercentage}
                  step={10}
                  precision={2}
                  onChange={(value) => setSubscriptionPercentage(value)}
                />
              </Col>
              <Col span={12}>
                <div style={{ display: 'inline-flex' }}>
                  <Button type="primary" onClick={applyPercentage} style={{ marginRight: 6 }}>
                    <FormattedMessage id="payment.apply" />
                  </Button>
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={savePrice}
                    style={{ marginRight: 6 }}
                  >
                    <FormattedMessage id="Store.savetonext" />
                  </Button>
                  <Button onClick={() => setStep(2)}>
                    <FormattedMessage id="back" />
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
        <div className="vmargin-level-4 hpadding-level-4">
          <Row gutter={24}>
            <Col span={12}>
              <ProductList
                dataSource={dataSource?.Cat?.array}
                title={RCi18n({ id: 'Order.cat' })}
              />
            </Col>
            <Col span={12}>
              <ProductList
                dataSource={dataSource?.Dog?.array}
                title={RCi18n({ id: 'Order.dog' })}
              />
            </Col>
          </Row>
        </div>
        {isMYVETRECO && (
          <Row type="flex" justify="center">
            <div style={{ display: 'inline-flex' }}>
              <Button
                loading={loading}
                type="primary"
                onClick={savePrice}
                style={{ marginRight: 6 }}
              >
                <FormattedMessage id="Store.savetonext" />
              </Button>
              <Button onClick={() => setStep(2)}>
                <FormattedMessage id="back" />
              </Button>
            </div>
          </Row>
        )}
      </Spin>
    </FormContext.Provider>
  );
}
