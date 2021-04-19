import React from 'react';
import { Breadcrumb, Tooltip, Icon, Input, Modal, Steps, Button, message } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history, RCi18n } from 'qmkit';
import Detail from './components/detail';
import Detail2 from './components/detail2';
import PublishButton from './components/publishButton';
import PublishTooltip from './components/publishTooltip';

import User from './components/user';

import AppStore from './store';
import './style.less';
//import { Simulate } from 'react-dom/test-utils';
//import input = Simulate.input;
//import { FormattedMessage } from 'react-intl';
//import SearchForm from './components/search-form';
//import { __DEV__ } from 'typings/global';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BillingDetails extends React.Component<any, any> {
  store: AppStore;
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      enableFlag: false
    };
  }
  componentDidMount() {
    const { state } = history.location;
    if (state) {
      this.store.init(state);
    }
    localStorage.removeItem('enable');
    localStorage.removeItem('productselect');
  }

  onInput = (e) => {
    this.store.onCreateLink({
      field: 'recommendationReasons',
      value: e.target.value
    });
  };
  next() {
    if (this.state.current == 1) {
      if (Number(localStorage.getItem('productselect')) > 0) {
        const current = this.state.current + 1;
        this.setState({ current });
      } else {
        message.error(RCi18n({id:'Order.RecommendedTip'}));
      }
    } else if (this.state.current == 2) {
      this.createLink();
      const current = this.state.current + 1;
      this.setState({ current });
    } else {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleSend = (e) => {
    this.child.handleOk();
  };

  onRef = (ref) => {
    this.child = ref;
  };

  createLink = (e) => {
    let createLink = this.store.state().get('createLink').toJS();
    if (createLink.recommendationGoodsInfoRels.length > 0) {
      this.store.onCreate(createLink);
      //localStorage.setItem('enable', 'true');
    } else {
      message.error(RCi18n({id:'Order.RecommendedTip'}));
    }
  };

  render() {
    const { Step } = Steps;
    const { current, enableFlag } = this.state;
    const steps = [
      {
        title: RCi18n({id:'Order.ChoosePrescriber'})
      },
      {
        title: RCi18n({id:'Order.ChooseProducts'})
      },
      {
        title: RCi18n({id:'Order.WriteReason'})
      },
      {
        title: RCi18n({id:'Order.SendToRecipient'})
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{history.location.state ? RCi18n({id:'Order.PrescriptionPortalDetail'}) : RCi18n({id:'Order.NewPrescription'})}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={history.location.state ? RCi18n({id:'Order.PrescriptionPortalDetail'}) : RCi18n({id:'Order.NewPrescription'})} />
        </div>
        <div className="container step" id="recommendation">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            {current == 0 ? (
              <Detail />
            ) : current == 1 ? (
              <Detail2 />
            ) : current == 2 ? (
              <div className="reasonsInput">
                <span>{RCi18n({id:'Order.RecommendedReasons'})}</span>
                {history.location.state ? (
                  <Input size="large" placeholder={this.store.state().get('detailProductList').recommendationReasons} style={{ border: '1px #dedede solid' }} disabled={localStorage.getItem('enable') ? true : false} />
                ) : (
                  <Input size="large" placeholder={RCi18n({id:'Order.InputRecommendedReasons'})} style={{ border: '1px #dedede solid' }} onChange={this.onInput} disabled={localStorage.getItem('enable') ? true : false} />
                )}
              </div>
            ) : current == 3 ? (
              <div className="btn">
                <PublishTooltip onRef={this.onRef} />
              </div>
            ) : null}
          </div>
          <div className="steps-action">
            {current > 0 && (
              <Button shape="round" style={{ margin: '0 20px' }} onClick={() => this.prev()}>
                {RCi18n({id:'Order.Previous'})}
              </Button>
            )}
            {current === 2 && (
              <Button type="primary" shape="round" onClick={() => this.next()}>
                {RCi18n({id:'Order.CreateLink'})}
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" shape="round" style={{ margin: '0 8px' }} onClick={this.handleSend}>
                {RCi18n({id:'Order.Send'})}
              </Button>
            )}
            {current < steps.length - 2 && (
              <Button type="primary" shape="round" onClick={() => this.next()}>
                {RCi18n({id:'Order.Next'})}
              </Button>
            )}
          </div>

          {/* <div className="text">
            <Icon type="info-circle" />
            <span>Do not recommend more than five items at a time.</span>
          </div> */}

          {history.location.state ? <User /> : null}
        </div>
      </div>
    );
  }
}
