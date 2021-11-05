import React, { useEffect, useState } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import * as webapi from './webapi';
import { editDeliveryOption } from '../shipping-fee-setting/webapi';
import { Select, Row, Col, Button, Switch, Radio, TimePicker, Spin, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import './style.less';
import OpenTable from './openTable';
import CloseTable from './closeTable';
import moment from 'moment';

const format = 'HH:mm';
const Option = Select.Option;

const index = () => {
  const [loading, setLoading] = useState(false);
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
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [days] = useState([1, 2, 3, 4, 5]);
  const [allSelectWeeks, setAllSelectWeeks] = useState([]);
  const [allSelectDays, setAllSelectDays] = useState([]);
  const [cityOk, setCityOk] = useState(true);
  const [cutTimeOk, setCutTimeOk] = useState(true);

  const [dateSwitch, setDateSwitch] = useState(false);
  const [deliverDateStatus, setDeliverDateStatus] = useState(0);
  const [deliverDateId, setDeliverDateId] = useState(0);

  useEffect(() => {
    setLoading(true);
    webapi
      .GetDelivery()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          if (res.context && res.context.id && res.context.openDate) {
            if (!res.context.closeDate) {
              res.context.closeDate = [];
            }
            setDeliveryFrom(res.context);
          }
          // deliveryDate 状态
          if (res?.context?.systemConfigVO) {
            let scon = res.context.systemConfigVO;
            setDeliverDateId(scon.id);
            setDeliverDateStatus(scon.status);
            setDateSwitch(scon.status === 1 ? true : false);
          }
          setCities(res.context.city);
          setLoading(false);
        } else {
          message.error(res.message || window.RCi18n({ id: 'Public.GetDataFailed' }));
          setLoading(false);
        }
      })
      .catch(() => {
        message.error(window.RCi18n({ id: 'Public.GetDataFailed' }));
        setLoading(false);
      });
    webapi
      .getDeliveryOptions()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          setDeliveryOptions(res.context.sysDictionaryVOS);
        } else {
          message.error(res.message || window.RCi18n({ id: 'Public.GetDataFailed' }));
        }
      })
      .catch(() => {
        message.error(window.RCi18n({ id: 'Public.GetDataFailed' }));
      });
  }, [dateSwitch]);

  useEffect(() => {
    let newSelectWeeks = [];
    deliveryForm.openDate.map((item) => {
      newSelectWeeks.push(...item.weeks);
    });
    setAllSelectWeeks(newSelectWeeks);
  }, [deliveryForm.openDate]);

  useEffect(() => {
    let newSelectDays = deliveryForm.closeDate.map((item) => item.closeDay);
    setAllSelectDays(newSelectDays);
  }, [deliveryForm.closeDate]);

  useEffect(() => {
    setCityOk(deliveryForm.city && deliveryForm.city.length > 0);
  }, [deliveryForm.city]);

  useEffect(() => {
    setCutTimeOk(!!deliveryForm.cutOffTime);
  }, [deliveryForm.cutOffTime]);

  function getAllCities(isOpen) {
    if (isOpen) {
      setCityLoading(true);
      webapi
        .GetAllCities()
        .then((data) => {
          const res = data.res;
          if (res.code === Const.SUCCESS_CODE) {
            const allCities = res.context.systemRegions.map((x) => {
              return {
                cityNo: x.regionFias,
                cityName: x.regionName
              };
            });
            setCities(allCities);
            setCityLoading(false);
          } else {
            message.error(res.message || window.RCi18n({ id: 'Public.GetDataFailed' }));
            setCityLoading(false);
          }
        })
        .catch(() => {
          message.error(window.RCi18n({ id: 'Public.GetDataFailed' }));
          setCityLoading(false);
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
    const maxSort =
      deliveryForm.openDate && deliveryForm.openDate.length > 0
        ? Math.max(...deliveryForm.openDate.map((x) => [x.sort]))
        : 0;
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
    const maxSort =
      deliveryForm.closeDate && deliveryForm.closeDate.length > 0
        ? Math.max(...deliveryForm.closeDate.map((x) => [x.sort]))
        : 0;
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

  function editCloseTable(closeTableItem) {
    const newCloseDate = [];
    deliveryForm.closeDate.map((item) => {
      if (item.sort === closeTableItem.sort) {
        newCloseDate.push(closeTableItem);
      } else {
        newCloseDate.push(item);
      }
    });
    handleChange('closeDate', newCloseDate);
  }

  function handleChange(name, value) {
    setDeliveryFrom({ ...deliveryForm, [name]: value });
  }

  function SaveDeliveryDate() {
    if (allSelectWeeks.length === 0) {
      message.info(window.RCi18n({ id: 'Setting.mustSelectOneOpenDay' }));
      return;
    }
    setLoading(true);
    webapi
      .SaveDeliveryDate(deliveryForm)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(window.RCi18n({ id: 'Content.OperateSuccessfully' }));
          setLoading(false);
        } else {
          message.error(res.message || window.RCi18n({ id: 'Order.UpdateFailed' }));
          setLoading(false);
        }
      })
      .catch(() => {
        message.error(window.RCi18n({ id: 'Order.UpdateFailed' }));
        setLoading(false);
      });
  }

  function onChangeField(checked) {
    editDeliveryOption(deliverDateId, checked ? 1 : 0)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          console.log('666 >>> checked: ', checked);
          setDateSwitch(checked);
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  };

  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Setting.orderDeliveryDateSettings" />} />
      </div>
      <Spin
        spinning={loading}
      >
        <div
          className="container setting_delivery_date"
          id="deliveryDateSettings"
          style={{ minHeight: '100vh', background: '#fff' }}
        >
          <Row>
            <Col span={4}>
              <p>
                <FormattedMessage id="Setting.enableDeliveryDate" /> :
              </p>
            </Col>
            <Col span={4}>
              <Switch checked={deliverDateStatus == 1 ? true : false} onChange={(checked) => onChangeField(checked)} />
            </Col>
          </Row>

          {deliverDateStatus == 1 ? (
            <>
              <Row>
                <Col span={4}>
                  <p>
                    <FormattedMessage id="Setting.allowDeliveryOption" /> :
                  </p>
                </Col>
                <Col span={20}>
                  <Radio.Group
                    value={
                      deliveryOptions && deliveryOptions.length > 0 ? deliveryOptions[0].valueEn : null
                    }
                    onChange={(e) => handleChange('deliveryOption', e.target.value)}
                  >
                    {deliveryOptions.map((item, index) => (
                      <Radio key={index} value={item.valueEn}>
                        {item.name}
                      </Radio>
                    ))}
                  </Radio.Group>
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
                    loading={cityLoading}
                    onDropdownVisibleChange={(isOpen) => getAllCities(isOpen)}
                    mode="multiple"
                    style={{ width: '100%' }}
                    value={deliveryForm.city.map((x) => x.cityNo)}
                    onChange={(value) => cityChange(value)}
                    className={!cityOk ? 'input-error' : ''}
                  >
                    {cities &&
                      cities.map((item) => (
                        <Option value={item.cityNo} key={item.cityNo}>
                          {item.cityName}
                        </Option>
                      ))}
                  </Select>
                  {!cityOk ? (
                    <div className="error">
                      <FormattedMessage id="Setting.pleaseSelectCity" />
                    </div>
                  ) : null}
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
                    className={!cutTimeOk ? 'input-error' : ''}
                    style={{ width: '100%' }}
                    format={format}
                    value={deliveryForm.cutOffTime ? moment(deliveryForm.cutOffTime, format) : null}
                    onChange={(time, timeString) => handleChange('cutOffTime', timeString)}
                  ></TimePicker>
                  {!cutTimeOk ? (
                    <div className="error">
                      <FormattedMessage id="Setting.pleaseSelectTime" />
                    </div>
                  ) : null}
                </Col>
                <Col span={2} style={{ marginLeft: 20 }}>
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
                  <Button
                    type="primary"
                    onClick={() => addOpenTable()}
                    disabled={allSelectWeeks.length === 7}
                  >
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
                    allSelectDays={allSelectDays}
                    closeDate={item}
                    key={index}
                    editCloseTable={editCloseTable}
                    deleteCloseTable={deleteCloseTable}
                  />
                ))}
              </Row>
              <Row>
                <Button
                  type="primary"
                  onClick={() => SaveDeliveryDate()}
                  disabled={!(cityOk && cutTimeOk)}
                >
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </>
          ) : null}

        </div>
      </Spin>
    </div>
  );
};

export default index;
