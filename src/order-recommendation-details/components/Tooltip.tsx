import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';
import '../style.less';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { WMChart } from 'biz';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      PeriodAmountTotal: any;
    };
    settleId: number;
  };

  constructor(props) {
    super(props);
  }

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop
  };

  render() {
    return <div className="chart space-between">1111111111111111111</div>;
  }
}
