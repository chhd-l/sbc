import React, { useEffect, useState } from 'react';
import {
  Input,
  Modal,
  Table,
  Form,
  DatePicker,
  Popconfirm,
  Icon,
  Divider, message,
  Row, Col, Button, Select, TimePicker,
  Checkbox
} from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, RCi18n, SelectGroup, cache } from 'qmkit';
import SetDayTable from '../set-day-table';

import './index.less'

const { Option } = Select;

const ServiceSetting = ({serviceData,serviceTypeDict,selectDisabled,updateServiceData }) => {
  console.log(serviceData,'dddddse')
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [selectedDateNos,setSelectedDateNos] = useState([])

  useEffect(()=>{
    // let selectedDateNo = []
    // serviceData.resourceServicePlanVOList.map(el =>{
    //   el.resourceWeekPlanVOList.map(item => item.resourceDatePlanVOS.map(_item =>selectedDateNo.push(_item.dateNo)))
    // })
    // console.log(selectedDateNo,'selectedDateNoselectedDateNo')
    // setSelectedDateNos(selectedDateNo)
  },[serviceData])

// 添加新的一条日期表格
  const AddSetByDay = (serviceSort) => {
    serviceData.resourceServicePlanVOList.map(el =>{
      if(el.serviceSort === serviceSort){
        let newList = [].concat(el.resourceWeekPlanVOList)
        const _idx = el.resourceWeekPlanVOList.length
        newList.push({
          sort: _idx + 1,
          timeSlotVO: {
            id: null,
            timeSlot: "00:00-23:59",
          },
          resourceDatePlanVOS: []
        })
        el.resourceWeekPlanVOList = newList
      }
    })
    updateServiceData(serviceData)
  }

  // serviceType下拉选择
  const handleServiceType = (value, sort) => {
    if (value !== 'all') {
      // setShowAddBtn(true)
      serviceData.resourceServicePlanVOList.map(el => {
        if (el.serviceSort === sort) {
          el.serviceTypeId = value
        }
      })
      updateServiceData(Object.assign(serviceData, {
        isAll: 0,//目前只有felin,因此传0，后期再调整
      }))
    } else {
      // setShowAddBtn(false)
    }
  }

  const updateTableData = (data) => {
    let selectedDateNo = []
    serviceData.resourceServicePlanVOList.map(el =>{
      el.resourceWeekPlanVOList.map(item => {
        item.sort ==data.sort
        item =data
        item.resourceDatePlanVOS.map(_item =>selectedDateNo.push(_item.dateNo))
      })
    })
    // setSelectedDateNos(selectedDateNo)
    updateServiceData(serviceData)
  }

  const deleteLinePlanList = (sort)=>{
    serviceData.resourceServicePlanVOList.map(item =>{
      let remainData = item.resourceWeekPlanVOList.filter(el => el.sort !==sort)
      item.resourceWeekPlanVOList = remainData
    })
    updateServiceData(serviceData)
  }
  return (
    <div>
      {serviceData?.resourceServicePlanVOList?.map((el, idx) =>
        <div key={idx} className="setting-outside-warp">
          <Row>
            <Col span={8} >
              <SelectGroup
                allowClear
                label={
                  <p className="service-type-label">
                    <FormattedMessage id="Resources.service_type" />
                  </p>
                }
                // disabled={selectDisabled}
                value={el.serviceTypeId}
                onChange={(value)=>handleServiceType(value,el.serviceSort)}
              >
                {serviceTypeDict?.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </SelectGroup>
            </Col>
          </Row>
          <Row className="set-by-day-title">
            <Col span={3} >
              <p>
                <FormattedMessage id="Resources.set_by_day" />
              </p>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={()=>AddSetByDay(el.serviceSort)}>
                <FormattedMessage id="Setting.add" />
              </Button>
            </Col>
          </Row>
          {el.resourceWeekPlanVOList.map((itemWeekList,index) => (
            <SetDayTable
              weekList={itemWeekList}
              key={index}
              updateTableData={updateTableData}
              deleteLinePlanList={deleteLinePlanList}
              selectedDateNos={selectedDateNos}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default ServiceSetting;
