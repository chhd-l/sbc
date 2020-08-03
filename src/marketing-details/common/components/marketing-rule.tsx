import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';

import styled from 'styled-components';

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
    const {
      fullReductionLevelList,
      fullDiscountLevelList,
      subType,
      marketingType
    } = this.props.relaxProps;
    debugger;
    const list =
      marketingType == 1 ? fullDiscountLevelList : fullReductionLevelList;
    return (
      <div>
        {list.toJS().map((level) => (
          <div key={Math.random()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <span>Rules:</span>
                  {subType === 0 ? ( // full amount reduction
                    <span className="rule-span">
                      Full{' '}
                      {level.fullAmount ? level.fullAmount : level.fullCount}{' '}
                      yuan reduction {level.reduction} yuan
                    </span>
                  ) : subType === 1 ? ( // full quantity reduction
                    <span className="rule-span">
                      Full{' '}
                      {level.fullAmount ? level.fullAmount : level.fullCount}{' '}
                      items reduction {level.reduction} yuan
                    </span>
                  ) : subType === 2 ? ( //full amount discount
                    <span className="rule-span">
                      Full{' '}
                      {level.fullAmount ? level.fullAmount : level.fullCount}{' '}
                      yuan discount {level.discount * 10} discount
                    </span>
                  ) : subType === 3 ? ( //full quantity discount
                    <span className="rule-span">
                      Full{' '}
                      {level.fullAmount ? level.fullAmount : level.fullCount}{' '}
                      items discount {level.discount * 10} discount
                    </span>
                  ) : subType === 6 ? ( // subsctiption reduction
                    <span className="rule-span">
                      For the first subscription order, reduction{' '}
                      {level.reduction} yuan
                    </span>
                  ) : subType === 7 ? ( // subsctiption discount
                    <span className="rule-span">
                      For the first subscription order, discount{' '}
                      {level.discount * 10} discount
                    </span>
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
