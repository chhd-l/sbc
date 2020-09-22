import React from 'react';
import { IMap, Relax } from 'plume2';
import { Icon, Modal, Checkbox } from 'antd';
import { fromJS } from 'immutable';

import { history, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import Funnel from 'web_modules/biz/funnel/index.tsx';
@Relax
export default class TodoItems extends React.Component<any, any> {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  props: {
    relaxProps?: {
      tradeTodo: IMap;
    };
  };
  static relaxProps = {
    tradeTodo: 'tradeTodo'
  };

  render() {
    return (
      <div className="item">
        <div className="item-top space-between">
          <div className="item-top-l flex-content">
            <div className="item-top-l-top">
              <div className="top-text">Overview</div>
              <div className="content space-between">
                <div className="mode">
                  <div className="mode-text">Revenue</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <span>↘</span>
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Average basket</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <span>↘</span>
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Conversion</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <span>↘</span>
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Traffic</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <span>↘</span>
                    <span>32%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-l-btm">
              <div className="top-text">Conversion Funnel</div>
              <div className="Funnel">
                <Funnel />
              </div>
            </div>
          </div>
          <div className="item-top-m flex-content">
            <div className="item-top-m-top">
              <div className="top-text space-between">
                <span>Traffic</span>
                <span>more></span>
              </div>
              <div className="traffic space-between">
                <div className="traffic-l">
                  <img
                    width="40"
                    height="40"
                    src="data:image/png;base64,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"
                    alt=""
                  />
                </div>
                <div className="traffic-r flex-content">
                  <div className="traffic-r-top space-between">
                    <div className="mode">
                      <div className="mode-text">Traffic</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                      <div className="mode-per">
                        <span>↘</span>
                        <span>32%</span>
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="mode">
                      <div className="mode-text">Traffic</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                      <div className="mode-per">
                        <span>↘</span>
                        <span>32%</span>
                      </div>
                    </div>
                  </div>
                  <div className="traffic-r-btm flex-content">
                    <div className="mode">
                      <div className="mode-text">Traffic</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="mode">
                      <div className="mode-text">Traffic</div>
                      <div className="mode-num num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-m-btm">
              <div className="top-text space-between">
                <span>Transaction</span>
                <span>more></span>
              </div>
              <div className="transaction">

              </div>
            </div>
          </div>
          <div className="item-top-r flex-content">
            <div className="item-top-r-top">
              <div className="top-text">Consumer</div>
            </div>
            <div className="item-top-r-btm">
              <div className="top-text">Subscription</div>
            </div>
          </div>
        </div>
        <div className="item-mid">1111111111111111111</div>
        <div className="item-btm">1111111111111111111</div>
      </div>
    );
  }
}
