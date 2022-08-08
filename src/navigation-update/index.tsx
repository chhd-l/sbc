import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const, RCi18n } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import NavigationLanguage from './components/navigationLanguage';
import BasicInformation from './components/basicInformation';
import Interaction from './components/interaction';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
const { Step } = Steps;

class NavigationUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: '',
      current: 0,
      type: this.props.location.state ? this.props.location.state.type : 'add',
      navigation: {
        language: this.props.location.state ? this.props.location.state.language : '',
        enable: 1
      },
      noLanguageSelect: this.props.location.state && this.props.location.state.noLanguageSelect,
      topNames: this.props.location.state ? this.props.location.state.topNames : [],
      store: {},
      SeoSettingSaveRequest: {
        h1: '{description title}',
        h2: '{product name}',
        titleSource: 'Royal Cannin|{name}s'
      }
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.addField = this.addField.bind(this);
    this.addSeoSetting = this.addSeoSetting.bind(this);
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

  componentWillMount() {
    this.setState({
      title:
        this.state.type === 'edit' ? (
          <FormattedMessage id="Content.EditNavigationItem" />
        ) : (
          <FormattedMessage id="Content.CreateNavigationItem" />
        )
    });
    if (this.state.type === 'edit') {
      webapi
        .getNavigationById(this.state.id)
        .then((data) => {
          const { res } = data;
          if (res.code === Const.SUCCESS_CODE) {
            this.setState({
              navigation: res.context
            });
          }
        })
        .catch((err) => {});
    }
  }

  addField(field, value) {
    console.log(this.state);
    let data = this.state.navigation;
    data[field] = value;
    this.setState({
      navigation: data
    });
  }
  addSeoSetting(field, value) {
    console.log(this.state);
    let data = this.state.SeoSettingSaveRequest;
    data[field] = value;
    this.setState({
      SeoSettingSaveRequest: data
    });
  }
  updateNavigation(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { navigation, SeoSettingSaveRequest, type, id } = this.state;
        if (type === 'edit') {
          navigation.id = id; // edit by id
          webapi
            .updateNavigation(navigation)
            .then((data) => {
              const { res } = data;
              if (res.code === Const.SUCCESS_CODE) {
                message.success(RCi18n({ id: 'Content.OperateSuccessfully' }));
                history.push({
                  pathname: '/navigation-list',
                  state: { language: navigation.language }
                });
              }
            })
            .catch((err) => {});
        } else if (type === 'add') {
          navigation.parentId = id; // add by parentId
          let obj = {
            NavigationRequest: navigation,
            SeoSettingSaveRequest: SeoSettingSaveRequest
          };
          webapi
            .addNavigation(obj)
            .then((data) => {
              const { res } = data;
              if (res.code === Const.SUCCESS_CODE) {
                message.success(RCi18n({ id: 'Content.OperateSuccessfully' }));
                history.push({
                  pathname: '/navigation-list',
                  state: { language: navigation.language }
                });
              }
            })
            .catch((err) => {});
        }
      }
    });
  }
  render() {
    const {
      id,
      current,
      title,
      navigation,
      SeoSettingSaveRequest,
      store,
      noLanguageSelect,
      topNames
    } = this.state;
    const steps = [
      {
        title: <FormattedMessage id="Content.NavigationLanguage" />,
        controller: <NavigationLanguage navigation={navigation} addField={this.addField} />
      },
      {
        title: <FormattedMessage id="Content.BasicInformation" />,
        controller: (
          <BasicInformation
            navigation={navigation}
            addField={this.addField}
            form={this.props.form}
            noLanguageSelect={noLanguageSelect}
            store={store}
            topNames={topNames}
          />
        )
      },
      {
        title: <FormattedMessage id="Content.Interaction" />,
        controller: (
          <Interaction
            navigation={navigation}
            SeoSettingSaveRequest={SeoSettingSaveRequest}
            addField={this.addField}
            addSeoSetting={this.addSeoSetting}
            form={this.props.form}
            noLanguageSelect={noLanguageSelect}
          />
        )
      }
    ];
    if (noLanguageSelect) {
      steps.shift();
    }
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
            {current > 0 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> <FormattedMessage id="Content.Return" />
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)}>
                <FormattedMessage id="Content.NextStep" /> <Icon type="right" />
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.updateNavigation(e)}>
                <FormattedMessage id="Content.Submit" /> <Icon type="right" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(NavigationUpdate);
