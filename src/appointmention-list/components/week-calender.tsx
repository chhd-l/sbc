

import React, { Component } from 'react'
import moment from 'moment'
import { Button, Icon } from 'antd'
import './index.less';
class WeekCalender extends Component {
    index: number
    constructor(props) {
        super(props)
        this.index = -1;
    }
    state = {
        weekDate: []
    }
    componentDidMount() {
        this.getCurrentWeek()
    }
    getCurrentWeek = (date = undefined) => {
        let weekOfDay: any = moment(date).format("E") // 指定日期的周的第几天
        let weekDate = []
        for (let i = 1; i <= 7; i++) {
            let _date = moment(date).subtract(weekOfDay - i, 'days');
            weekDate.push({
                weekDay: _date.format('dddd'),
                date: _date.format('YYYY-MM-DD')
            })
        }
        this.setState({ weekDate })
    }
    lastWeek = () => {
        if (this.index === -1) return
        this.index++;
        const cc = this.getWeek();
        this.getCurrentWeek(cc[0])
    }

    nextWeek = () => {
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
    render() {
        const { weekDate } = this.state;
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
                            <li key={index}>
                                <Button style={{ marginTop: 5 }}>09:00</Button>
                                <Button style={{ marginTop: 5 }}>09:15</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                                <Button style={{ marginTop: 5 }}>09:30</Button>
                            </li>))
                        }

                    </ul>
                </div>
            </div>
        )
    }

}
export default WeekCalender