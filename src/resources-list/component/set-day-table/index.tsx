import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
const timeFormat = 'HH:mm';

const SetDayTable = (props) => {
  let { weekList, updateTableData, deleteLinePlanList, cannotSelect, setCannotSelect, daysList, timeRangeErrInfo } = props

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
      cannotSelect = [...cannotSelect]
      _resourceDatePlanVOS = props.weekList.resourceDatePlanVOS.filter(el => el.dateNo !== date)
    }
    props.weekList.resourceDatePlanVOS = _resourceDatePlanVOS
    updateTableData(props.weekList)
    setCannotSelect(cannotSelect)
  }

  // 更改时间区间操作事件
  const timeChange = (timeString, type, sort, idx) => {
    let timeStr = timeString
    if(timeString.includes('20')) timeStr ="20:00"
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
      } else {
        let times = timeSlot.split('-')
        if (type == "start") {
          newTimesStr = `${timeStr}-${times[1]}`
        } else {
          newTimesStr = `${times[0]}-${timeStr}`
        }
      }
      weekList.timeSlotVO.timeSlot = newTimesStr
    }
    updateTableData(weekList)
  }

  const handleDisabledMinutes = (selectedHour) =>{
    let disabledMinutes = []
    if(selectedHour == 20) {
      disabledMinutes.push(15,30,45)
    }
    return disabledMinutes
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

    return (
      <div>
        {_time.map((timeRange, idx) => {
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
                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23]}
                disabledMinutes={(selectedHour)=>handleDisabledMinutes(selectedHour)}
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
                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23]}
                disabledMinutes={(selectedHour)=>handleDisabledMinutes(selectedHour)}
              />
              <Icon type="plus-square" onClick={handleAddTime} />
              {_time.length > 1 ? <Icon type="minus-square" onClick={() => handleDeleteTime(idx)} /> : null}
            </div>
          )
        })}
        {timeRangeErrInfo.map(infoItem => infoItem.TSort == weekList.sort ? <span style={{ color: "#f5222d" }}>
          {/* {infoItem.info} */}
          <FormattedMessage id='Resources.TimeErrorInfo' />
        </span> : null)}
      </div>
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
