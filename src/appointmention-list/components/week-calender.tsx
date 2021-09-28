

import React, { Component } from 'react'
import moment from 'moment'
import { Icon } from 'antd'

const weekTitle = ['日', '一', '二', '三', '四', '五', '六']
import './index.less';
class WeekCalender extends Component {

    constructor(props) {
        super(props)
        this.state = {
            date: new Date()
        }
    }

    _onPress(date) {
        this.setState({
            date
        })
    }
    getCurrentWeek=()=>{
        const start=moment().weekday(1).format('YYYY-MM-DD')
        const end=moment().weekday(7).format('YYYY-MM-DD');
        return [start,end]
    }
    lastWeek = () => {

    }

    nextWeek = () => {

    }

    render() {

        return (
            <>
                <div className="week-head">
                    <div className="week-head-left"><Icon type="left" /></div>
                    <div className="week-head-content" style={{ flex: 1 }}>
                        <ul>
                            <li>周日</li>
                            <li>周一</li>
                            <li>周二</li>
                            <li>周三</li>
                            <li>周四</li>
                            <li>周五</li>
                            <li>周六</li>
                        </ul>
                    </div>
                    <div className="week-head-right"><Icon type="right" /></div>
                </div>
                <div className="week-content">

                </div>
            </>
        )
    }

}
export default WeekCalender