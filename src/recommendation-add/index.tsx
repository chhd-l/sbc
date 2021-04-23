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
class RecommendationAdd extends Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {
      title: RCi18n({id:'Prescriber.New Prescription'}),
      current: 0,
      status: 1,
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  next(e) {
    e.preventDefault();
    let { current } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        current++;
        this.setState({ current });
      }
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  componentDidMount() {
    let { id } = this.props?.match?.params ?? {};
    this.store.onSettingAddOrEdit(id ? true : false);
    id && this.store.init({ felinRecoId: id })
  }

 
  done(e) {
    const felinReco = this.store.state().get('felinReco')
    //  const goodsQuantity=this.store.state().get('goodsQuantity')
    const appointmentVO = this.store.state().get('appointmentVO')
    const customerPet = this.store.state().get('customerPet')
    const productselect = this.store.state().get('productselect')
    let goodsQuantity = productselect.map(({ goodsInfoNo, quantity }) => {
      return { goodsInfoNo, quantity }
    })
    delete felinReco['_root']
    delete customerPet['_root']
    delete appointmentVO['_root']
    delete felinReco['size']
    delete customerPet['size']
    delete appointmentVO['size']
    delete felinReco['__altered']
    delete customerPet['__altered']
    delete appointmentVO['__altered']
    let weight={
      measure:customerPet.measure||0,
      measureUnit:customerPet.measureUnit||'Kg',
      type:2
    }
    customerPet.weight=JSON.stringify(weight);
    let p={ ...felinReco, goodsQuantity, appointmentVO, customerPet };
    this.store.fetchFelinSave(p)
  }
  render() {
    const { current, title } = this.state;
    const steps = [
      {
        title: RCi18n({id:'Prescriber.Chooseyourrole'}),
        controller: <ChooseYourRole form={this.props.form} />
      },
      {
        title: RCi18n({id:'Prescriber.FillinPetInfo'}),
        controller: <FillinPetInfo form={this.props.form} />
      },
      {
        title: RCi18n({id:'Prescriber.Choose Product'}),
        controller: <ChooseProducts />
      },
      {
        title: RCi18n({id:'Prescriber.Write Tips'}),
        controller: <WriteTips form={this.props.form} />
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
          <div className="steps-action">

            {current >= 1 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <FormattedMessage id="Prescriber.Previous" />
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)}>
                 <FormattedMessage id="Prescriber.Next" />
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.done(e)}>
                <FormattedMessage id="Prescriber.Done" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(RecommendationAdd);
