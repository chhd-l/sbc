import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const format = 'HH:mm';
const openTable = (props) => {
  const [allWeeks] = useState([1, 2, 3, 4, 5, 6, 7]);

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

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Monday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Tuesday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Wednesday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Thursday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Friday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Saturday" />
          </th>
          <th style={{ width: '8%' }}>
            <FormattedMessage id="Setting.Sunday" />
          </th>
          <th style={{ width: '35%' }}>
            <FormattedMessage id="Setting.timeSolt" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.opertaor" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {allWeeks.map((day) => (
            <td>
              <Checkbox
                key={day}
                disabled={props.allSelectWeeks.includes(day) && !props.openDate.weeks.includes(day)}
                onChange={(e) => weekCheck(e, day)}
                checked={props.openDate.weeks.includes(day)}
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
                />
                <span>-</span>
                <TimePicker
                  format={format}
                  value={moment(time.endTime, format)}
                  onChange={(timeObject, timeString) => timeChange(false, timeString, time.sort)}
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

export default openTable;
