import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax, IMap } from 'plume2';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { List } from 'immutable';
import { FormattedMessage, injectIntl } from 'react-intl';
type TList = List<IMap>;

const GreyBg = styled.div`
  padding: 15px 0;
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
export default class Bottom extends React.Component<any, any> {
  props: {
    relaxProps?: {
      joinLevel: any;
      customerLevels: TList;
      emailSuffixList: any;
      currentGroup: any;
    };
  };

  static relaxProps = {
    joinLevel: 'joinLevel',
    customerLevels: ['customerLevels'],
    emailSuffixList: 'emailSuffixList',
    currentGroup: 'currentGroup'
  };

  render() {
    const { joinLevel, customerLevels, emailSuffixList, currentGroup } = this.props.relaxProps;
    // let levelName = '';
    // if (joinLevel == '-1') {
    //   levelName = 'Full platform consumer';
    // } else if (joinLevel == '0') {
    //   levelName = 'All Leave';
    // } else if (joinLevel != '') {
    //   levelName = joinLevel
    //     .split(',')
    //     .map((info) => customerLevels.filter((v) => v.get('customerLevelId') == info).getIn([0, 'customerLevelName']))
    //     .filter((v) => v)
    //     .join('，');
    // }
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={6}>
              <span >
                <FormattedMessage id="Marketing.TargetConsumer" />:
              </span>
            </Col>
            <Col span={18}>
              {
                joinLevel == -1 ?
                  <span className="left-span"><FormattedMessage id="Marketing.all" /></span> : joinLevel == -3 ?
                  <span className="left-span">{currentGroup && currentGroup.get('name')}</span>
                  : joinLevel == -4 ?
                    <span className="left-span">
                      {emailSuffixList && emailSuffixList.toJS()[0]}
                    </span>: null
              }
            </Col>
          </Row>
        </GreyBg>
      </div>
    );
  }
}
