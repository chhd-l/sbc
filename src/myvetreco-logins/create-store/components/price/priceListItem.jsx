import React, {useContext, useEffect,useState} from 'react';
import {Checkbox, Col, InputNumber, List, Row, Tooltip} from "antd";
import {bignumber, multiply, round, format} from "mathjs";

import { FormContext } from '../Step4';

const ListItem = List.Item;

function PriceListItem({listItem,checkedList}){
    // console.log('渲染2')
    const Context = useContext(FormContext);

    const {percentageObj,changeFormData,formData,roundOff} = Context
    const [isInit, setIsInit] = useState(true);
    const [sales, setSales] = useState(listItem.marketPrice);
    const [subscription, setSubscription] = useState(format(multiply(bignumber(listItem.marketPrice), bignumber(1.21)),{notation: 'fixed', precision: roundOff}));
    const [sell, setSell] = useState(format(multiply(bignumber(listItem.marketPrice), bignumber(1.21)),{notation: 'fixed', precision: roundOff}));
    /**
     * 初始化时 取到用户改变的值
     */
    useEffect(()=>{
        if(formData[listItem.sku]){
            setSales(formData[listItem.sku].salePriceExclVat)
            setSubscription(formData[listItem.sku].subscriptionPrice)
            setSell(formData[listItem.sku].salePrice)
        }
    },[])
    /**
     * apply修改价格
     */
    useEffect(()=>{
        if(checkedList.indexOf(listItem.sku) !== -1){
            let sell = format(multiply(bignumber(listItem.marketPrice), bignumber(format(multiply(percentageObj.salesPercentage, bignumber(0.01))))))
            sell = format(multiply(bignumber(sell), bignumber(1.21)))
            sell = bignumber(sell)
            sell = format(sell,{notation: 'fixed', precision: roundOff})
            setSell(sell)
            let sale = format(multiply(bignumber(listItem.marketPrice), bignumber(format(multiply(percentageObj.salesPercentage, bignumber(0.01))))))
            sale = bignumber(sale)
            sale = format(sale,{notation: 'fixed', precision: roundOff})
            setSales(sale)
            let subscription = format(multiply(bignumber(listItem.marketPrice), bignumber(format(multiply(percentageObj.subscriptionPercentage, bignumber(0.01))))))
            subscription = format(multiply(bignumber(subscription), bignumber(1.21)))
            subscription = bignumber(subscription)
            subscription = format(subscription,{notation: 'fixed', precision: roundOff})
            setSubscription(subscription)
        }
    },[percentageObj])


    /**
     * 数据变化去更新数据
     */
    useEffect(()=>{
        //初始化不做处理
        if(!isInit){
            let isChecked = checkedList.indexOf(listItem.sku) !== -1
            changeFormData(listItem.sku,{
                salePrice: sell,//含税价格
                sku: listItem.sku,
                spu: listItem.spu,
                subscriptionPrice: subscription,
                salePriceExclVat:sales,//不含税价格
                isChecked
            })
        }else {
            setIsInit(false)
        }
    },[sales,subscription,checkedList])

    const changeSalesPrice = (value)=>{
        setSales(value)
        let sell = format(multiply(bignumber(value), bignumber(1.21)))
        sell = bignumber(sell)
        // sell = format(round(sell,roundOff))
        sell = format(sell,{notation: 'fixed', precision: roundOff})
        setSell(sell)
    }
    return (
        <ListItem className="flex"  style={{height:56}}>
            <Row type="flex" className="flex-item flex-main align-center" gutter={8} align="middle">
                <Col span={2}><Checkbox value={listItem.sku}/></Col>
                <Col span={6}>
                    <Tooltip placement="topLeft" title={listItem.skuName}>
                        <div className="ellipsis">
                            {listItem.skuName}
                        </div>
                    </Tooltip>
                </Col>
                <Col span={2}>{listItem.marketPrice}</Col>
                <Col span={5}>
                    <InputNumber
                        value={sales}
                        precision={2}
                        onChange={(value)=>changeSalesPrice(value)}
                    />
                </Col>
                <Col span={4}>{sell}</Col>
                <Col span={5}>
                    <InputNumber
                        value={subscription}
                        precision={2}
                        onChange={(value)=>setSubscription(value)}
                    />
                </Col>
            </Row>
        </ListItem>
    )
}
export default PriceListItem