import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SelectGroup, cache } from 'qmkit';
import moment from 'moment';
import SetDayTable from '../set-day-table';

import './index.less'

const { Option } = Select;

const ServiceSetting = ({ serviceData, serviceTypeDict, updateServiceData, updateTimeRangeErrInfo }) => {
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [cannotSelect, setCannotSelect] = useState([])
  const [selectedDateNos, setSelectedDateNos] = useState([])
  const [allWeeks] = useState([...Array(28).keys()]);
  const [daysList, setDaysList] = useState({
    days: [],
    dates: []
  })
  const [timeRangeErrInfo,setTimeRangeErrInfo] = useState([])

  useEffect(() => {
    // let _date = moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date());
    let dates =  allWeeks.map((item,idx) =>({
      date: moment(new Date()).day(item).format('YYYYMMDD'),
      sort:idx
    }));
    let days = dates.map(item => moment(item.date).format('M.DD'))
    setDaysList({
      days,
      dates
    })
  }, [])

  useEffect(() => {
    updateCannotSelected()
  }, [daysList, serviceData])

  const handleUpdateServiceData = (data, type?: string) => {
    updateServiceData(data)
    if (type === "delete") {
      updateCannotSelected()
    }
  }

  const updateCannotSelected = () => {
    let cannotSelectIdx = []
    if (daysList.dates.length) {
      daysList.dates?.map((dateItem, idx) => {
        serviceData.resourceServicePlanVOList?.map(_weekList =>
          _weekList.resourceWeekPlanVOList?.map(el => {
            el.resourceDatePlanVOS?.map(planItem => {
              if (dateItem.date === planItem.dateNo) {
                cannotSelectIdx.push(idx)
              }
            })
          })
        )
      })
    }
    setCannotSelect(cannotSelectIdx)
  }

  // 添加新的一条日期表格
  const AddSetByDay = (serviceSort) => {
    serviceData.resourceServicePlanVOList.map(el => {
      if (el.serviceSort === serviceSort) {
        let newList = [].concat(el.resourceWeekPlanVOList)
        const _idx = el.resourceWeekPlanVOList.length
        newList.push({
          sort: _idx + 1,
          timeSlotVO: {
            id: null,
            timeSlot: '',
          },
          resourceDatePlanVOS: []
        })
        el.resourceWeekPlanVOList = newList
      }
    })
    handleUpdateServiceData(serviceData)
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
      handleUpdateServiceData(Object.assign(serviceData, {
        isAll: 0,//目前只有felin,因此传0，后期再调整
      }))
    } else {
      // setShowAddBtn(false)
    }
  }

  const updateTableData = (data) => {
    let selectedDateNo = []
    serviceData.resourceServicePlanVOList.map(el => {
      el.resourceWeekPlanVOList.map(item => {
        // if(item.sort == data.sort)item = data;
        item.resourceDatePlanVOS.map(_item => selectedDateNo.push(_item.dateNo))
        handleTimeRangeErrInfo(data.timeSlotVO.timeSlot || '',data.sort)
      })
    })
    setSelectedDateNos(selectedDateNo)
    handleUpdateServiceData(serviceData)
  }

  // 校验输入的时间区间格式
  const handleTimeRangeErrInfo = (timeSlot, sort) => {
    let timesArr = [timeSlot]
    if (timeSlot.includes('|')) {
      timesArr = timeSlot.split('|')
    }
    const returnArr = timesArr.find(el => {
      return (!el.includes('-') || el.includes('undefined'))
    })
    if (returnArr) return

    let info = [...timeRangeErrInfo]
    timesArr.forEach((_itemTimeGroup, idx) => {
      const newTimes = _itemTimeGroup?.split('-')
      let startT = newTimes[0]?.split(':')
      let endT = newTimes[1]?.split(':')
      if (newTimes[0].includes(':') && newTimes[1].includes(':')) {
        const _idx = info?.findIndex(infoItem => infoItem.TIndex == idx && infoItem.TSort == sort)
        if (_idx > -1 && (startT[0] < endT[0] || (startT[0] === endT[0] && startT[1] <= endT[1]))) {
          info?.splice(_idx, 1)
        } else if (_idx < 0 && ( startT[0] > endT[0] || (startT[0] === endT[0] && startT[1] > endT[1]))) {
          info.push({
            info: 'Please enter the correct time range',
            TIndex: idx,
            TSort: sort
          })
        }
      }
    })
    setTimeRangeErrInfo(info)
    if(info.length){
      updateTimeRangeErrInfo(true)
    }else {
      updateTimeRangeErrInfo(false)
    }
  }

  const deleteLinePlanList = (sort) => {
    serviceData.resourceServicePlanVOList.map(item => {
      let remainData = item.resourceWeekPlanVOList.filter(el => el.sort !== sort)
      if(!remainData.length) remainData =[{
        sort: 1,
        timeSlotVO: {
          id: null,
          timeSlot: "",
        },
        resourceDatePlanVOS: []
      }]
      item.resourceWeekPlanVOList = remainData
    })
    handleUpdateServiceData(serviceData, 'delete')
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
                onChange={(value) => handleServiceType(value, el.serviceSort)}
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
              <Button type="primary" onClick={() => AddSetByDay(el.serviceSort)}>
                <FormattedMessage id="Setting.add" />
              </Button>
            </Col>
          </Row>
          {el.resourceWeekPlanVOList.map((itemWeekList, index) => (
            <SetDayTable
              weekList={itemWeekList}
              key={index}
              daysList={daysList}
              cannotSelect={cannotSelect}
              setCannotSelect={setCannotSelect}
              updateTableData={updateTableData}
              deleteLinePlanList={deleteLinePlanList}
              selectedDateNos={selectedDateNos}
              timeRangeErrInfo={timeRangeErrInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSetting;
