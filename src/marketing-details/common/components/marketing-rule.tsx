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
    width: 200px;
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
          <div key={Math.random()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <span>
                    <FormattedMessage id="Marketing.Rules" />:
                  </span>
                  {subType === 0 ? ( // full amount reduction
                    <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} reduction {level.reduction} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </span>
                  ) : subType === 1 ? ( // full quantity reduction
                    <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items reduction {level.reduction} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </span>
                  ) : subType === 2 ? ( //full amount discount
                    <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} discount {level.discount * 10} discount
                    </span>
                  ) : subType === 3 ? ( //full quantity discount
                    <span className="rule-span">
                      <FormattedMessage id="Marketing.Full" /> {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items discount {level.discount * 10} discount
                    </span>
                  ) : subType === 6 ? ( // subsctiption reduction
                    <div className="rule-span">
                      <div>
                        <FormattedMessage id="Marketing.SubscriptionOrderReduction" />
                        {level.firstSubscriptionOrderReduction} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      </div>
                      <div>
                        <FormattedMessage id="Marketing.Fortherestsubscriptionorderreduction" />
                        {level.restSubscriptionOrderReduction} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      </div>
                    </div>
                  ) : subType === 7 ? ( // subsctiption discount
                    <div className="rule-span">
                      <div>
                        <FormattedMessage id="Marketing.theFirstSubscriptionOrder" />
                        {level.firstSubscriptionOrderDiscount * 10} <FormattedMessage id="Marketing.discount" />
                      </div>
                      <div>
                        <FormattedMessage id="Marketing.Fortherestsubscriptionorder" /> {level.restSubscriptionOrderDiscount * 10} <FormattedMessage id="Marketing.discount" />
                      </div>
                    </div>
                  ) : null}
                </Col>
              </Row>
            </GreyBg>
          </div>
        ))}
      </div>
    );
  }
}
