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

const ServiceTypeOptionsMock = [{
  value: 'all',
  label: 'all',
}, {
  value: '1',
  label: 'a',
}, {
  value: '2',
  label: 'b',
},]
const format = 'HH:mm';
const { Option } = Select;
const FormItem = Form.Item;
let resourceList = [];
const ServiceSetting = ({serviceData, addCounts,serviceTypeDict,selectDisabled,updateServiceData }) => {
 console.log(serviceData,'serviceData1111')
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [settingCounts, setSettingCounts] = useState(addCounts || [1])
  const [changeData,setChangeData]= useState({})
  const [resourceList,setResourceList] = useState([])

  const [deliveryForm, setDeliveryForm] = useState({
    deliveryOption: 1,
    city: [],
    rangeDays: 5,
    cutOffTime: null,
    openDate: [
      {
        weeks: [],
        times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }],
        sort: 1
      }
    ],
    closeDate: [
      {
        closeDay: null,
        sort: 1
      }
    ]
  })
  const [servicePlanData,setServicePlanData] = useState({
    isAll:1,
    resourceServicePlanVOList: [{
      serviceTypeId: "",
      serviceSort: "1",//serviceType的设置顺序
      resourceWeekPlanVOList: [{
        sort: "1",//一个serviceType下,日期选择行的顺序
        timeSlotVO: {
          id: "",
          timeSlot: "",
        },
        resourceDatePlanVOS: [{
          id: "",
          dateNo: "yyyymmdd 20210101"
        }]
      }]
    }]
  })

  const [allWeeks] = useState([0,1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13]);
  const [daysList,setDaysList] = useState([{
    days:[],
    times:'00:00-23:59'
  }])

  useEffect(()=>{
    // let _date = moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date());
    let days = allWeeks.map(item => moment(new Date()).day(item).format('M.DD'));
      setDaysList([{
        days:days,
        times:'00:00-23:59'
      }])
  },[])


  const AddSetByDay = () => {
  }

  // serviceType下拉选择
  const handleServiceType = (value) => {
    let isAll = 0;
    let resourceServicePlanVOList = []
    console.log(value, 'ServiceTypeValue')
    // todo:下拉码值value:all需根据接口更改
    if (value !== 'all') {
      setShowAddBtn(true)
      // setServicePlanData(Object.assign(servicePlanData,{
      //   isAll:0,
      //   resourceServicePlanVOList:
      // }))
    } else {
      setShowAddBtn(false)
    setSettingCounts([1])
    setServicePlanData(Object.assign(servicePlanData,{
      isAll:1
    }))
    }
    // resourceList.push({
    //   serviceTypeId: value,
    //   serviceSort:'1',
    //   "resourceWeekPlanVOList": [{

    //   }]
    // })
    // setChangeData({
    //   isAll,
    //   resourceServicePlanVOList:resourceList
    // })
  }

  // 新增服务类型和setDay
  const addServiceType = () => {
    let counts = [].concat(settingCounts);
    counts.push(1)
    setSettingCounts(counts)
  }

  const updateTableData = (data) =>{
    serviceData.resourceServicePlanVOList.map(item =>{
      item.sort ==data.sort
      item =data
    })
    updateServiceData(serviceData)
  }
  return (
    <div>
      {/* {settingCounts.map((item, idx) => */}
        <div className="setting-outside-warp">
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
                onChange={handleServiceType}
              >
                {serviceTypeDict?.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </SelectGroup>
            </Col>
            {/* {showAddBtn && idx===0 ?  */}
            {/* <Col span={2} offset={1}>
              <Button type="primary" onClick={addServiceType}>
                <FormattedMessage id="Setting.add" />
              </Button>
            </Col> */}
            {/* : null} */}
          </Row>
          <Row className="set-by-day-title">
            <Col span={3} >
              <p>
                <FormattedMessage id="Resources.set_by_day" />
              </p>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={AddSetByDay}>
                <FormattedMessage id="Setting.add" />
              </Button>
            </Col>
          </Row>
          {serviceData.resourceServicePlanVOList.map((item, index) => (
            <SetDayTable
              // allSelectWeeks={allSelectWeeks}
              weekList={item.resourceWeekPlanVOList}
              key={index}
              updateTableData={updateTableData}
            // editOpenTable={editOpenTable}
            // deleteOpenTable={deleteOpenTable}
            />
          ))}
        </div>
      {/* )} */}

    </div>
  );
};

export default ServiceSetting;
