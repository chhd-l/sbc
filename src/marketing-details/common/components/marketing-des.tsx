import * as React from 'react';
import { Row, Col, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import moment from 'moment';
import { cache, Const, RCi18n } from 'qmkit';
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
  1: 'Full discount',
  // 2: '满赠'
  3: 'Free shipping'
};

const SUB_TYPE = {
  0: 'Full amount reduction',
  1: 'Full quantity reduction',
  2: 'Full amount discount',
  3: 'Full quantity discount',
  4: 'Full amount gift',
  5: 'Full quantity gift',
  10: 'Order reach',
  11: 'Order reach',
};
const PROMOTION_TYPE = {
  0:  RCi18n({
    id: 'Marketing.All'
  }),
  1:  RCi18n({
    id: 'Marketing.Autoship'
  }),
  2:
    RCi18n({
      id: 'Marketing.Club'
    }),
  3: RCi18n({
    id: 'Marketing.Singlepurchase'
  })
}
@withRouter
@Relax
class MarketingDes extends React.Component<any, any> {
  props: {
    intl;
    relaxProps?: {
      promotionType: any;
      marketingName: any;
      publicStatus: any;
      beginTime: any;
      endTime: any;
      marketingType: any;
      subType: any;
      promotionCode: any;
      marketingFreeShippingLevel: any;
      isSuperimposeSubscription: any;
    };
  };

  static relaxProps = {
    promotionType: 'promotionType',
    marketingName: 'marketingName',
    isSuperimposeSubscription: 'isSuperimposeSubscription',
    beginTime: 'beginTime',
    endTime: 'endTime',
    marketingType: 'marketingType',
    subType: 'subType',
    promotionCode: 'promotionCode',
    publicStatus: 'publicStatus',
    marketingFreeShippingLevel: 'marketingFreeShippingLevel'
  };

  render() {
    const { promotionType, marketingName, beginTime, endTime, marketingType, subType, promotionCode, publicStatus, marketingFreeShippingLevel, isSuperimposeSubscription } = this.props.relaxProps;
    return (
      <GreyBg>
        <Row>
          <Col span={4}>
            <span>
              <FormattedMessage id="Marketing.PromotionType" />:
            </span>
          </Col>
          <Col span={18}>
            {
              PROMOTION_TYPE[promotionType]
            }
            {
              promotionType === 0 && marketingType !==2 &&
              <Checkbox className="publicBox" style={{ marginLeft: 20 }} checked={isSuperimposeSubscription === 0} disabled={true}>
                <div className="Idontwanttocumulate">
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </div>
              </Checkbox>
            }
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <span>
              <FormattedMessage id="Marketing.PromotionName" />:
            </span>
          </Col>
          <Col span={18}>
            {marketingName}
          </Col>
        </Row>

        <Row>
          <Col span={4}>
            <span>
              <FormattedMessage id="Marketing.PromotionCode" />:
            </span>
          </Col>
          <Col span={18}>
            {promotionCode}
            <Checkbox className="publicBox" style={{ marginLeft: 20 }} checked={publicStatus === '1'} disabled={true}>
              <FormattedMessage id="Marketing.Public" />
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <span>
              <FormattedMessage id="Marketing.StartAndEndTime" />:
            </span>
          </Col>
          <Col span={18}>
            {moment(beginTime).format(Const.TIME_FORMAT).toString()} ~ {moment(endTime).format(Const.TIME_FORMAT).toString()}
          </Col>
        </Row>
        {subType === 6 || subType === 7 ? null : (
          <Row>
            <Col span={4}>
              <span>
                {MAK_TYPE[marketingType]}
                <FormattedMessage id="Marketing.Type" />:
              </span>
            </Col>
            <Col span={18}>
              {SUB_TYPE[subType]}&nbsp;&nbsp;
              {marketingType === 3 && marketingFreeShippingLevel  ?
                <>
                  {
                    subType === 10 ?
                      marketingFreeShippingLevel.toJS().fullAmount:
                      marketingFreeShippingLevel.toJS().fullCount
                  }
                  &nbsp;&nbsp;
                  {
                    subType === 10 ?
                      sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)  :
                      (window as any).RCi18n({
                        id: 'Marketing.items'
                      })
                  }
                </>
               : null
              }
            </Col>
          </Row>
        )}
      </GreyBg>
    );
  }
}

export default injectIntl(MarketingDes)
