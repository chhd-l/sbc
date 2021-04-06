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

const { Step } = Steps;
@StoreProvider(AppStore, { debug: __DEV__ })
class RecommendationAdd extends Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {
      title: 'New Prescription',
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
        console.log(values)
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

  getFormParams = (params) => {
    this.setState({
      params: { ...this.state.params, ...params }
    });
  };
  done(e) {
    const felinReco = this.store.state().get('felinReco')
    //  const goodsQuantity=this.store.state().get('goodsQuantity')
    const appointmentVO = this.store.state().get('appointmentVO')
    const customerPet = this.store.state().get('customerPet')
    const productselect = this.store.state().get('productselect')
    let goodsQuantity = productselect.map(({ goodsInfoNo, quantity }) => {
      return { goodsInfoNo, quantity }
    })
    this.store.fetchFelinSave({ ...felinReco, goodsQuantity, appointmentVO, customerPet })
  }
  render() {
    const { current, title } = this.state;
    const steps = [
      {
        title: 'Choose your role',
        controller: <ChooseYourRole form={this.props.form} />
      },
      {
        title: 'Fill in Pet Info',
        controller: <FillinPetInfo form={this.props.form} />
      },
      {
        title: 'Choose Products',
        controller: <ChooseProducts />
      },
      {
        title: 'Write Tips',
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
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.done(e)}>
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(RecommendationAdd);
