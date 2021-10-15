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
  Row, Col, Button, Select, TimePicker,
  Checkbox
} from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, RCi18n, SelectGroup, cache } from 'qmkit';
import SetDayTable from '../set-day-table';

import './index.less'

const ServiceTypeOptionsMock = [{
  value: 'all',
  label: 'all',
}, {
  value: '1',
  label: 'a',
}, {
  value: '2',
  label: 'b',
},]
const format = 'HH:mm';
const { Option } = Select;
const FormItem = Form.Item;
const ServiceSetting = ({ addCounts }) => {

  const [showAddBtn, setShowAddBtn] = useState(false)
  const [settingCounts, setSettingCounts] = useState(addCounts)

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
  const AddSetByDay = () => {
    
  }

  // serviceType下拉选择
  const handleServiceType = (value) => {
    console.log(value, 'ServiceTypeValue')
    // todo:下拉码值value:all需根据接口更改
    if (value !== 'all') {
      setShowAddBtn(true)
    } else {
      setShowAddBtn(false)
    setSettingCounts([1])
    }
  }

  // 新增服务类型和setDay
  const addServiceType = () => {
    let counts = [].concat(settingCounts);
    counts.push(1)
    setSettingCounts(counts)
  }
  return (
    <div>
      {settingCounts.map((item, idx) =>
        <div className="setting-outside-warp" key={idx}>
          <Row>
            <Col span={8} >
              <SelectGroup
                allowClear
                label={
                  <p className="service-type-label">
                    <FormattedMessage id="Resources.service_type" />
                  </p>
                }
                onChange={handleServiceType}
              >
                {ServiceTypeOptionsMock.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </SelectGroup>
            </Col>
            {showAddBtn && idx===0 ? <Col span={2} offset={1}>
              <Button type="primary" onClick={addServiceType}>
                <FormattedMessage id="Setting.add" />
              </Button>
            </Col> : null}
          </Row>
          <Row className="set-by-day-title">
            <Col span={3} >
              <p>
                <FormattedMessage id="Resources.set_by_day" />
              </p>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={AddSetByDay}>
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
      )}

    </div>
  );
};

export default ServiceSetting;
