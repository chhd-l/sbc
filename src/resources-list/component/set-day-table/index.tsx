import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
import { update } from '_@types_lodash@4.14.172@@types/lodash';
const timeFormat = 'HH:mm';

const SetDayTable = (props) => {
  let { weekList, updateTableData, deleteLinePlanList, cannotSelect, setCannotSelect, daysList } = props

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
      // debugger
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

  // 更改时间区间操作事件
  const timeChange = (timeStr, type, sort, idx) => {
    if (weekList.sort == sort) {
      const timeSlot = weekList.timeSlotVO.timeSlot || ''
      if (timeSlot.includes('|')) {
        let times = timeSlot.split('|');
        let _time = times.map(item => item.split('-'))
        _time.map((el, index) => {
          if (index === idx) {
            type == "start" ? el[0] = timeStr : el[1] = timeStr
          }
        })
        const newTimesStr = _time.map(el => el.join('-')).join('|')
        weekList.timeSlotVO.timeSlot = newTimesStr
      } else {
        let times = timeSlot.split('-')
        if (type == "start") {
          let newTimeStr = `${timeStr}-${times[1]}`
          weekList.timeSlotVO.timeSlot = newTimeStr
        } else {

          let _newTimeStr = `${times[0]}-${timeStr}`
          weekList.timeSlotVO.timeSlot = _newTimeStr
        }
      }
    }
    updateTableData(weekList)
  }

  // 时间区间的显示处理
  const handleTimeSlotFormat = (weekList) => {
    const timeSlot = weekList.timeSlotVO.timeSlot || ''
    // 多个时间组
    if (timeSlot.includes('|')) {
      let times = timeSlot.split('|');
      let _time = times.map(item => item.split('-'))
      return (_time.map((timeRange, idx) => {
        return (
          <div key={idx} style={{ marginTop: "6px" }}>
            <TimePicker
              format={timeFormat}
              className={'start-time-picker'}
              minuteStep={15}
              placeholder={'Start time'}
              // value={moment(timeRange[0], timeFormat)}
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
              // value={moment(timeRange[1], timeFormat)}
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
    } else {
      // 单条数据组
      let singleTime = timeSlot.split('-');
      return (
        <div style={{ marginTop: "6px" }}>
          <TimePicker
            format={timeFormat}
            className={'start-time-picker'}
            minuteStep={15}
            value={singleTime[0].length ? moment(singleTime[0], timeFormat) : undefined}
            placeholder={'Start time'}
            onChange={(time, timeStr) => { timeChange(timeStr, 'start', weekList.sort, -1) }}
            allowClear={false}
          />
          <span>-</span>
          <TimePicker
            format={timeFormat}
            className={'end-time-picker'}
            minuteStep={15}
            placeholder={'End time'}
            value={singleTime[1] && singleTime[1] !== "undefined" ? moment(singleTime[1], timeFormat) : undefined}
            onChange={(time, timeStr) => { timeChange(timeStr, 'end', weekList.sort, -1) }}
            allowClear={false}
          />
          <Icon type="plus-square" onClick={handleAddTime} />
        </div>
      )
    }
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
