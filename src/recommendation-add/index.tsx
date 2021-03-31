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
class ManualOrder extends Component<any, any> {
  store: AppStore;
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    let { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    this.state = {
      id: this.props.match.params.id,
      title: 'New Prescription',
      current: 3,
      status: 1,
      params: {},
      storeId: storeId,
      list: []
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  next(e) {
    e.preventDefault();
    let {  current } = this.state;
    this.props.form.validateFields((err,values) => {
      if (!err) {
        let _params={...this.state.params,...values}
        current++;
        this.setState({
          current,
          params:_params
        })
        this.setState({ current });
      }
    });
  }


  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentWillMount() { 
  }

  getFormParams = (params) => {
    this.setState({
      params:{...this.state.params,...params}
    });
  };
  done(e){
    console.log()
  }
  render() {
    const { current, title, params } = this.state;
    const steps = [
      {
        title: 'Choose your role',
        controller: <ChooseYourRole form={this.props.form} allParams={params}  getFormParams={this.getFormParams}/>
      },
      {
        title: 'Fill in Pet Info',
        controller: <FillinPetInfo   form={this.props.form}/>
      },
      {
        title: 'Choose Products',
        controller: <ChooseProducts />
      },
      {
        title: 'Write Tips',
        controller: <WriteTips  form={this.props.form}/>
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

export default Form.create()(ManualOrder);
