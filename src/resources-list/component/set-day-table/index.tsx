import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'
const timeFormat = 'HH:mm';
const SetDayTable = (props) => {
  const { weekList, updateTableData } = props
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
      date:moment(new Date()).day(item).format('YYYYMMDD')
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

  const handleAddTime=()=> {

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

  // 日期的复选框选择事件
  const dateCheck = (e, date,_daysList,dateChecked) => {
    console.log(e.target.checked, date,dateChecked,'e, date====')
    console.log(props.weekList,'dateChekckConsole')
    let _resourceDatePlanVOS = []
    props.weekList.resourceDatePlanVOS.map(item => _resourceDatePlanVOS.push({
      id:item.id,
      dateNo:item.dateNo
    }))
    console.log(_resourceDatePlanVOS,'_resourceDatePlanVOS==')
    if(e.target.checked == true) {
      _resourceDatePlanVOS.push({
        id:null,//新选择的复选框，没有id，后端建议传null
        dateNo:date
      })

    }else if(e.target.checked == false){
      // debugger
      console.log(_daysList,'_daysList_daysList')
      _daysList.dates.map(item => {
        if(item.date ==date) item.dateChecked = false
      })
      console.log(_daysList,'_daysList-_____')
      _resourceDatePlanVOS = props.weekList.resourceDatePlanVOS.filter(el => el.dateNo !== date)
      console.log(_resourceDatePlanVOS,'newCheckedData==')
      // setDaysList(Object.assign(daysList,{
      //   dates:_daysList.dates
      // }))
    }
    // let newDays = []
    // if (e.target.checked === true) {
    //   weekList.forEach(el => {
    //     if (el.sort === sort) {
    //       newDays = [].concat(el.resourceDatePlanVOS)
    //       newDays.push({
    //         id: '',
    //         dateNo: day
    //       })
    //       // el.resourceDatePlanVOs.map(date => {
    //       //   if(date.dateNo =   )
    //       // })
    //       el.resourceDatePlanVOS = newDays
    //     }
    //   });
    // }
    props.weekList.resourceDatePlanVOS = _resourceDatePlanVOS
    updateTableData(props.weekList)

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

  // 时间区间的显示处理
  const handleTimeSlotFormat = (weekList) => {
    const timeSlot = weekList.timeSlotVO.timeSlot || ''
    if (timeSlot.includes('|')) {

    } else {
      let singleTime = timeSlot.split('-');
      return (
        <TimeRangePicker TimeRange={singleTime} />
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

  const TimeComponent = ({ idx, item }) => {
    // "09:00-09:15|09:15-09:30" || 
    const timeSlot =item.timeSlotVO.timeSlot;
    let times = [timeSlot]
    if(timeSlot.includes('|')) {
       times = timeSlot.split('|');
    }
    return (
      <>
      {times.map(el =>
         <div key={idx} className="time">
         <TimePicker
           format={format}
           className={'start-time-picker'}
           minuteStep={15}
           value={moment(handleTimeFormat(el, 'start'), format)}
           onChange={(time, timeStr) => { timeChange(timeStr, 'start', item.sort) }}
           allowClear={false}
          //  getPopupContainer={() => document.getElementsByClassName('start-time-picker')[idx]}
         />
         <span>-</span>
         <TimePicker
           format={format}
           className={'end-time-picker'}
           minuteStep={15}
           value={moment(handleTimeFormat(el, 'end'), format)}
           onChange={(time, timeStr) => { timeChange(timeStr, 'end', item.sort) }}
           getPopupContainer={() => document.getElementsByClassName('end-time-picker')[idx]}
           allowClear={false}
         />
         <Icon type="plus-square" onClick={handleAddTime} />
         {times.length > 1 ? (
     <Icon type="minus-square"
      // onClick={() => deleteTime(time.sort)}
       />
   ) : null}
       </div>
        
        )}
      </>
     
    )

  }

  // 时间区间组件
  const TimeRangePicker = ({TimeRange}) => {
    // "09:00-09:15|09:15-09:30"
    return (
      <div className="time">
        <TimePicker
          format={timeFormat}
          className={'start-time-picker'}
          minuteStep={15}
          value={moment(TimeRange[0],timeFormat)}
          //  onChange={(time, timeStr) => { timeChange(timeStr, 'start', item.sort) }}
          allowClear={false}
        //  getPopupContainer={() => document.getElementsByClassName('start-time-picker')[idx]}
        />
        <span>-</span>
        <TimePicker
          format={timeFormat}
          className={'end-time-picker'}
          minuteStep={15}
          value={moment(TimeRange[1],timeFormat)}
          //  onChange={(time, timeStr) => { timeChange(timeStr, 'end', item.sort) }}
          //  getPopupContainer={() => document.getElementsByClassName('end-time-picker')[idx]}
          allowClear={false}
        />
        <Icon type="plus-square" onClick={handleAddTime} />
      </div>
    )
  }

  // 根据接口返回的数据遍历出选中的日期，设置选中的复选框
  const handlePlanDatesChecked = (daysList) => {
    daysList.dates?.map(dateItem => {
      props.weekList.resourceDatePlanVOS?.map(planItem => {
        if (dateItem.date === planItem.dateNo){
          dateItem.dateChecked = true
        } 
        // else {
        //   dateItem.dateChecked = false
        // }
      })
    })
    console.log(daysList,props.weekList.resourceDatePlanVOS,'daysList===33')

    return (
      <>
        {daysList.dates.map((dateItem, idx) =>
          <td>
            <Checkbox
              key={idx}
              // disabled={props.allSelectWeeks.includes(day) && !props.openDate.weeks.includes(day)}
              // onChange={(e) => dayCheck(e, dateItem.date, dateItem.sort)}
              onChange={(e) => dateCheck(e, dateItem.date,daysList,dateItem.dateChecked)}
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
            {daysList.days.map((day,idx) =>
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
