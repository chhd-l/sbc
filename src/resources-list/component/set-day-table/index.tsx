import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
const timeFormat = 'HH:mm';

const SetDayTable = (props) => {
  let { weekList, updateTableData, deleteLinePlanList, cannotSelect, setCannotSelect, daysList } = props
  const [singleTimeErrInfo,setSingleTimeErrInfo] =useState("")
  const [multipleTimeErrInfo,setMultipleTimeErrInfo] =useState("")

  // 时间段的添加按钮事件
  const handleAddTime = () => {
    const defaultTime = '';
    let newTime = weekList.timeSlotVO.timeSlot + "|" + defaultTime;
    weekList.timeSlotVO.timeSlot = newTime;
    updateTableData(weekList)
  }

  // 时间段的删除按钮事件
  const handleDeleteTime = (idx) => {
    const timeSlot = weekList.timeSlotVO.timeSlot || ''
    const times = timeSlot.split('|');
    const _time = times.map(item => item.split('-'))
    const newTimeArr = _time.filter((el, index) => idx !== index)
    const newTimeStr = newTimeArr.map(el => el.join('-')).join('|')
    weekList.timeSlotVO.timeSlot = newTimeStr
    updateTableData(weekList)
  }

  // 日期的复选框选择事件
  const dateCheck = (e, date, _daysList, dateChecked, selecetedIdx) => {
    let _resourceDatePlanVOS = []
    props.weekList.resourceDatePlanVOS.map(item => _resourceDatePlanVOS.push({
      id: item.id,
      dateNo: item.dateNo
    }))
    if (e.target.checked == true) {
      _resourceDatePlanVOS.push({
        id: null,//新选择的复选框，没有id，后端建议传null
        dateNo: date
      })
      cannotSelect = [...cannotSelect, selecetedIdx]
    } else if (e.target.checked == false) {
      _daysList.dates.map(item => {
        if (item.date == date) item.dateChecked = false
      })
      let deleteIndx = cannotSelect?.findIndex((el) => el === selecetedIdx)
      cannotSelect.splice(deleteIndx, 1)
      cannotSelect = cannotSelect
      _resourceDatePlanVOS = props.weekList.resourceDatePlanVOS.filter(el => el.dateNo !== date)
    }
    props.weekList.resourceDatePlanVOS = _resourceDatePlanVOS
    updateTableData(props.weekList)
    setCannotSelect(cannotSelect)
  }

  // handle
  const handleTimeErrInfo = (timeArr,idx) =>{
    console.log(timeArr,'timeArr======')
    const returnArr =  timeArr.find(el => {
      return(!el.includes('-') || el.includes('undefined'))
    })
    if(returnArr) return

    console.log(returnArr,'---return -00-0')
    timeArr.map((_itemTimeGroup,index) => {
    const newTimes = _itemTimeGroup?.split('-')
    let startT = newTimes[0]?.split(':')
    let endT = newTimes[1]?.split(':')
    let info = []
    if (newTimes[0].includes(":") && newTimes[1].includes(":")) {
    debugger

      let minuteDiff = startT[0] === endT[0] && startT[1] > endT[1] ? true : false
      if (timeArr.length === 1) {
        if ((startT[0] > endT[0] || minuteDiff)) {
          info.push('Please enter the correct time range')
        } else {
          info = []
        }

      }
      if (timeArr.length > 1) {
        if ((startT[0] > endT[0] || minuteDiff) && index === idx) {
          info.push('Please enter the correct time range')
          return
        } else if (index === idx) {
          const _idx = info.findIndex((itemInfo, itemInfoIdx) => itemInfoIdx === idx)
          info.splice(_idx, 1)
        }
      }
    }

    console.log(info, 'infooooooofio')
    })
  }

  // 单个错误时间区间提示
  const handleSingleTimeErrInfo = (timeGroup) => {
    const newTimes = timeGroup.split('-')
    let startT = newTimes[0]?.split(':')
    let endT = newTimes[1]?.split(':')
    let singleInfo = ''
    if (newTimes[0].includes(":") && newTimes[1].includes(":")) {
      let minuteDiff = startT[0] === endT[0] && startT[1] > endT[1] ? true : false
      if (startT[0] > endT[0] || minuteDiff) {
        singleInfo = 'Please enter the correct time range'
      } else {
        singleInfo = ''
      }
    }
    setSingleTimeErrInfo(singleInfo)
  }

  // 多条错误时间区间提示
  const handleMultipleTimeErrInfo = (timesArr, index) => {
    console.log(timesArr, index, '多组数据')
    const returnArr = timesArr.find(el => {
      return (!el.includes('-') || el.includes('undefined'))
    })
    if (returnArr) return
    let info = []
    debugger
    timesArr.map((_itemTimeGroup, idx) => {
      const newTimes = _itemTimeGroup?.split('-')
      let startT = newTimes[0]?.split(':')
      let endT = newTimes[1]?.split(':')
      if (newTimes[0].includes(":") && newTimes[1].includes(":")) {
        debugger

        let minuteDiff = startT[0] === endT[0] && startT[1] > endT[1] ? true : false
        if ((startT[0] > endT[0] || minuteDiff) && index === idx) {
          info.push('Please enter the correct time range')
          return
        } else if (index === idx) {
          const _idx = info.findIndex((itemInfo, itemInfoIdx) => itemInfoIdx === idx)
          info.splice(_idx, 1)
        }
      }

    })
    console.log(info, 'infooooooofio')


  }

  // 更改时间区间操作事件
  const timeChange = (timeStr, type, sort, idx) => {
    if (weekList.sort == sort) {
      const timeSlot = weekList.timeSlotVO.timeSlot || ''
      let newTimesStr = ''
      if (timeSlot.includes('|')) {
        let times = timeSlot.split('|');
        let _time = times.map(item => item.split('-'))
        _time.map((el, index) => {
          if (index === idx) {
            type == "start" ? el[0] = timeStr : el[1] = timeStr
          }
        })
        const newTimesArr = _time.map(el => el.join('-'))
        newTimesStr = newTimesArr.join('|')
        // handleMultipleTimeErrInfo(newTimesArr,idx)
      } else {
        let times = timeSlot.split('-')
        if (type == "start") {
          newTimesStr = `${timeStr}-${times[1]}`
        } else {
          newTimesStr = `${times[0]}-${timeStr}`
        }
        // handleSingleTimeErrInfo(newTimeStr)
      }
      weekList.timeSlotVO.timeSlot = newTimesStr
        // handleSingleTimeErrInfo(newTimeStr)
    }
    updateTableData(weekList)
  }

  // 时间区间的显示处理
  const handleTimeSlotFormat = (weekList) => {
    const timeSlot = weekList.timeSlotVO.timeSlot || ''
    let singleOrMultipleTimes = timeSlot.split('-')
    let _time = [singleOrMultipleTimes]
    if (timeSlot.includes('|')) {
      singleOrMultipleTimes = timeSlot.split('|')
      _time = singleOrMultipleTimes.map(item => item.split('-'))
    }
    return (_time.map((timeRange, idx) => {
      return (
        <div key={idx} style={{ marginTop: "6px" }}>
          <TimePicker
            format={timeFormat}
            className={'start-time-picker'}
            minuteStep={15}
            placeholder={'Start time'}
            value={timeRange[0].length ? moment(timeRange[0], timeFormat) : undefined}
            onChange={(time, timeStr) => { timeChange(timeStr, 'start', weekList.sort, idx) }}
            allowClear={false}
          />
          <span>-</span>
          <TimePicker
            format={timeFormat}
            className={'end-time-picker'}
            minuteStep={15}
            placeholder={'End time'}
            value={timeRange[1] && timeRange[1] !== "undefined" ? moment(timeRange[1], timeFormat) : undefined}
            onChange={(time, timeStr) => { timeChange(timeStr, 'end', weekList.sort, idx) }}
            allowClear={false}
          />
          <Icon type="plus-square" onClick={handleAddTime} />
          <Icon type="minus-square" onClick={() => handleDeleteTime(idx)} />
        </div>
      )
    })
    )
  }

  // 根据接口返回的数据遍历出选中的日期，设置选中的复选框
  const handlePlanDatesChecked = (daysList) => {
    let selectedDates = []
    props.weekList.resourceDatePlanVOS?.map(planItem => {
      selectedDates.push(planItem.dateNo)
    })

    return (
      <>
        {daysList.dates.map((dateItem, idx) =>
          <td key={idx}>
            <Checkbox
              disabled={!selectedDates.includes(dateItem.date) && cannotSelect.includes(idx)}
              onChange={(e) => dateCheck(e, dateItem.date, daysList, dateItem.dateChecked, idx)}
              checked={selectedDates.includes(dateItem.date)}
            ></Checkbox>
          </td>
        )}
      </>
    )
  }

  return (
    <>
      <table className="set-day-table">
        <thead>
          <tr>
            {daysList.days.map((day, idx) =>
              <th key={idx} style={{ width: '4.5%' }}>
                {day}
              </th>
            )}
            <th style={{ width: '31%' }}>
              <FormattedMessage id="Setting.timeSlot" />
            </th>
            <th style={{ width: '6.5%' }}>
              <FormattedMessage id="Setting.Delete" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {handlePlanDatesChecked(daysList)}
            <td style={{ paddingTop: 0 }}>
              {handleTimeSlotFormat(props.weekList)}
            </td>
            <td>
              <a
                type="link"
                className="iconfont iconDelete"
                onClick={() => deleteLinePlanList(props.weekList.sort)}
              ></a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default SetDayTable;
