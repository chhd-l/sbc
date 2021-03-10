import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import ConsumerInformation from './components/consumerInformation';
import SelectedProduct from './components/selectedProduct';
import PaymentInformation from './components/paymentInformation';
import * as webapi from './webapi';

const { Step } = Steps;

class ManualOrder extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Valet order',
      current: 0,
      type: this.props.location.state ? this.props.location.state.type : 'add',
      navigation: {
        language: this.props.location.state ? this.props.location.state.language : '',
        enable: 1
      },
      noLanguageSelect: this.props.location.state && this.props.location.state.noLanguageSelect,
      topNames: this.props.location.state ? this.props.location.state.topNames : [],
      store: {}
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.addField = this.addField.bind(this);
  }
  next(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentWillMount() {}

  addField(field, value) {
    let data = this.state.navigation;
    data[field] = value;
    this.setState({
      navigation: data
    });
  }

  render() {
    const { id, current, title, navigation, store, noLanguageSelect, topNames } = this.state;
    const steps = [
      {
        title: 'Consumer information',
        controller: <ConsumerInformation stepName={'Consumer information'} navigation={navigation} addField={this.addField} />
      },
      {
        title: 'Selected product',
        controller: <SelectedProduct stepName={'Selected product'} navigation={navigation} addField={this.addField} form={this.props.form} noLanguageSelect={noLanguageSelect} store={store} topNames={topNames} />
      },
      {
        title: 'Delivery & payment information',
        controller: <PaymentInformation stepName={'Delivery & payment information'} navigation={navigation} addField={this.addField} form={this.props.form} noLanguageSelect={noLanguageSelect} />
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
          <Steps current={current} labelPlacement="vertical">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].controller}</div>
          <div className="steps-action">
            {current === 0 && (
              <span>
                <Button type="primary">Register</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/customer-list');
                  }}
                >
                  Pet owner list
                </Button>
              </span>
            )}
            {current === 1 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> Return
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)}>
                Next step <Icon type="right" />
              </Button>
            )}
            {/* {current !== steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.updateNavigation(e)}>
                Submit <Icon type="right" />
              </Button>
            )} */}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(ManualOrder);
