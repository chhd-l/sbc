import React, { Component } from 'react';
import { Headline, BreadCrumb, history } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon } from 'antd';
import './index.less';
import NavigationLanguage from './components/navigationLanguage';
import BasicInformation from './components/basicInformation';
import Interaction from './components/interaction';
import * as webapi from './webapi';

const { Step } = Steps;

export default class NavigationUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: this.props.match.params.id ? 'Edit Navigation Item' : 'Create Navigation Item',
      current: 0,
      navigation: {}
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.addField = this.addField.bind(this);
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  addField(field, value) {
    let data = this.state.navigation;
    data[field] = value;
    this.setState({
      navigation: data
    });
    console.log(data);
  }
  updateNavigation() {
    const { navigation } = this.state;
    webapi
      .updateNavigation(navigation)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Update successful');
          history.push({ pathname: '/navigation-list', state: { language: navigation.language } });
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  }
  render() {
    const { id, current, title, navigation } = this.state;
    const steps = [
      {
        title: 'Navigation language',
        controller: <NavigationLanguage navigation={navigation} addField={this.addField} />
      },
      {
        title: 'Basic information',
        controller: <BasicInformation navigation={navigation} addField={this.addField} />
      },
      {
        title: 'Interaction',
        controller: <Interaction navigation={navigation} addField={this.addField} />
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container-search" id="navigationStep">
          <Headline title={title} />
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].controller}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> Return
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                Next step <Icon type="right" />
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                Submit <Icon type="right" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
