import React from 'react';
import {
  Breadcrumb,
  Tooltip,
  Icon,
  Input,
  Modal,
  Steps,
  Button,
  message
} from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history } from 'qmkit';
import Detail from './components/detail';
import Detail2 from './components/detail2';
import PublishButton from './components/publishButton';
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
  }

  onInput = (e) => {
    this.store.onCreateLink({
      field: 'recommendationReasons',
      value: e.target.value
    });
  };
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  getEnableFlag() {
    this.setState(
      {
        enableFlag: true
      },
      () => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxx', this.state.enableFlag);
      }
    );
  }
  render() {
    const { Step } = Steps;
    const { current, enableFlag } = this.state;
    const steps = [
      {
        title: 'Choose your prescriber'
      },
      {
        title: 'Choose products'
      },
      {
        title: 'Write reason'
      },
      {
        title: 'Send to recipient'
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {history.location.state
              ? 'Prescription portal detail'
              : 'New Prescription portal'}
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline
            title={
              history.location.state
                ? 'Prescription portal detail'
                : 'New Prescription portal'
            }
          />
        </div>
        <div className="container" id="recommendation">
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
                <span>Recommended Reasons</span>
                {history.location.state ? (
                  <Input
                    size="large"
                    placeholder={
                      this.store.state().get('detailProductList')
                        .recommendationReasons
                    }
                    style={{ border: '1px #dedede solid' }}
                    disabled={localStorage.getItem('enable') ? true : false}
                  />
                ) : (
                  <Input
                    size="large"
                    placeholder="Input Recommended Reasons"
                    style={{ border: '1px #dedede solid' }}
                    onChange={this.onInput}
                    disabled={localStorage.getItem('enable') ? true : false}
                  />
                )}
              </div>
            ) : current == 3 ? (
              <div className="btn">
                <PublishButton />
              </div>
            ) : null}
          </div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" shape="round" onClick={() => this.next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                shape="round"
                onClick={() => message.success('Processing complete!')}
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button shape="round" style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                Previous
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
