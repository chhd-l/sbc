import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import './index.less'

const format = 'HH:mm';
const SetDayTable = (props) => {
  const [allWeeks] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

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
  function timeChange(isStartTime, timeString, sort) {
    var newTime = [];
    props.openDate.times.map((item) => {
      if (item.sort === sort) {
        newTime.push({
          startTime: isStartTime ? timeString : item.startTime,
          endTime: !isStartTime ? timeString : item.endTime,
          sort: item.sort
        });
      } else {
        newTime.push(item);
      }
    });
    changeTime(newTime);
  }

  function changeTime(newTime) {
    const newOpenDateItem = { ...props.openDate, times: newTime };
    props.editOpenTable(newOpenDateItem);
  }
  let columnData = [
    {
      title: '9.26',
      dataIndex: '9.26',
      key: '9.26',
    }, {
      title: '9.27',
      dataIndex: '9.27',
      key: '9.27',
    }, {
      title: '9.28',
      dataIndex: '9.28',
      key: '9.28'
    }, {
      title: '9.29',
      dataIndex: '9.29',
      key: '9.29'
    }, {
      title: '10.01',
      dataIndex: '10.01',
      key: '10.01'
    }, {
      title: '10.02',
      dataIndex: '10.02',
      key: '10.02'
    }, {
      title: '10.03',
      dataIndex: '10.03',
      key: '10.03'
    }, {
      title: '10.04',
      dataIndex: '10.04',
      key: '10.04'
    }, {
      title: '10.05',
      dataIndex: '10.05',
      key: '10.05'
    }, {
      title: '10.06',
      dataIndex: '10.06',
      key: '10.06'
    }, {
      title: '10.06',
      dataIndex: '10.06',
      key: '10.06'
    }, {
      title: '10.07',
      dataIndex: '10.07',
      key: '10.07'
    }, , {
      title: '10.08',
      dataIndex: '10.08',
      key: '10.08'
    }, , {
      title: '10.09',
      dataIndex: '10.09',
      key: '10.09'
    },
  ];

  return (
    <table className="set-day-table">
      <thead>
        <tr>
          {columnData.map(item =>
            <th style={{ width: '4.5%' }}>
            {item.title}
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
          {allWeeks.map((day) => (
            <td>
              <Checkbox
                key={day}
                // disabled={props.allSelectWeeks.includes(day) && !props.openDate.weeks.includes(day)}
                onChange={(e) => weekCheck(e, day)}
                // checked={props.openDate.weeks.includes(day)}
              ></Checkbox>
            </td>
          ))}
          <td style={{ paddingTop: 0 }}>
            {props.openDate.times.map((time, index) => (
              <div key={index} className="time">
                <TimePicker
                  format={format}
                  value={moment(time.startTime, format)}
                  onChange={(timeObject, timeString) => timeChange(true, timeString, time.sort)}
                  allowClear={false}
                />
                <span>-</span>
                <TimePicker
                  format={format}
                  value={moment(time.endTime, format)}
                  onChange={(timeObject, timeString) => timeChange(false, timeString, time.sort)}
                  allowClear={false}
                />
                <Icon type="plus-square" onClick={() => addTime()} />
                {props.openDate.times.length > 1 ? (
                  <Icon type="minus-square" onClick={() => deleteTime(time.sort)} />
                ) : null}
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
  );
};

export default SetDayTable;
