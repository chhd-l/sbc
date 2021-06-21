import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const closeTable = (props) => {
  function dateChange(timeString) {
    var newCloseDay = { ...props.closeDate, closeDay: timeString };
    props.editCloseTable(newCloseDay);
  }

  function disabledDate(current) {
    return current && props.allSelectDays.includes(moment(current).format("YYYY-MM-DD"));
  }
  
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '91%' }}>
            <FormattedMessage id="Setting.selectDay" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Delete" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <DatePicker
              onChange={(time, timeString) => dateChange(timeString)}
              value={
                props.closeDate && props.closeDate.closeDay
                  ? moment(props.closeDate.closeDay)
                  : null
              }
              disabledDate={disabledDate}
            />
          </td>
          <td>
            <a
              type="link"
              className="iconfont iconDelete"
              onClick={() => props.deleteCloseTable(props.closeDate.sort)}
            ></a>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default closeTable;
