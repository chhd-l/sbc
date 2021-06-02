import React, { useEffect, useState } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import * as webapi from './webapi';
import { Form, Input, Select, Row, Col, Checkbox, Button, Radio, TimePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import './style.less';
import moment from 'moment';

const format = 'HH:mm';
const Option = Select.Option;

const index = () => {
  const [deliveryForm, setDeliveryFrom] = useState({ homeDelivery: 1 });
  const [cities, setCities] = useState([
    { name: 'Mecio', value: 'Mecio' },
    { name: 'Mecio City', value: 'Mecio City' }
  ]);
  const [days] = useState([1, 2, 3, 4, 5]);
  useEffect(() => {
    webapi.GetShipSettingList().then((data) => {});
  }, []);
  function handleChange(name, value) {
    const data = deliveryForm;
    data[name] = value;
    setDeliveryFrom(data);
    console.log(deliveryForm);
  }
  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Setting.orderDeliveryDateSettings" />} />
      </div>
      <div className="container" id="deliveryDateSettings" style={{ height: '100vh', background: '#fff' }}>
        <Row>
          <Col span={4}>
            <p>
              <FormattedMessage id="Setting.allowDeliveryOption" /> :
            </p>
          </Col>
          <Col span={20}>
            <Radio value={deliveryForm.homeDelivery} onChange={(e) => handleChange('homeDelivery', e.target.value)}>
              {<FormattedMessage id="Setting.homeDelivery" />}
            </Radio>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <p className="center">
              <FormattedMessage id="Setting.openCityCondition" /> :
            </p>
          </Col>
          <Col span={6}>
            <Select mode="multiple" style={{ width: '100%' }} value={deliveryForm.openCityCondition} onChange={(value) => handleChange('openCityCondition', value)}>
              {cities.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <p className="center">
              <FormattedMessage id="Setting.theRangeOfDaysForDelivery" /> :
            </p>
          </Col>
          <Col span={3}>
            <Select style={{ width: 128 }} value={deliveryForm.theRangeOfDaysForDelivery} onChange={(value) => handleChange('theRangeOfDaysForDelivery', value)}>
              {days.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={2}>
            <p className="center">
              <FormattedMessage id="task.Days" />
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <p className="center">
              <FormattedMessage id="Setting.cutOffTimesOfOneDayDelivery" /> :
            </p>
          </Col>
          <Col span={3}>
            <TimePicker format={format} defaultOpenValue={moment('00:00', format)} onChange={(time, timeString) => handleChange('cutOffTimesOfOneDayDelivery', timeString)}></TimePicker>
          </Col>
          <Col span={2}>
            <p className="center">
              <FormattedMessage id="Setting.before" />
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <p className="center">
              <FormattedMessage id="Setting.openingHours" />
            </p>
          </Col>
          <Col span={2}>
            <Button type="primary">
              <FormattedMessage id="Setting.add" />
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default index;
