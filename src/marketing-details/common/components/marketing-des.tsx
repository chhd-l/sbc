import * as React from 'react';
import { Row, Col } from 'antd';

import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Const } from 'qmkit';

import styled from 'styled-components';

const GreyBg = styled.div`
  margin-bottom: -15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

const MAK_TYPE = {
  0: '满减',
  1: '满折',
  2: '满赠'
};

const SUB_TYPE = {
  0: '满金额减',
  1: '满数量减',
  2: '满金额折',
  3: '满数量折',
  4: '满金额赠',
  5: '满数量赠'
};

@withRouter
@Relax
export default class MarketingDes extends React.Component<any, any> {
  props: {
    relaxProps?: {
      marketingName: any;
      beginTime: any;
      endTime: any;
      marketingType: any;
      subType: any;
    };
  };

  static relaxProps = {
    marketingName: 'marketingName',
    beginTime: 'beginTime',
    endTime: 'endTime',
    marketingType: 'marketingType',
    subType: 'subType'
  };

  render() {
    const {
      marketingName,
      beginTime,
      endTime,
      marketingType,
      subType
    } = this.props.relaxProps;
    return (
      <GreyBg>
        <Row>
          <Col span={24}>
            <span>促销名称：</span>
            {marketingName}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>起止时间：</span>
            {moment(beginTime)
              .format(Const.TIME_FORMAT)
              .toString()}{' '}
            ~{' '}
            {moment(endTime)
              .format(Const.TIME_FORMAT)
              .toString()}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>{MAK_TYPE[marketingType]}类型：</span>
            {SUB_TYPE[subType]}
          </Col>
        </Row>
      </GreyBg>
    );
  }
}
