import React, {useContext, useEffect} from 'react';
import {Checkbox, Col, InputNumber, List, Row, Tooltip} from "antd";
import {bignumber, multiply, round, format} from "mathjs";

import { FormContext } from '../Step4';

const ListItem = List.Item;

function PriceListItem({listItem,checkedList}){
    // console.log('渲染2')
    const Context = useContext(FormContext);

    const {percentageObj,changeFormData,formData,roundOff} = Context
    const [isInit, setIsInit] = React.useState(true);
    const [sales, setSales] = React.useState(listItem.marketPrice);
    const [subscription, setSubscription] = React.useState(format(multiply(bignumber(listItem.marketPrice), bignumber(1.21))));
    const [sell, setSell] = React.useState(format(multiply(bignumber(listItem.marketPrice), bignumber(1.21))));
    /**
     * apply修改价格
     */
    useEffect(()=>{
        if(checkedList.indexOf(listItem.sku) !== -1){
            console.log(Context)
            let sell = format(multiply(bignumber(listItem.marketPrice), bignumber(percentageObj.salesPercentage)))
            sell = format(multiply(bignumber(sell), bignumber(1.21)))
            sell = bignumber(sell)
            sell = format(round(sell,roundOff))
            setSell(sell)
            let sale = format(multiply(bignumber(listItem.marketPrice), bignumber(percentageObj.salesPercentage)))
            sale = bignumber(sale)
            sale = format(round(sale,roundOff))
            setSales(sale)
            let subscription = format(multiply(bignumber(listItem.marketPrice), bignumber(percentageObj.subscriptionPercentage)))
            subscription = format(multiply(bignumber(subscription), bignumber(1.21)))
            subscription = bignumber(subscription)
            subscription = format(round(subscription,roundOff))
            setSubscription(subscription)
        }
    },[percentageObj])

    /**
     *
     */
    useEffect(()=>{
        //初始化不做处理
        console.log(isInit)
        if(!isInit){
            let isChecked = checkedList.indexOf(listItem.sku) !== -1
            changeFormData(listItem.sku,{
                salePrice: sales,
                sku: listItem.sku,
                spu: listItem.spu,
                subscriptionPrice: subscription,
                isChecked
            })
        }else {
            setIsInit(false)
        }
    },[sales,subscription,checkedList])

    return (
        <ListItem className="flex"  style={{height:56}}>
            <Row className="flex-item flex-main align-center" gutter={8} align="middle">
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
                        onChange={(value)=>setSales(value)}
                    />
                </Col>
                <Col span={4}>{sell}</Col>
                <Col span={5}>
                    <InputNumber
                        value={subscription}
                        onChange={(value)=>setSubscription(value)}
                    />
                </Col>
            </Row>
        </ListItem>
    )
}
export default PriceListItem