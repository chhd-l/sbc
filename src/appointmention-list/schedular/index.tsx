import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Button, Input, Row, Col, Select, Spin, Modal, Form, Card, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Const, Headline, history, BreadCrumb, RCi18n } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';
import _ from 'lodash';
import './index.less';
import FormSchedular from './formSchedular';
// import { findAppointmentByAppointmentNo } from '../webapi';
const { confirm } = Modal;
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
  // const [createBtn, setCreateBtn] = useState(false)
  const [visiteModel, setVisiteModel] = useState(false)
  const [currentData, setCurrentData]: any = useState({})
  const [handlerOption, setHandlerOption] = useState('')

  const [expertType, setExpertType]: any = useState({})
  const [appointmentType, setAppointmentType]: any = useState({})
  const [serviceType, setServiceType]: any = useState({})
  const [visite, setVisite]: any = useState(false)


  useEffect(() => {
    getAllEmployeePerson()
    initDict()
  }, [])

  // 获取所有人
  const getAllEmployeePerson = async () => {
    setVisite(true)
    const { res }: any = await webapi.AllEmployeePerson()
    const _allEmployeePersonList = res.context?.employeeVOList;
    const allPersonEmployeeIds = _allEmployeePersonList.map(item => {
      let employees = {
        employeeId: item.employeeId,
        employeeName: item.employeeName
      }
      return employees
    })

    setAllEmployeePersonList(_allEmployeePersonList)
    _allEmployeePersonList.length ? setSelectPerson(allPersonEmployeeIds[0].employeeId) : null
    setAllEmployeeIds(allPersonEmployeeIds)
    let params = Object.assign(listParams, {
      employeeIds: [{
        employeeId: allPersonEmployeeIds[0].employeeId,
        employeeName: allPersonEmployeeIds[0].employeeName
      }]
    })
    getCalendarByDay(params)
  }

  // 获取列表数据
  const getCalendarByDay = async (params) => {
    setVisite(true)
    const { res }: any = await webapi.calendarByDay(params)
    let list = res.context.calendarByDayVOList || []
    setDayPlanList(list)
    bookedDataFormat(list)
    setVisite(false)
  }

  // 组装页面表格所需的数据结构
  const bookedDataFormat = async (list) => {
    const allTimeArr: any = await intervals("20210101 09:00", "20210101 17:00");//todo:等确认起始值
    setTimePeriod(allTimeArr)
    let bookedTypeAllList = Promise.all(list.map(async (elx) =>
      elx.bookedTimeSlot.map(item => {
        let _itemBookedTypeList = []
        let _s = { 1: 'Blocked', 0: 'Appointed' }
        intervals(item.startTime, item.endTime).then((specificTime: any) => {
          specificTime.map((el, idx) => {
            idx !== specificTime.length - 1 && _itemBookedTypeList.push({
              time: el,
              startTime:item.startTime,
              isShow: idx === 0 ? true : false,
              allTime: _s[item.bookType] + ' ' + moment(moment(item.startTime, 'YYYY-MM-DD HH:mm')).format('HH:mm') + '-' + moment(moment(item.endTime, 'YYYY-MM-DD HH:mm')).format('HH:mm'),
              appointmentNo: item?.appointmentNo ?? null,
              id: item?.id ?? null,
              bookType: item.bookType === 1 ? `Blocked ${el}-${specificTime[idx + 1]}` : `Appointed ${el}-${specificTime[idx + 1]}`
            })
          })
        })
        return _itemBookedTypeList
      }
      )
    ))

    bookedTypeAllList.then((list) => {
      let _bookedList = list.map((item: any) => _.flatten(item))
      let allTimeBookedList = _bookedList.map((el) =>
        allTimeArr.map((_time: any) => {
          let item = { time: _time, bookType: '', }
          let _currt: any = el.find((_el: any) => _el.time === _time);
          item.bookType = _currt?.bookType ?? undefined
          return { ..._currt, ...item }
        })
      )
      console.log(allTimeBookedList, '======')
      setTableData(allTimeBookedList)
    })
  }

  // 选择人名，组装接口所需参数
  const changePersonName = (value, option) => {
    console.log(option)
    let employeeIds = [{
      employeeId: value,
      employeeName: option.props.children
    }]
    if (value === 'All') {
      // setCreateBtn(false)
      employeeIds = allEmployeeIds
    } else {
      // setCreateBtn(true)
    }
    let params = Object.assign(listParams, {
      employeeIds
    })
    console.log(value, 'params')

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
  const goViewList = () => {
    setHandlerOption('create')
    setVisiteModel(true)
    // history.push("/resources-planning")
  }

  //添加blocked
  const handleOk = async (blockSlotVO) => {
    console.log(blockSlotVO)
    let startTime = listParams.dateNo + ' ' + blockSlotVO.startTime,
      endTime = listParams.dateNo + ' ' + blockSlotVO.endTime,
      dateNo = listParams.dateNo
    let p = {
      ...blockSlotVO,
      startTime,
      endTime,
      dateNo
    }


    // currentData
    const { res } = await webapi.bookBySlot({ expertId: selectPerson, blockSlotVO: p })
    setVisiteModel(false)
    getCalendarByDay(listParams)
  }
  // 取消唐框
  const handleCancel = () => {
    setHandlerOption('')
    setVisiteModel(false)
  }
  //选择 blocked or Appointed 进行展示
  const clickSchedular = (type) => {
    if (type.bookType && type.bookType.includes('Appointed')) {
      if (!type.appointmentNo) return
      getAppointmentById(type.appointmentNo);
    } else if (type.bookType && type.bookType.includes('Blocked')) {
      let isCancel=moment(moment(type.startTime,'YYYY-MM-DD HH:mm')).diff(moment(),'minutes')
      // console.log(type,isCancel)
      if (!type.id||isCancel<=0) return
      confirm({
        okText: RCi18n({ id: 'Product.OK' }),
        cancelText: RCi18n({ id: 'Appointment.Cancel' }),
        title: RCi18n({ id: 'Appointment.confirm title' }),
        content: RCi18n({ id: 'Appointment.confirm content' }),
        onOk() {
          return new Promise(async (resolve, reject) => {
            const { res }: any = await webapi.releaseById({ id: type.id })
            if (res.code === Const.SUCCESS_CODE) {
              getCalendarByDay(listParams)
              resolve(true)
            } else {
              reject()
            }


          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() { },
      });
    }



  }
  const getAppointmentById = (id) => {
    // this.setState({ loading: true });
    webapi.findAppointmentByAppointmentNo(id)
      .then(({ res }: any) => {
        if (res.code === Const.SUCCESS_CODE) {
          // this.setState({ loading: true, ...res.context });
          let data=res?.context?.settingVO ?? {}
          let text=data?.apptTime
          if(text){
            let time= text.split('#')
            let begin=moment(moment(time[0],'YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm'),
            end=moment(moment(time[1],'YYYY-MM-DD HH:mm')).format('HH:mm');
            data.apptTime=begin+'-'+end
          }

          setCurrentData(data)
          setHandlerOption('detail')
          setVisiteModel(true)
        } else {
          // this.setState({ loading: false });
        }
      })
      .catch(() => {
        // this.setState({ loading: true });
      });
  };
  const initDict = async () => {
    const appointmentType = await webapi.getAllDict('appointment_type')
    const expertType = await webapi.getAllDict('expert_type')
    const serviceType = await webapi.getAllDict('service_type')

    setExpertType(expertType)
    setAppointmentType(appointmentType)
    setServiceType(serviceType)
  }
  const formItemLayout = {
    labelCol: {
      sm: { span: 10 },
    },
    wrapperCol: {
      sm: { span: 14 },
    },
  };
  let status = {
    "0": RCi18n({ id: 'Order.offline.booked' }),
    "1": RCi18n({ id: 'Order.offline.arrived' }),
    "2": RCi18n({ id: 'Order.offline.canceled' }),
  }
  return (
    <Spin spinning={visite}>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.schedular" />} />
        <Row>
          <Col span={7}>
            <DatePicker
              defaultValue={moment(currentDate)}
              format="dddd, MMMM Do YYYY"
              className="width-full"
              onChange={(date) => handleDateChange(date)}
            />
          </Col>
          {/* <Col span={4} offset={1}> */}
          {/* <Select
              className="width-full"
            onChange={switchDayOrWeek}
            >
              {dayOrWeek.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
            </Select> */}
          {/* <Input className="width-full" disabled value="Day" />
          </Col> */}
          <Col span={7} offset={4}>
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
              <FormattedMessage id="Appointment.Create" />
            </Button>
          </Col>
        </Row>
      </div>
      <div className="container">
        {dayPlanList.length ? <div className="booked-table-container">
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
                    <div onClick={() => clickSchedular(_el)} key={_idx} style={{ width: tableData.length > 5 ? "180px" : "100%" }} className={`${_el.isShow === false ? 'top-border-none' : ''} ${_el.isShow ? 'top-border-white' : ''}  ${_el.bookType?.includes("Blocked") ? "block-item" : ""} ${_el.bookType?.includes("Appointed") ? "appointed-item" : ""} planning-content`}>
                      <span className={`each-duration`}>
                        <span>
                          {/* {_idx===0?_el.bookType:''} */}
                          {_el.isShow ? _el.allTime : ''}
                        </span>
                      </span>
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </div>
        </div> :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }


        {visiteModel && <Modal
          title={handlerOption === 'create' ? "Employee Schedule" : 'Appointed Info'}
          visible={visiteModel}
          // onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >

          {handlerOption === 'create' && <FormSchedular dateNo={listParams.dateNo} handleSubmit={(e) => handleOk(e)} onCancel={handleCancel} />}

          {handlerOption === 'detail' && (<div className="appointmention-detail">
            <Card bordered={false}>
              <Form {...formItemLayout} labelAlign="left">
                <Form.Item label="Type">
                  Appointed
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointment.No.' })}>
                  {currentData?.apptNo ?? ''}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointmention.Type' })}>
                  {(appointmentType?.objValue ?? {})[currentData?.apptTypeId ?? '']}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointmention.Status' })}>
                  {status[currentData?.status ?? '']}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointmention.Expert.type' })}>
                  {(expertType?.objValue ?? {})[currentData?.expertTypeId ?? '']}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointmention.Expert.name' })}>
                  {currentData?.expertNames ?? ''}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointmention.Time' })}>
                  {currentData?.apptTime ?? ''}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointment.Created time' })}>
                  {currentData?.createTime ?? ''}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Appointment.Last updated time' })}>
                  {currentData?.updateTime ?? ''}
                </Form.Item>
              </Form>

            </Card>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button type="primary" onClick={handleCancel} style={{ width: 100 }}>Confirm</Button>
            </div>
          </div>)}

        </Modal>}

      </div>
    </Spin>
  )
}

export default Schedular



