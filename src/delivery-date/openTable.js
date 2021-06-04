import React, { useEffect, useState } from 'react';
import { Checkbox, TimePicker, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const format = 'HH:mm';
const openTable = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Monday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Tuesday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Wednesday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Thursday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Friday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Saturday" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.Sunday" />
          </th>
          <th style={{ width: '28%' }}>
            <FormattedMessage id="Setting.timeSolt" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.opertaor" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Checkbox value={1}></Checkbox>
          </td>
          <td>
            <Checkbox value={2}></Checkbox>
          </td>
          <td>
            <Checkbox value={3}></Checkbox>
          </td>
          <td>
            <Checkbox value={4}></Checkbox>
          </td>
          <td>
            <Checkbox value={5}></Checkbox>
          </td>
          <td>
            <Checkbox value={6}></Checkbox>
          </td>
          <td>
            <Checkbox value={7}></Checkbox>
          </td>
          <td>
            {props.openDate.times.map((time, index) => (
              <>
                <TimePicker format={format} value={moment(time.startTime, format)} />
                <span>-</span>
                <TimePicker format={format} value={moment(time.endTime, format)} />
                <Icon type="plus-square" />
              </>
            ))}
          </td>
          <td>
            <a type="link" className="iconfont iconDelete" onClick={()=> props.deleteOpenTable(props.openDate.sort)}></a>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default openTable;
