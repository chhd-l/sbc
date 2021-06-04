import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const closeTable = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '91%' }}>
            <FormattedMessage id="Setting.selectDay" />
          </th>
          <th style={{ width: '9%' }}>
            <FormattedMessage id="Setting.opertaor" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <DatePicker value={props.closeDate && props.closeDate.closeDay ? moment(props.closeDate.closeDay) : null} />
          </td>
          <td>
            <a type="link" className="iconfont iconDelete" onClick={() => props.deleteCloseTable(props.closeDate.sort)}></a>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default closeTable;
