import React, { Component } from 'react';
import { Headline, BreadCrumb, history } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import NavigationLanguage from './components/navigationLanguage';
import BasicInformation from './components/basicInformation';
import Interaction from './components/interaction';
import * as webapi from './webapi';

const { Step } = Steps;

class NavigationUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: this.props.match.params.id ? 'Edit Navigation Item' : 'Create Navigation Item',
      current: 0,
      type: this.props.location.state ? this.props.location.state.type : 'add',
      navigation: {},
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

  addField(field, value) {
    let data = this.state.navigation;
    data[field] = value;
    this.setState({
      navigation: data
    });
    console.log(data);
  }
  updateNavigation(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { navigation, type, id } = this.state;
        console.log(navigation);
        if (type === 'edit') {
          navigation.id = id; // edit by id
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
        } else if (type === 'add') {
          navigation.parentId = id; // add by parentId
          webapi
            .addNavigation(navigation)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success(res.message || 'Add successful');
                history.push({ pathname: '/navigation-list', state: { language: navigation.language } });
              } else {
                message.error(res.message || 'Add Failed');
              }
            })
            .catch((err) => {
              message.error(err || 'Add Failed');
            });
        }
      }
    });
  }
  render() {
    const { id, current, title, navigation, store } = this.state;
    const steps = [
      {
        title: 'Navigation language',
        controller: <NavigationLanguage navigation={navigation} addField={this.addField} store={store} />
      },
      {
        title: 'Basic information',
        controller: <BasicInformation navigation={navigation} addField={this.addField} form={this.props.form} store={store} />
      },
      {
        title: 'Interaction',
        controller: <Interaction navigation={navigation} addField={this.addField} form={this.props.form} />
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
              <Button type="primary" onClick={(e) => this.next(e)}>
                Next step <Icon type="right" />
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.updateNavigation(e)}>
                Submit <Icon type="right" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(NavigationUpdate);
