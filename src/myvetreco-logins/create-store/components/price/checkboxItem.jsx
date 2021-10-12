import React, {useEffect,useContext} from 'react';
import {Checkbox, Col, List, Row} from "antd";
import PriceListItem from "./priceListItem";
import { FormContext } from '../Step4'

const ListItem = List.Item;

function CheckboxItem({item,isChecKedAll=false,title}){
    // console.log('渲染')
    const Context = useContext(FormContext);
    const {saveCheckStatus,checkedObject} = Context

    const [checkedList, setCheckedList] = React.useState([]);
    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);

    useEffect(()=>{
        if(isChecKedAll) {
            //当checkAll不为true的时候执行（为了优化代码速度）
            if(!checkAll){
                setCheckedList([...item.skuList])
                setCheckAll(true);
            }
        }else {
            //当checkAll为true的时候执行（为了优化代码速度）
            if(checkAll){
                setCheckedList([])
                saveCheckStatus(title,item.spu,[])
                setCheckAll(false);
            }else {
                let list = checkedObject[title][item.spu] || []

                setCheckedList(list);
                setIndeterminate(!!list.length && list.length < item.skuList.length);
                setCheckAll(list.length === item.skuList.length);
            }
        }
    },[isChecKedAll])

    const onChange = list => {
        //保存选中状态
        saveCheckStatus(title,item.spu,list)

        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < item.skuList.length);
        setCheckAll(list.length === item.skuList.length);
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? item.skuList : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        //保存选中状态
        saveCheckStatus(title,item.spu,e.target.checked ? item.skuList : [])
    };
    return (
        <>
            <ListItem key={item.spu} className="flex align-center center" style={{backgroundColor:'#f8f8f8',height:56}}>
                <Row className="flex-item flex-main" gutter={8}>
                    <Col span={2}>
                        <Checkbox value={item.spu}
                                  indeterminate={indeterminate}
                                  onChange={onCheckAllChange}
                                  checked={checkAll}/></Col>
                    <Col span={22} className="align-item-center">{item.spuName}</Col>
                </Row>
            </ListItem>
            <Checkbox.Group style={{width: '100%'}} onChange={onChange} value={checkedList}>
                {item.children.map((listItem, idx) => (
                    <PriceListItem listItem={listItem}
                                   checkedList={checkedList}
                                   key={`${listItem.sku}-${idx}`}
                    />
                ))}
            </Checkbox.Group>
        </>
    )
}
export default CheckboxItem