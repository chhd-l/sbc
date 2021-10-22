import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
const format = 'HH:mm';
const SetDayTable = (props) => {
  const { weekList, updateTableData } = props
  console.log(weekList, 'WeekList')
  const [allWeeks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const [daysList, setDaysList] = useState({
    days: [],
    dates: []
  })
  const [defaultWeekList, setDefaultWeekList] = useState(weekList)

  useEffect(() => {
    // let _date = moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date());
    let dates = allWeeks.map(item => moment(new Date()).day(item).format('YYYYMMDD'));
    let days = dates.map(item => moment(item).format('M.DD'))
    setDaysList({
      days,
      dates
    })
    weekList.map(item => Object.assign(item, {
      defaultDays: {
        days,
        dates
      }
    }))
    setDefaultWeekList(weekList)
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

  function deleteTime(sort) {
    var newTime = [];
    props.openDate.times.map((item) => {
      if (item.sort !== sort) {
        newTime.push(item);
      }
    });
    changeTime(newTime);
  }
  // const timeChange =(isStartTime, timeString, sort) =>{
  //   var newTime = [];
  //   props.openDate.times.map((item) => {
  //     if (item.sort === sort) {
  //       newTime.push({
  //         startTime: isStartTime ? timeString : item.startTime,
  //         endTime: !isStartTime ? timeString : item.endTime,
  //         sort: item.sort
  //       });
  //     } else {
  //       newTime.push(item);
  //     }
  //   });
  //   changeTime(newTime);
  // }

  function weekCheck(e, value) {
    let newWeeks = [];
    if (e.target.checked === true) {
      newWeeks = [...props.openDate.weeks, value];
    } else {
      props.openDate.weeks.map((item) => {
        if (item !== value) {
          newWeeks.push(item);
        }
      });
    }
    const newOpenDateItem = { ...props.openDate, weeks: newWeeks };
    props.editOpenTable(newOpenDateItem);
  }

  const dayCheck = (e, day, sort) => {
    let newDays = []
    if (e.target.checked === true) {
      weekList.forEach(el => {
        if (el.sort === sort) {
          newDays = [].concat(el.resourceDatePlanVOS)
          newDays.push({
            id: '',
            dateNo: day
          })
          // el.resourceDatePlanVOs.map(date => {
          //   if(date.dateNo =   )
          // })
          el.resourceDatePlanVOS = newDays
        }
      });
    }
    updateTableData(weekList)

  }

  const timeChange = (timeStr, type, sort) => {
    weekList.forEach(item => {
      if (item.sort === sort) {
        let times = item.timeSlotVO.timeSlot.split('-')
        if (type == "start") {
          let newTimeStr = `${timeStr}-${times[1]}`
          item.timeSlotVO.timeSlot = newTimeStr
        } else {
          let _newTimeStr = `${times[0]}-${timeStr}`
          item.timeSlotVO.timeSlot = _newTimeStr
        }
        // item.timeSlotVO.timeSlot:type
      }
    })
    updateTableData(weekList)
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

  return (
    <>
      <table className="set-day-table">
        <thead>
          <tr>
            {defaultWeekList.map(item => item?.defaultDays?.days.map((item, idx) =>
              <th key={idx} style={{ width: '4.5%' }}>
                {item}
              </th>
            ))}
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
            {defaultWeekList.map(item => item?.defaultDays?.dates.map((day, idx) =>
              <td>
                <Checkbox
                  key={idx}
                  // disabled={props.allSelectWeeks.includes(day) && !props.openDate.weeks.includes(day)}
                  onChange={(e) => dayCheck(e, day, item.sort)}
                 checked={handleCheckedDaysFormat(item.resourceDatePlanVOS,day)}
                ></Checkbox>
              </td>
            ))}
            <td style={{ paddingTop: 0 }}>
              {weekList.map((item, index) => (
                <div key={index} className="time">
                  <TimePicker
                    format={format}
                    className={'start-time-picker'}
                    minuteStep={15}
                    value={moment(handleTimeFormat(item.timeSlotVO.timeSlot, 'start'), format)}
                    onChange={(time, timeStr) => { timeChange(timeStr, 'start', item.sort) }}
                    // onChange={(timeObject, timeString) => timeChange(true, timeString, time.sort)}
                    allowClear={false}
                    getPopupContainer={() => document.getElementsByClassName('start-time-picker')[index]}
                  />
                  <span>-</span>
                  <TimePicker
                    format={format}
                    className={'end-time-picker'}
                    minuteStep={15}
                    value={moment(handleTimeFormat(item.timeSlotVO.timeSlot, 'end'), format)}
                    onChange={(time, timeStr) => { timeChange(timeStr, 'end', item.sort) }}
                    getPopupContainer={() => document.getElementsByClassName('end-time-picker')[index]}
                    allowClear={false}
                  />
                  <Icon type="plus-square" onClick={() => addTime()} />
                  {/* {props.openDate.times.length > 1 ? (
                  <Icon type="minus-square" onClick={() => deleteTime(time.sort)} />
                ) : null} */}
                </div>
              ))}
            </td>
            <td>
              <a
                type="link"
                className="iconfont iconDelete"
                onClick={() => props.deleteOpenTable(props.openDate.sort)}
              ></a>
            </td>
          </tr>
        </tbody>
      </table>

    </>
  );
};

export default SetDayTable;
