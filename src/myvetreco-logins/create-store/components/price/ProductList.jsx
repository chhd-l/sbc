import React, {useContext} from 'react';
import {Row, Col, List, Checkbox} from 'antd';
import CheckboxItem from "./checkboxItem";
import { FormContext } from '../Step4';

import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import VList from 'react-virtualized/dist/es/List';

 function ProductList({dataSource=[], title}) {

     const Context = useContext(FormContext);
     const {saveCheckAll,saveCheckStatus} = Context

     const [isChecKedAll, setIsChecKedAll] = React.useState(false);


    const onCheckAllChange = (e)=>{
        setIsChecKedAll(e.target.checked)
        saveCheckAll(e.target.checked,title)
        if(!e.target.checked){
          saveCheckStatus(title,'clear',[])
        }
    }

    const renderItem = ({index, key, style}) => {
         const item = dataSource[index];
         return (
             <div key={key} style={style}>
                 <CheckboxItem item={item}
                               isChecKedAll={isChecKedAll}
                               title={title}
                 />
             </div>

         );
     };


     const vlist = ({height, width}) => (
         <VList
             // autoHeight
             height={height}
             rowCount={dataSource.length}
             rowHeight={({index})=> {
                 return dataSource[index].height
             }}
             rowRenderer={renderItem}
             width={width}
         />
     );

     const autoSize = () => (
         <AutoSizer disableHeight>
             {({ width }) =>
                vlist({height:600,width})
             }
         </AutoSizer>
     );
    return (
        <>
            <Row className="hpadding-level-1" gutter={8}  style={{marginBottom:'10px',fontWeight:500}}>
                <Col span={2}></Col>
                <Col span={6}>Product</Col>
                <Col span={2}>Cost</Col>
                <Col span={5}>Sales price(excl.VAT)</Col>
                <Col span={4}>Sales price(incl.VAT)</Col>
                <Col span={5}>Subscription price(incl.VAT)</Col>
            </Row>
            {/* <List
               className="store-p-list"
               style={{borderTop:'none'}}
               header={<Row gutter={8}>
                   <Col span={2}><Checkbox onChange={onCheckAllChange} /></Col>
                   <Col span={22} className="align-item-center word white">{title}</Col>
               </Row>}
               bordered
               dataSource={dataSource}
               renderItem={item => (<CheckboxItem item={item}
                                                  isChecKedAll={isChecKedAll}
               />)}
            /> */}


           <List
               className="store-p-list"
               style={{borderTop:'none'}}
               header={<Row gutter={8}>
                   <Col span={2}><Checkbox onChange={onCheckAllChange} /></Col>
                   <Col span={22} className="align-item-center word white">{title}</Col>
               </Row>}
               bordered
           >
               { dataSource.length > 0 && autoSize()}
           </List>
        </>
    );
}
export default React.memo(ProductList)