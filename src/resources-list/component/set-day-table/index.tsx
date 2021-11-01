import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
const timeFormat = 'HH:mm';
const SetDayTable = (props) => {
  const { weekList, updateTableData,deleteLinePlanList } = props
  console.log(weekList, 'WeekList5666666')
  const [allWeeks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const [daysList, setDaysList] = useState({
    days: [],
    dates: []
  })
  const [defaultWeekList, setDefaultWeekList] = useState(weekList)

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
    // weekList.map(item => Object.assign(item, {
    //   defaultDays: {
    //     days,
    //     dates
    //   }
    // }))
    // setDefaultWeekList(weekList)
  }, [])

  function addTime() {
    const maxSort = Math.max(...props.openDate.times.map((x) => [x.sort]));
    var newTime = [
      ...props.openDate.times,
      {
        startTime: '00:00',
        endTime: '23:59',
        sort: maxSort + 1
      }
    ];
    changeTime(newTime);
  }

  // 时间段的添加按钮事件
  const handleAddTime = () => {
    const defaultTime = "00:00-23:59";
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
  const dateCheck = (e, date, _daysList, dateChecked) => {
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
    } else if (e.target.checked == false) {
      _daysList.dates.map(item => {
        if (item.date == date) item.dateChecked = false
      })
      _resourceDatePlanVOS = props.weekList.resourceDatePlanVOS.filter(el => el.dateNo !== date)
    }
    props.weekList.resourceDatePlanVOS = _resourceDatePlanVOS
    updateTableData(props.weekList)

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
            <div style={{ marginTop: "6px" }}>
              <TimePicker
                format={timeFormat}
                className={'start-time-picker'}
                minuteStep={15}
                value={moment(timeRange[0], timeFormat)}
                onChange={(time, timeStr) => { timeChange(timeStr, 'start', weekList.sort, idx) }}
                allowClear={false}
              />
              <span>-</span>
              <TimePicker
                format={timeFormat}
                className={'end-time-picker'}
                minuteStep={15}
                value={moment(timeRange[1], timeFormat)}
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
            value={moment(singleTime[0], timeFormat)}
            onChange={(time, timeStr) => { timeChange(timeStr, 'start', weekList.sort, -1) }}
            allowClear={false}
          />
          <span>-</span>
          <TimePicker
            format={timeFormat}
            className={'end-time-picker'}
            minuteStep={15}
            value={moment(singleTime[1], timeFormat)}
            onChange={(time, timeStr) => { timeChange(timeStr, 'end', weekList.sort, -1) }}
            allowClear={false}
          />
          <Icon type="plus-square" onClick={handleAddTime} />
        </div>
      )
    }
  }


  const handleTimeFormat = (timeSlot, type) => {
    let formatTime = ''
    if (timeSlot.includes('|')) {
      let times = timeSlot.split('|');
      let _time = times.map(item => item.split('-'))
    } else {
      let singleTime = timeSlot.split('-')
      type === 'start' ? formatTime = singleTime[0] : formatTime = singleTime[1]
    }
    return formatTime
  }

  const handleCheckedDaysFormat = (data, day) => {
    let dates = []
    data.map(item => dates.push(item?.dateNo))
    return dates.includes(day) ? true : false
  }

  function changeTime(newTime) {
    const newOpenDateItem = { ...props.openDate, times: newTime };
    props.editOpenTable(newOpenDateItem);
  }

  // 根据接口返回的数据遍历出选中的日期，设置选中的复选框
  const handlePlanDatesChecked = (daysList) => {
    daysList.dates?.map(dateItem => {
      props.weekList.resourceDatePlanVOS?.map(planItem => {
        if (dateItem.date === planItem.dateNo) {
          dateItem.dateChecked = true
        }
        // else {
        //   dateItem.dateChecked = false
        // }
      })
    })

    return (
      <>
        {daysList.dates.map((dateItem, idx) =>
          <td>
            <Checkbox
              key={idx}
              // disabled={props.allSelectWeeks.includes(day) && !props.openDate.weeks.includes(day)}
              // onChange={(e) => dayCheck(e, dateItem.date, dateItem.sort)}
              onChange={(e) => dateCheck(e, dateItem.date, daysList, dateItem.dateChecked)}
              //  checked={handleCheckedDaysFormat(item.resourceDatePlanVOS,day)}
              checked={dateItem.dateChecked}
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
                onClick={() =>deleteLinePlanList(props.weekList.sort)}
              ></a>
            </td>
          </tr>
        </tbody>
      </table>

    </>
  );
};

export default SetDayTable;
