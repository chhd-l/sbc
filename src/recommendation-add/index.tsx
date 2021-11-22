import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const, cache } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import ChooseYourRole from './components/chooseYourRole';
import FillinPetInfo from './components/fillinPetInfo';
import ChooseProducts from './components/chooseProducts';
import WriteTips from './components/writeTips';
import AppStore from './store';
import { StoreProvider } from 'plume2';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';


const { Step } = Steps;
@StoreProvider(AppStore, { debug: __DEV__ })
export default class RecommendationAdd extends Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {
      title: RCi18n({id:'Prescriber.New Prescription'}),
      current: 0,
    };
  }

  componentDidMount() {
    let { id } = this.props?.match?.params ?? {};
    this.store.onSettingAddOrEdit(id ? true : false);
    id && this.store.init({ felinRecoId: id })
  }
  render() {
    const {  title } = this.state;
    const current = this.store.state().get('currentStep')
    console.log(current)
    const steps = [
      {
        title: RCi18n({id:'Prescriber.Chooseyourrole'}),
        controller: <ChooseYourRole  />
      },
      {
        title: RCi18n({id:'Prescriber.FillinPetInfo'}),
        controller: <FillinPetInfo/>
      },
      {
        title: RCi18n({id:'Prescriber.Choose Product'}),
        controller: <ChooseProducts />
      },
      {
        title: RCi18n({id:'Prescriber.Write Tips'}),
        controller: <WriteTips />
      }
    ];
    // if (noLanguageSelect) {
    //   steps.shift();
    // }
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search" id="navigationStep">
          <Headline title={title} />
          <Steps current={current} >
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].controller}</div>
         
        </div>
      </div>
    );
  }
}

