import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, DatePicker, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, cache } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';
import ServiceSetting from '../component/service-setting'
import './index.less'
import { ellipse } from '_@antv_x6@1.26.2@@antv/x6/lib/registry/port-layout/ellipse';

const { Option } = Select;
const FormItem = Form.Item;

const currentDate = sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date();
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
      }
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
  useEffect(() => {

    bookedDataFormat()

  }, [])

  const bookedDataFormat = () => {

    dayPlanList.calendarByDayVOList.map(el => el.bookedTimeSlot.map(item => {
      intervals(item.startTime, item.endTime).then((specificTime) => {
        console.log(specificTime, item, 'rrree==00')
    let bookedTypeList = []
    specificTime.map((el,idx) =>{
      idx !== specificTime.length -1  && bookedTypeList.push({
        time:el,
        bookType: item.bookType === '1' ? `Blocked ${el}-${specificTime[idx+1]}` : `Appointed ${el}-${specificTime[idx+1]}`
      })
    })
    console.log(bookedTypeList,'bookedTypeList==')
      })
    }
    )
    )
  }

  const getCalendarByDay = async () => {
    const params = {
      dateNo: "",
      employeeIds: []
    }
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
        {!showAllPerson ? <div className="schedular-time-table">
          {timeRange.map((el, idx) =>
            <div key={idx} className='time-planning-wrap'>
              <div className="time-hour"><span>{el.hour}</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              {/* <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li className="appointed-item">
                  <span> Appointed 11:45-12:00</span>
                </li>
              </ul> */}
            </div>
          )}
        </div>
          :
          <div className="schedular-time-table">
            <div className='time-planning-wrap'>
              <div className="time-hour"><span>11</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li className="appointed-item">
                  <span> Appointed 11:45-12:00</span>
                </li>
              </ul>
            </div>
            <div className='time-planning-wrap'>
              {/* <div></div> */}
              <div className="time-hour"><span>12</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li> </li>
              </ul>
            </div>
            <div className='time-planning-wrap'>
              <div className="time-hour"><span>13</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li></li>
              </ul>
            </div>
            <div className='time-planning-wrap'>
              <div className="time-hour"><span>14</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li></li>
              </ul>
            </div>
            <div className='time-planning-wrap'>
              <div className="time-hour"><span>15</span></div>
              <ul className="time-minute">
                <li><span>00</span></li>
                <li><span>15</span></li>
                <li><span>30</span></li>
                <li><span>45</span></li>
              </ul>
              <ul className="planning-content">
                <li> </li>
                <li> </li>
                <li className="block-item">
                  <span>Blocked 11:30-11:45</span>
                </li>
                <li></li>
              </ul>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Schedular