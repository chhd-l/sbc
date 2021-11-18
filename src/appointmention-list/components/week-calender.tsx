

import React, { Component } from 'react'
import moment from 'moment'
import { Button, Icon } from 'antd'
import './index.less';
class WeekCalender extends Component {
    index: number
    props: {
        value?: any
        data: any
        onChange?: Function
    }
    constructor(props) {
        super(props)
        this.index = -1;
    }
    state = {
        weekDate: [],
        selectedIndex: ''
    }
    componentDidMount() {
        this.getCurrentWeek()
    }
    getCurrentWeek = async (date = undefined) => {
        let weekOfDay: any = moment(date).format("E") // 指定日期的周的第几天
        let weekDate = []
        let dateList = await this.getEnmbeData();
        for (let i = 0; i <7; i++) {
            let _date = moment(date).subtract(weekOfDay - i, 'days');
            let nowDate: string = moment(_date).format('YYYYMMDD');
            let currentDate = dateList[nowDate] || {};
            let list = await this.intervals(moment(_date).format('YYYYMMDD 09:00'), moment(_date).format('YYYYMMDD 22:00'), currentDate)
            weekDate.push({
                weekDay: _date.format('dddd'),
                date: _date.format('YYYY-MM-DD'),
                times: list
            })
        }
        this.setState({ weekDate })
    }
    getEnmbeData = () => {
        return new Promise((reslove) => {
            let _data = [...this.props.data];
            let _dataObj = {};
            _data.map(item => {
                _dataObj[item.date] = item;
                _dataObj[item.date]['minuteList'] = {};
                item.minuteSlotVOList.map(list => {
                    _dataObj[item.date]['minuteList'][list.startTime] = list;
                })

            })
            console.log(_dataObj, '_dataObj')
            reslove(_dataObj)
        })

    }

    lastWeek = () => {
        if (this.index === -1) return
        this.index++;
        const cc = this.getWeek();
        this.getCurrentWeek(cc[0])
    }

    nextWeek = () => {
        if (this.index === -2) return
        this.index--;
        const cc = this.getWeek();
        this.getCurrentWeek(cc[0])
    }
    getWeek = () => {
        let i = this.index;
        let begin = moment().week(moment().week() - i).startOf('week').format('YYYY-MM-DD')
        let end = moment().week(moment().week() - i).endOf('week').format('YYYY-MM-DD')
        return [begin, end]
    }
    intervals = async (startString, endString, currentDate) => {
        return new Promise(reslove => {
            let start = moment(startString, 'YYYYMMDD HH:mm');
            let end = moment(endString, 'YYYYMMDD HH:mm');
            start.minutes(Math.ceil(start.minutes() / 15) * 15);
            let result = [];
            let current = moment(start);
            while (current <= end) {
                let dateNo = current.format('YYYYMMDD')
                let cc = { disabled: true, type: 'default', dateNo, time: current.format('HH:mm') }
                if (currentDate.minuteList) {
                    let curr = currentDate.minuteList[current.format('YYYYMMDD HH:mm')];
                    if (curr) {
                        cc = { ...curr, disabled: false, time: current.format('HH:mm'), dateNo };
                    }
                }
                result.push(cc);
                current.add(15, 'minutes');
            }
            reslove(result);
        })
    }
    clickAppointItem = (item, index) => {
        this.setState({ selectedIndex: (item.dateNo + '_' + index) })
        this.props.onChange(item)
    }
    render() {
        const { weekDate, selectedIndex } = this.state;
        return (
            <div className="week-calender">
                <div className="week-head">
                    <div className="week-head-left" onClick={this.lastWeek}><Icon type="left" /></div>
                    <div className="week-head-content" style={{ flex: 1 }}>
                        <ul>
                            {weekDate.map((item, index) => {

                                return (<li key={index}>
                                    <span>{item.weekDay}</span>
                                    <span>{item.date}</span>
                                </li>)


                            })}

                        </ul>
                    </div>
                    <div className="week-head-right" onClick={this.nextWeek}><Icon type="right" /></div>
                </div>
                <div className="week-content">
                    <ul>
                        {weekDate.map((item, index) => (
                            <li key={index + 1}>
                                {item.times.map((it, idx) => (<Button onClick={() => this.clickAppointItem(it, idx)} key={it.time + 1} type={(selectedIndex === (it.dateNo + '_' + idx)) ? 'primary' : it.type} disabled={it.disabled} style={{ marginTop: 5 }}>{it.time}</Button>))}


                            </li>))
                        }

                    </ul>
                </div>
            </div>
        )
    }

}
export default WeekCalender