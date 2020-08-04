import * as React from 'react';
import { Row, Col, Checkbox } from 'antd';

import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Const } from 'qmkit';
import '../../index.css';
import styled from 'styled-components';

const GreyBg = styled.div`
  margin-bottom: -15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 200px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 20px 0 0;
  }
`;

const MAK_TYPE = {
  0: 'Full reduction',
  1: 'Full discount'
  // 2: '满赠'
};

const SUB_TYPE = {
  0: 'Full amount reduction',
  1: 'Full quantity reduction',
  2: 'Full amount discount',
  3: 'Full quantity discount'
  // 4: '满金额赠',
  // 5: '满数量赠'
};

@withRouter
@Relax
export default class MarketingDes extends React.Component<any, any> {
  props: {
    relaxProps?: {
      marketingName: any;
      publicStatus: any;
      beginTime: any;
      endTime: any;
      marketingType: any;
      subType: any;
      promotionCode: any;
    };
  };

  static relaxProps = {
    marketingName: 'marketingName',
    beginTime: 'beginTime',
    endTime: 'endTime',
    marketingType: 'marketingType',
    subType: 'subType',
    promotionCode: 'promotionCode',
    publicStatus: 'publicStatus'
  };

  render() {
    const {
      marketingName,
      beginTime,
      endTime,
      marketingType,
      subType,
      promotionCode,
      publicStatus
    } = this.props.relaxProps;
    return (
      <GreyBg>
        <Row>
          <Col span={24}>
            <span>Promotion Name:</span>
            {marketingName}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>Promotion Code:</span>
            {promotionCode}
            <Checkbox
              className="publicBox"
              style={{ marginLeft: 20 }}
              checked={publicStatus === '1'}
              disabled={true}
            >
              Public
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>Start and end Time:</span>
            {moment(beginTime).format(Const.TIME_FORMAT).toString()} ~{' '}
            {moment(endTime).format(Const.TIME_FORMAT).toString()}
          </Col>
        </Row>
        {subType === 6 || subType === 7 ? null : (
          <Row>
            <Col span={24}>
              <span>{MAK_TYPE[marketingType]}Type:</span>
              {SUB_TYPE[subType]}
            </Col>
          </Row>
        )}
      </GreyBg>
    );
  }
}
