import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SelectGroup, cache } from 'qmkit';
import moment from 'moment';
import SetDayTable from '../set-day-table';

import './index.less'

const { Option } = Select;

const ServiceSetting = ({ serviceData, serviceTypeDict, updateServiceData }) => {
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [cannotSelect, setCannotSelect] = useState([])
  const [selectedDateNos, setSelectedDateNos] = useState([])
  const [allWeeks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const [daysList, setDaysList] = useState({
    days: [],
    dates: []
  })

  useEffect(() => {
    // let _date = moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date());
    let dates = []
    allWeeks.map(item => dates.push({
      date: moment(new Date()).day(item).format('YYYYMMDD')
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
        item.sort == data.sort
        item = data
        item.resourceDatePlanVOS.map(_item => selectedDateNo.push(_item.dateNo))
      })
    })
    setSelectedDateNos(selectedDateNo)
    handleUpdateServiceData(serviceData)
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSetting;
