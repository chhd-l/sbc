import React from 'react';

import { Relax } from 'plume2';
import { Row, Col, Spin } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import CouponList from './coupon-list';

const GreyBg = styled.div`
  color: #333333;
  margin-left: -28px;
  span {
    width: 130px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@Relax
export default class ActivityInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      activityInfo: IMap;
      loading: boolean;
    };
  };

  static relaxProps = {
    activityInfo: 'activityInfo',
    loading: 'loading'
  };

  render() {
    const { activityInfo, loading } = this.props.relaxProps;
    const customerLevelList = activityInfo.get('customerLevelList');
    const customerDetailVOS = activityInfo.get('customerDetailVOS');
    const couponActivity = activityInfo.get('couponActivity');
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>Activiy name：</span>
              {couponActivity.get('activityName')}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {couponActivity.get('couponActivityType') == 1 ? <span>Issuance time：</span> : <span>Activity time：</span>}
              {couponActivity.get('couponActivityType') == 1
                ? moment(couponActivity.get('startTime')).format(Const.TIME_FORMAT).toString()
                : moment(couponActivity.get('startTime')).format(Const.TIME_FORMAT).toString() + ' ~ ' + moment(couponActivity.get('endTime')).format(Const.TIME_FORMAT).toString()}
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <span>Coupon：</span>
            </Col>
          </Row>
        </GreyBg>
        <CouponList />
        <GreyBg>
          {couponActivity.get('couponActivityType') != 1 && (
            <Row>
              <Col span={24}>
                <span>{couponActivity.get('couponActivityType') == 2 ? 'Total number of coupons：' : 'Maximum number of times per person：'}</span>
                {couponActivity.get('receiveType') == '0' ? 'Unlimited' : couponActivity.get('receiveCount') + 'group'}
              </Col>
            </Row>
          )}
        </GreyBg>
        <GreyBg>
          {couponActivity.get('couponActivityType') != 2 && (
            <Row>
              <Col span={24}>
                {couponActivity.get('joinLevel') != -2 && (
                  <div>
                    <span>Target customers：</span>
                    {couponActivity.get('joinLevel') == -1 ? 'All platform' : this._showLevel(couponActivity.get('joinLevel'), customerLevelList)}
                  </div>
                )}

                {!loading && couponActivity.get('joinLevel') == -2 && customerDetailVOS && (
                  <div>
                    <span style={styles.lableSpan}>Target customers：</span>
                    <div style={styles.lableBox}>
                      {customerDetailVOS.toJS().map((record) => {
                        return <span style={styles.item}>{record.customerAccount}</span>;
                      })}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </GreyBg>
      </div>
    );
  }

  /**
   *展示等级
   */
  _showLevel(text, customerLevelList) {
    if (null == text) {
      return '';
    } else if (-2 == text) {
      return '';
    } else if (-1 == text) {
      return 'All platform';
    } else if (0 == text) {
      return 'All levels';
    } else {
      let str = '';
      text.split(',').forEach((item) => {
        const level = customerLevelList.find((i) => i.get('customerLevelId') == item);
        if (level) {
          str += level.get('customerLevelName') + '，';
        }
      });
      str = str.substring(0, str.length - 1);
      if (str == '') {
        str = '-';
      }
      return str;
    }
  }
}
const styles = {
  title: {
    background: '#f7f7f7',
    height: 32,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  } as any,
  box: {
    paddingTop: 4,
    paddingBottom: 0
  },
  item: {
    textAlign: 'left'
  },
  lableSpan: {
    verticalAlign: 'top'
  },
  lableBox: {
    width: 'calc(100% - 130px)',
    display: 'inline-block'
  }
};
