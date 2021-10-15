import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, DatePicker, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, cache } from 'qmkit';
import moment from 'moment';
import ServiceSetting from '../component/service-setting'
import './index.less'

const { Option } = Select;
const FormItem = Form.Item;

const currentDate = sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date();
const styles = {
  planningBtn: {
    marginRight: 12
  }
};

const optionTest = [{
  label: 'Day',
  value: '1',
}, {
  label: 'Week',
  value: '2',
}]

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
  const changePersonName = (value) => {
    console.log(value, 'value==')
  }
  return (
    <>
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.schedular" />} />
        <Row>
          <Col span={5}>
            <DatePicker
              defaultValue={moment(currentDate)}
              format="dddd, MMMM Do YYYY"
              className="width-full" />
          </Col>
          <Col span={4} offset={2}>
            <Select
              className="width-full"
            // onChange={day}
            >
              {optionTest.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
            </Select>
          </Col>
          <Col span={5} offset={2}>
            <Select
              className="width-full"
              onChange={changePersonName}
            >
              {_optionTest.map(item => <Option key={item.value}>{item.label}</Option>)}
            </Select>
          </Col>
          <Col span={2} offset={4}>
            <Button type="primary">
              {/* <FormattedMessage id="Resources.list_view" /> */}
              <FormattedMessage id="Resources.list_view" />
            </Button>
          </Col>
        </Row>
        {/* <div className="container"> */}
        {/* <Table columns={columns}
        className="schedular-time-table"
        dataSource={tabData}
        pagination={false}
        bordered /> */}
        {/* </div> */}
      </div>
      <div className="container">
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
      </div>
    </>
  )
}

export default Schedular