import React, { useEffect, useState } from 'react';
import { DatePicker, Button, Input, Row, Col, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, history } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';
import _ from 'lodash';
import './index.less';

const { Option } = Select;
// const currentDate = sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date();
const currentDate = new Date();
const currentDateFormat = moment(currentDate).format('YYYYMMDD');

const dayOrWeek = [{
  label: 'Day',
  value: '1',
}
  // , {
  //   label: 'Week',
  //   value: '2',
  // }
]

// {
//   employeeId: "ieif78943NR438F",
//   employeeName: "Join",
//   bookedTimeSlot: [
//     {
//       dateNo: "20210101",
//       startTime: "20210101 10:00",
//       endTime: "20210101 11:30",
//       bookType: "0"
//     },
//     {
//       dateNo: "20210101",
//       startTime: "20210101 13:30",
//       endTime: "20210101 14:45",
//       bookType: "1"
//     },
//   ]
// },

const Schedular = () => {
  const [dayPlanList, setDayPlanList] = useState([])
  const [timeRange] = useState([{
    hour: "09",
  }, {
    hour: "10",
  }, {
    hour: "11",
  }, {
    hour: "12",
  }, {
    hour: "13",
  }, {
    hour: "14",
  }, {
    hour: "15",
  }, {
    hour: "16",
  }, {
    hour: "17",
  }]) //时间段的数据暂未定。
  const [timePeriod, setTimePeriod] = useState([])
  const [tableData, setTableData] = useState([])
  const [allEmployeePersonList, setAllEmployeePersonList] = useState([])
  const [allEmployeeIds, setAllEmployeeIds] = useState([])
  const [selectPerson, setSelectPerson] = useState('')
  const [listParams, setListParams] = useState({
    dateNo: currentDateFormat,
    employeeIds: []
  })


  useEffect(() => {
    getAllEmployeePerson()
  }, [])

  // 获取所有人
  const getAllEmployeePerson = async () => {
    const { res } = await webapi.AllEmployeePerson()
    const _allEmployeePersonList = res.context?.employeeVOList;
    // 不能选择all 暂时不要该代码
    // const allPersonEmployeeIds = _allEmployeePersonList.map(item => {
    //   let employees = {
    //     employeeId: item.employeeId,
    //     employeeName: item.employeeName
    //   }
    //   return employees
    // })

    console.log(_allEmployeePersonList,'_allEmployeePersonList')
    setAllEmployeePersonList(_allEmployeePersonList)
    _allEmployeePersonList.length ? setSelectPerson(_allEmployeePersonList[0].employeeId) : null
    // setAllEmployeeIds(allPersonEmployeeIds)
    let params = Object.assign(listParams, {
      employeeIds: [{
        employeeId: _allEmployeePersonList[0].employeeId,
        employeeName: _allEmployeePersonList[0].employeeName
      }]
    })
    getCalendarByDay(params)
  }

  // 获取列表数据
  const getCalendarByDay = async (params) => {
    const { res } = await webapi.calendarByDay(params)
    let list = res.context.calendarByDayVOList || []
    setDayPlanList(list)
    bookedDataFormat(list)
  }

  // 组装页面表格所需的数据结构
  const bookedDataFormat = async (list) => {
    const allTimeArr = await intervals("20210101 09:00", "20210101 17:00");//todo:等确认起始值
    setTimePeriod(allTimeArr)
    console.log(allTimeArr, 'all000')
    let bookedTypeAllList = Promise.all(list.map(async (el) =>
      el.bookedTimeSlot.map(item => {
        let _itemBookedTypeList = []
        intervals(item.startTime, item.endTime).then((specificTime) => {
          specificTime.map((el, idx) => {
            idx !== specificTime.length - 1 && _itemBookedTypeList.push({
              time: el,
              bookType: item.bookType === 1 ? `Blocked ${el}-${specificTime[idx + 1]}` : `Appointed ${el}-${specificTime[idx + 1]}`
            })
          })
        })
        return _itemBookedTypeList
      }
      )
    ))

    bookedTypeAllList.then((list) => {
      let _bookedList = list.map(item => _.flatten(item))
      let allTimeBookedList = _bookedList.map((el) =>
        allTimeArr.map(_time => {
          let item = { time: _time, bookType: '' }
          item.bookType = el.find(_el => _el.time === _time)?.bookType
          return item
        })
      )
      setTableData(allTimeBookedList)
    })
  }

  // 选择人名，组装接口所需参数
  const changePersonName = (value, option) => {
    let employeeIds = [{
      employeeId: value,
      employeeName: option.props.children
    }]
    if (value === 'All') {
      employeeIds = allEmployeeIds
    }
    let params = Object.assign(listParams, {
      employeeIds
    })
    setSelectPerson(value)
    setListParams(params)
    getCalendarByDay(params)
  }

  // 每15分钟为一个间隔的时间数组
  const intervals = async (startString, endString) => {
    return await new Promise(reslove => {
      let start = moment(startString, 'YYYYMMDD HH:mm');
      let end = moment(endString, 'YYYYMMDD HH:mm');
      start.minutes(Math.ceil(start.minutes() / 15) * 15);
      let result = [];
      let current = moment(start);
      while (current <= end) {
        result.push(current.format('HH:mm'));
        current.add(15, 'minutes');
      }
      reslove(result);
    })
  }

  // table每列宽度
  const rowWidth = (tableData) => {
    if (!tableData.length) return;
    let width = '100%';
    switch (tableData.length) {
      case 1:
        width = "100%";
        break;
      case 2:
        width = "50%";
        break;
      case 3:
        width = "33.33%";
        break;
      case 4:
        width = "25%";
        break;
      case 5:
        width = "20%";
        break;
      default:
        width = "180px";
        break;
    }
    return width
  }

  // 切换日期
  const handleDateChange = (date) => {
    const dateNo = moment(date).format('YYYYMMDD')
    let params = Object.assign(listParams, {
      dateNo
    })
    setListParams(params)
    getCalendarByDay(params)
  }

  // 跳转到list
  const goViewList = () =>{
    history.push("/resources-planning")
  }
  console.log(dayPlanList,'dddalist')

  return (
    <>
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.schedular" />} />
        <Row>
          <Col span={6}>
            <DatePicker
              defaultValue={moment(currentDate)}
              format="dddd, MMMM Do YYYY"
              className="width-full"
              onChange={(date) => handleDateChange(date)}
            />
          </Col>
          <Col span={4} offset={1}>
            {/* <Select
              className="width-full"
            onChange={switchDayOrWeek}
            >
              {dayOrWeek.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
            </Select> */}
            <Input className="width-full" disabled value="Day" />
          </Col>
          <Col span={6} offset={1}>
            <Select
              className="width-full"
              onChange={changePersonName}
              value={selectPerson}
            >
              {/* {allEmployeePersonList.length ? <Option value={"All"}>All</Option> : null} */}
              {allEmployeePersonList.map(item => <Option key={item.employeeId} value={item.employeeId}>{item.employeeName}</Option>)}
            </Select>
          </Col>
          <Col span={2} offset={4}>
            <Button type="primary" onClick={goViewList}>
              <FormattedMessage id="Resources.list_view" />
            </Button>
          </Col>
        </Row>
      </div>
      <div className="container">
        <div className="booked-table-container">
          <ul className="person-wrap">
            <li className="blank-space"></li>
            {dayPlanList.map(person => <li style={{ width: rowWidth(tableData) }} className="person-name">{person.employeeName}</li>)}
          </ul>
          <div className="schedular-time-table">
            <div>
              {timeRange.map((el, idx) =>
                <div key={idx} className='time-planning-wrap'>
                  {idx !== timeRange.length - 1 && <>
                    <div className="time-hour"><span>{el.hour}</span></div>
                    <ul className="time-minute">
                      <li><span>00</span></li>
                      <li><span>15</span></li>
                      <li><span>30</span></li>
                      <li><span>45</span></li>
                    </ul>
                  </>}
                </div>
              )}
            </div>
            <Row className="booked-type-wrap">
              {tableData.map((el, idx) =>
                <Col style={{ width: rowWidth(tableData) }} className="item-person-booked">
                  {el.map((_el, _idx) =>
                    <div key={_idx} style={{ width: tableData.length > 5 ? "180px" : "100%" }} className={`${_el.bookType?.includes("Blocked") ? "block-item" : ""} ${_el.bookType?.includes("Appointed") ? "appointed-item" : ""} planning-content`}>
                      <span className={`each-duration`}>
                        <span>
                          {_el.bookType}
                        </span>
                      </span>
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default Schedular