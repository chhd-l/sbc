import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
import { cache } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
const GreyBg = styled.div`
  padding: 15px 0 15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: auto;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 20px 0 0;
  }
`;

@withRouter
@Relax
export default class MarketingRule extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      fullReductionLevelList: IList;
      fullDiscountLevelList: IList;
      subType: any;
      marketingType: any;
    };
  };

  static relaxProps = {
    fullReductionLevelList: 'fullReductionLevelList',
    fullDiscountLevelList: 'fullDiscountLevelList',
    subType: 'subType',
    marketingType: 'marketingType'
  };

  render() {
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType } = this.props.relaxProps;
    const list = marketingType == 1 ? fullDiscountLevelList : fullReductionLevelList;

    return (
      <div>
        {list.toJS().map((level) => (
          <div key={Math.rdmValue()}>
            <GreyBg>
              <Row>
                <Col span={6}>
                  <span style={{width:200}}>
                    <FormattedMessage id="Marketing.Rules" />:
                  </span>
                </Col>
                <Col span={18}>
                  <div>
                    {subType === 0 ? ( // full amount reduction
                      <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} reduction {level.reduction ? level.reduction : 0} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </span>
                    ) : subType === 1 ? ( // full quantity reduction
                      <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items reduction {level.reduction ? level.reduction : 0} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </span>
                    ) : subType === 2 ? ( //full amount discount
                      <div className="rule-span">
                        <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} discount {100 - (level.discount * 100)} % discount
                      </div>
                    ) : subType === 3 ? ( //full quantity discount
                      <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items discount {100 - (level.discount * 100)} % discount
                    </span>
                    ) : subType === 6 ? ( // subsctiption reduction
                      <div className="rule-span">
                        <div>
                          <FormattedMessage id="Marketing.SubscriptionOrderReduction" />
                          {level.firstSubscriptionOrderReduction || 0} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        </div>
                        <div>
                          <FormattedMessage id="Marketing.Fortherestsubscriptionorderreduction" />
                          {level.restSubscriptionOrderReduction || 0} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        </div>
                      </div>
                    ) : subType === 7 ? ( // subsctiption discount
                      <div className="rule-span">
                        <div>
                          <FormattedMessage id="Marketing.theFirstSubscriptionOrder" />
                          {100 - (level.firstSubscriptionOrderDiscount * 100)} % <FormattedMessage id="Marketing.discount" />
                          {
                            level.firstSubscriptionLimitAmount && (
                              <>
                                , discount limit {level.firstSubscriptionLimitAmount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                              </>
                            )
                          }
                        </div>
                        <div>
                          <FormattedMessage id="Marketing.Fortherestsubscriptionorder" /> {100 - (level.restSubscriptionOrderDiscount * 100)}&nbsp;% <FormattedMessage id="Marketing.discount" />
                          {
                            level.restSubscriptionLimitAmount && (
                              <>
                                , discount limit {level.restSubscriptionLimitAmount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                              </>
                            )
                          }
                        </div>
                      </div>
                    ) : null}
                    {
                      level.limitAmount &&
                      <div className="display-inline-block">,&nbsp;&nbsp;discount limit&nbsp;&nbsp;{level.limitAmount}</div>
                    }
                  </div>

                </Col>
              </Row>
            </GreyBg>
          </div>
        ))}
      </div>
    );
  }
}
