import React, { useEffect, useState } from 'react';
import {
  Input,
  Modal,
  Table,
  Form,
  DatePicker,
  Popconfirm,
  Icon,
  Divider, message,
  Row, Col, Button, Select,TimePicker,
  Checkbox
} from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, RCi18n, SelectGroup, cache } from 'qmkit';
import SetDayTable from '../set-day-table';

import './index.less'

const format = 'HH:mm';
const { Option } = Select;
const FormItem = Form.Item;
const ServiceSetting = (props) => {

  const [deliveryForm, setDeliveryForm] = useState({
    deliveryOption: 1,
    city: [],
    rangeDays: 5,
    cutOffTime: null,
    openDate: [
      {
        weeks: [],
        times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }],
        sort: 1
      }
    ],
    closeDate: [
      {
        closeDay: null,
        sort: 1
      }
    ]
  })
  const handleAddSetting = () =>{
  }
  return (
    <div>
    <Row>
      <Col span={8}>
        <SelectGroup
          allowClear
          // getPopupContainer={() => document.getElementById('page-content')}
          // style={styles.wrapper}
          label={
            <p className="service-type-label">
              <FormattedMessage id="Resources.service_type" />
            </p>
          }
          // showSearch
          optionFilterProp="children"
        // onChange={(value) => {
        //   onFormFieldChange({ key: 'brandId', value });
        // }}
        >
          <Option value='all'>all</Option>
        </SelectGroup>
      </Col>
    </Row>
    <Row className="set-by-day-title">
      <Col span={3}>
        <p>
          <FormattedMessage id="Resources.set_by_day" />
        </p>
      </Col>
      <Col span={2}>
        <Button type="primary" onClick={handleAddSetting}>
          <FormattedMessage id="Setting.add" />
        </Button>
      </Col>
    </Row>
    {deliveryForm.openDate.map((item, index) => (
        <SetDayTable
          // allSelectWeeks={allSelectWeeks}
          openDate={item}
          key={index}
          // editOpenTable={editOpenTable}
          // deleteOpenTable={deleteOpenTable}
        />
      ))}
  </div>
  );
};

export default ServiceSetting;
