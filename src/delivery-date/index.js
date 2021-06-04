import React, { useEffect, useState } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import * as webapi from './webapi';
import { Select, Row, Col, Button, Radio, TimePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import './style.less';
import OpenTable from './openTable';
import CloseTable from './closeTable';
import moment from 'moment';

const format = 'HH:mm';
const Option = Select.Option;

const index = () => {
  const [deliveryForm, setDeliveryFrom] = useState({
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
  });
  const [cities, setCities] = useState(deliveryForm.city);
  const [days] = useState([1, 2, 3, 4, 5]);
  const [allSelectWeeks, setAllSelectWeeks] = useState([]);

  useEffect(() => {
    console.log(deliveryForm);
  }, [deliveryForm]);

  useEffect(() => {
    let newSelectWeeks = [];
    deliveryForm.openDate.map((item) => {
      newSelectWeeks.push(...item.weeks);
    });
    setAllSelectWeeks(newSelectWeeks);
  }, [deliveryForm.openDate]);

  function getAllCities(isOpen) {
    if (isOpen) {
      webapi.GetAllCities().then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          const allCities = res.context.systemRegions.map((x) => {
            return {
              cityNo: x.regionFias,
              cityName: x.regionName
            };
          });
          setCities(allCities);
        }
      });
    }
  }

  function cityChange(cityNos) {
    const selectCities = cityNos.map((no) => {
      const city = cities.find((x) => x.cityNo === no);
      return {
        cityNo: no,
        cityName: city ? city.cityName : ''
      };
    });
    handleChange('city', selectCities);
  }

  function addOpenTable() {
    const maxSort = Math.max(...deliveryForm.openDate.map((x) => [x.sort]));
    const newOpenDate = [
      ...deliveryForm.openDate,
      {
        weeks: [],
        times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }],
        sort: maxSort + 1
      }
    ];
    handleChange('openDate', newOpenDate);
  }

  function deleteOpenTable(sort) {
    const newOpenDate = [];
    deliveryForm.openDate
      .sort((a, b) => a.sort - b.sort)
      .map((item) => {
        if (item.sort !== sort) {
          newOpenDate.push(item);
        }
      });
    handleChange('openDate', newOpenDate);
  }

  function editOpenTable(openTableItem) {
    const newOpenDate = [];
    deliveryForm.openDate.map((item) => {
      if (item.sort === openTableItem.sort) {
        newOpenDate.push(openTableItem);
      } else {
        newOpenDate.push(item);
      }
    });
    handleChange('openDate', newOpenDate);
  }

  function addCloseTable() {
    const maxSort = Math.max(...deliveryForm.closeDate.map((x) => [x.sort]));
    const newCloseDate = [
      ...deliveryForm.closeDate,
      {
        closeDay: null,
        sort: maxSort + 1
      }
    ];
    handleChange('closeDate', newCloseDate);
  }

  function deleteCloseTable(sort) {
    const newCloseDate = [];
    deliveryForm.closeDate
      .sort((a, b) => a.sort - b.sort)
      .map((item) => {
        if (item.sort !== sort) {
          newCloseDate.push(item);
        }
      });
    handleChange('closeDate', newCloseDate);
  }

  function handleChange(name, value) {
    setDeliveryFrom({ ...deliveryForm, [name]: value });
  }
  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Setting.orderDeliveryDateSettings" />} />
      </div>
      <div
        className="container"
        id="deliveryDateSettings"
        style={{ height: '100vh', background: '#fff' }}
      >
        <Row>
          <Col span={4}>
            <p>
              <FormattedMessage id="Setting.allowDeliveryOption" /> :
            </p>
          </Col>
          <Col span={20}>
            <Radio
              value={deliveryForm.deliveryOption}
              onChange={(e) => handleChange('deliveryOption', e.target.value)}
            >
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
            <Select
              onDropdownVisibleChange={(isOpen) => getAllCities(isOpen)}
              mode="multiple"
              style={{ width: '100%' }}
              value={deliveryForm.city.map((x) => x.cityNo)}
              onChange={(value) => cityChange(value)}
            >
              {cities.map((item) => (
                <Option value={item.cityNo} key={item.cityNo}>
                  {item.cityName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {/* <Row>
          <Col span={5}>
            <p className="center">
              <FormattedMessage id="Setting.theRangeOfDaysForDelivery" /> :
            </p>
          </Col>
          <Col span={3}>
            <Select style={{ width: 128 }} value={deliveryForm.rangeDays} onChange={(value) => handleChange('rangeDays', value)}>
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
        </Row> */}
        <Row>
          <Col span={5}>
            <p className="center">
              <FormattedMessage id="Setting.cutOffTimesOfOneDayDelivery" /> :
            </p>
          </Col>
          <Col span={3}>
            <TimePicker
              format={format}
              value={deliveryForm.cutOffTime ? moment(deliveryForm.cutOffTime, format) : null}
              onChange={(time, timeString) => handleChange('cutOffTime', timeString)}
            ></TimePicker>
          </Col>
          <Col span={2}>
            <p className="center">
              <FormattedMessage id="Setting.before" />
            </p>
          </Col>
        </Row>
        <Row style={{ marginBottom: 0 }}>
          <Col span={3}>
            <p className="center">
              <FormattedMessage id="Setting.openingHours" />
            </p>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={() => addOpenTable()}>
              <FormattedMessage id="Setting.add" />
            </Button>
          </Col>
        </Row>
        <Row>
          {deliveryForm.openDate.map((item, index) => (
            <OpenTable
              allSelectWeeks={allSelectWeeks}
              openDate={item}
              key={index}
              editOpenTable={editOpenTable}
              deleteOpenTable={deleteOpenTable}
            />
          ))}
        </Row>
        <Row style={{ marginBottom: 0 }}>
          <Col span={3}>
            <p className="center">
              <FormattedMessage id="Setting.closedHours" />
            </p>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={() => addCloseTable()}>
              <FormattedMessage id="Setting.add" />
            </Button>
          </Col>
        </Row>
        <Row>
          {deliveryForm.closeDate.map((item, index) => (
            <CloseTable
              closeDate={item}
              key={index}
              handleChange={handleChange}
              deleteCloseTable={deleteCloseTable}
            />
          ))}
        </Row>
      </div>
    </div>
  );
};

export default index;
