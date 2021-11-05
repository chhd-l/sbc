import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, DatePicker, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, cache } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';
import _ from 'lodash';
import './index.less';

const { Option } = Select;
// const currentDate = sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date();
const currentDate = new Date();
const dayOrWeek = [{
  label: 'Day',
  value: '1',
}
  // , {
  //   label: 'Week',
  //   value: '2',
  // }
]

const _optionTest = [{
  label: 'all',
  value: '1',
}, {
  label: 'John',
  value: '2',
}]

const columns = [{
  title: 'hour',
  dataIndex: 'hour',
  key: 'hour',
  width: 40,
  render: (text, row, index) => {
    console.log(index, text, 'ddddodi')
    if (index === 0 || index === 4 || index === 8 || index === 12 || index === 16 || index === 20 || index === 24) {
      console.log(text, 'ttttt')
      return {
        children: text,
        props: {
          rowSpan: 4,
        },
      }
    } else {
      return {
        props: {
          rowSpan: 0,
        },
      };
    }
  },
}, {
  title: 'minute',
  dataIndex: 'minute',
  key: 'minute',
  width: 40,
}, {
  title: 'task',
  dataIndex: 'task',
  key: 'task',
}]


const Schedular = () => {
  const [showAllPerson, setShowAllPerson] = useState(false)
  const [dayPlanList, setDayPlanList] = useState({
    calendarByDayVOList: [
      {
        employeeId: "ieif78943NR438F",
        employeeName: "Join",
        bookedTimeSlot: [
          {
            dateNo: "20210101",
            startTime: "20210101 10:00",
            endTime: "20210101 11:30",
            bookType: "0"
          },
          {
            dateNo: "20210101",
            startTime: "20210101 13:30",
            endTime: "20210101 14:45",
            bookType: "1"
          },
        ]
      },
      {
        employeeId: "uduw985jn4ij4udnrb",
        employeeName: "Tom",
        bookedTimeSlot: [
          {
            dateNo: "20210101",
            startTime: "20210101 9:00",
            endTime: "20210101 9:30",
            bookType: "1"
          },
          {
            dateNo: "20210101",
            startTime: "20210101 16:30",
            endTime: "20210101 17:00",
            bookType: "0"
          },
        ]
      },
      {
        employeeId: "uduw985jn4ij4udnrb",
        employeeName: "Tom",
        bookedTimeSlot: [
          {
            dateNo: "20210101",
            startTime: "20210101 9:00",
            endTime: "20210101 9:30",
            bookType: "1"
          },
          {
            dateNo: "20210101",
            startTime: "20210101 16:30",
            endTime: "20210101 17:00",
            bookType: "0"
          },
        ]
      },
      {
        employeeId: "uduw985jn4ij4udnrb",
        employeeName: "Tom",
        bookedTimeSlot: [
          {
            dateNo: "20210101",
            startTime: "20210101 9:00",
            endTime: "20210101 9:30",
            bookType: "1"
          },
          {
            dateNo: "20210101",
            startTime: "20210101 16:30",
            endTime: "20210101 17:00",
            bookType: "0"
          },
        ]
      },
      {
        employeeId: "uduw985jn4ij4udnrb",
        employeeName: "Tom",
        bookedTimeSlot: [
          {
            dateNo: "20210101",
            startTime: "20210101 9:00",
            endTime: "20210101 9:30",
            bookType: "1"
          },
          {
            dateNo: "20210101",
            startTime: "20210101 16:30",
            endTime: "20210101 17:00",
            bookType: "0"
          },
        ]
      },

    ]
  })
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
  }]) //时间段的数据暂未定，目前写死。等ba
  const [timePeriod,setTimePeriod] = useState([])
  const [bookedTypeList, setBookedTypeList] = useState([])
  const [tableData, setTableData] = useState([])
  useEffect(() => {

    getAllEmployeePerson()

    const current = moment(currentDate).format('YYYYMMDD')
    let params = {
      dateNo: current,
      employeeIds: [
        {
          employeeId: "2c918085762bc87901762d88fb110010",
          employeeName: "mingjuan tang"
        }
      ]
    }
    getCalendarByDay(params)

    bookedDataFormat()
  }, [])

  // 获取所有人
  const getAllEmployeePerson = async () => {
    const { res } = await webapi.AllEmployeePerson()
    // const AllEmployeePersonList = res;
    console.log(res, 'ress=f-')
  }
  // 组装页面表格所需的数据结构
  const bookedDataFormat = async () => {
    const allTimeArr = await intervals("20210101 09:00", "20210101 17:00");
    setTimePeriod(allTimeArr)
    console.log(allTimeArr, 'all000')
    let bookedTypeAllList = Promise.all(dayPlanList.calendarByDayVOList.map(async (el) =>
      el.bookedTimeSlot.map(item => {
        let _itemBookedTypeList = []
        intervals(item.startTime, item.endTime).then((specificTime) => {
          specificTime.map((el, idx) => {
            idx !== specificTime.length - 1 && _itemBookedTypeList.push({
              time: el,
              bookType: item.bookType === '1' ? `Blocked ${el}-${specificTime[idx + 1]}` : `Appointed ${el}-${specificTime[idx + 1]}`
            })
          })
        })
        return _itemBookedTypeList
      }
      )
    ))

    bookedTypeAllList.then((list) => {
      let _bookedList = list.map(item => _.flatten(item))
      console.log(_bookedList, '_bookedList555')
      let allTimeBookedList = _bookedList.map((el) =>
        allTimeArr.map(_time => {
          let item = { time: _time, bookType: '' }
          item.bookType = el.find(_el => _el.time === _time)?.bookType
          return item
        })
      )
      // let allTimeBookedList = allTimeArr.map(_time => {
      //   let item = { time: _time, bookType: '' }
      //   item.bookType = _bookedList[0].find(el => el.time == _time)?.bookType
      //   return item
      // })
      console.log(allTimeBookedList, 'allTimeBookedListalal')
      setTableData(allTimeBookedList)
    })
  }

  const getCalendarByDay = async (params) => {
    // const params = {
    //   dateNo: "",
    //   employeeIds: []
    // }
    const { res } = await webapi.calendarByDay(params)
    console.log(res, 'calendarbydaydaydayday')
  }
  const changePersonName = (value) => {
    console.log(value, 'value==')
  }

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

  return (
    <>
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.schedular" />} />
        <Row>
          <Col span={6}>
            <DatePicker
              defaultValue={moment(currentDate)}
              format="dddd, MMMM Do YYYY"
              className="width-full" />
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
            >
              {_optionTest.map(item => <Option key={item.value}>{item.label}</Option>)}
            </Select>
          </Col>
          <Col span={2} offset={4}>
            <Button type="primary">
              <FormattedMessage id="Resources.list_view" />
            </Button>
          </Col>
        </Row>
      </div>
      <div className="container">
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
                  <div key={_idx} className={`${_el.bookType?.includes("Blocked")?"block-item":""} ${_el.bookType?.includes("Appointed")?"appointed-item":""} planning-content`}>
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
    </>
  )
}

export default Schedular